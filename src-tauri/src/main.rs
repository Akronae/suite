// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod json;

use std::{collections::HashMap, sync::OnceLock};

use json::row_to_json;
use serde::ser::SerializeStruct;
use sqlx::{
    mysql::{MySqlPoolOptions, MySqlRow},
    MySql, Pool,
};
use tokio::sync::{Mutex, MutexGuard, SetError};

#[derive(thiserror::Error, Debug)]
enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Sqlx(#[from] sqlx::Error),
    #[error(transparent)]
    SetError(#[from] SetError<HashMap<String, Pool<MySql>>>),
    #[error("Pool not found")]
    PoolNotFound(String),
    #[error("Unknown error")]
    Unknown,
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        let mut obj = serializer.serialize_struct("error", 2)?;
        obj.serialize_field("message", &self.to_string())?;
        let type_str = &format!("{:?}", self);
        let type_str = type_str.split("{").next().unwrap_or(type_str);
        let type_str = type_str.replace("(", "::");
        let type_str = type_str.trim();
        obj.serialize_field("type", type_str)?;
        obj.end()
    }
}

async fn get_pools() -> MutexGuard<'static, HashMap<String, Pool<MySql>>> {
    static MAP: OnceLock<Mutex<HashMap<String, Pool<MySql>>>> = OnceLock::new();
    MAP.get_or_init(|| Mutex::new(HashMap::new())).lock().await
}

#[tauri::command(async)]
async fn connect(
    host: String,
    user: String,
    password: String,
    port: i16,
    database: Option<String>,
) -> Result<String, Error> {
    let pool_id = format!("{}@{}:{}", user, host, port);
    let mut pools = get_pools().await;

    if pools.contains_key(&pool_id) {
        return Ok(pool_id);
    }

    let mut conn_str = format!("mysql://{}:{}@{}:{}", user, password, host, port);
    if let Some(database) = database {
        conn_str.push_str(&format!("/{}", database));
    }
    let pool = MySqlPoolOptions::new()
        .max_connections(5)
        .connect(&conn_str)
        .await?;

    pools.insert(pool_id.clone(), pool);

    Ok(pool_id)
}

#[tauri::command(async)]
async fn query(pool_id: String, query: String) -> Result<Vec<serde_json::Value>, Error> {
    let pools = get_pools().await;
    let pool = pools
        .get(&pool_id)
        .ok_or(Error::PoolNotFound(pool_id.to_string()))?;
    let rows = sqlx::query(&query)
        .map(|row: MySqlRow| row_to_json(&row))
        .fetch_all(pool)
        .await?;

    Ok(rows)
}

pub type SafeError = Box<dyn std::error::Error + Send + Sync + 'static>;

#[tokio::main]
async fn main() -> Result<(), SafeError> {
    std::env::set_var("RUST_BACKTRACE", "1");
    std::env::set_var("RUST_LOG", "info,sqlx=info");

    Ok(tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![connect, query])
        .run(tauri::generate_context!())
        .expect("error while running tauri application"))
}
