use bigdecimal::ToPrimitive;
use chrono::{DateTime, Utc};
use serde_json::{self, Map, Value};
use sqlx::mysql::MySqlRow;
use sqlx::Decode;
use sqlx::{Column, Row, TypeInfo, ValueRef};

pub fn row_to_json(row: &MySqlRow) -> Value {
    use Value::Object;

    let columns = row.columns();
    let mut map = Map::new();
    for col in columns {
        let key = col.name().to_string();
        let value: Value = sql_to_json(row, col);
        map.insert(key, value);
    }
    Object(map)
}

pub fn sql_to_json(row: &MySqlRow, col: &sqlx::mysql::MySqlColumn) -> Value {
    let raw_value_result = row.try_get_raw(col.ordinal());
    match raw_value_result {
        Ok(raw_value) if !raw_value.is_null() => {
            let mut raw_value = Some(raw_value);
            let decoded = sql_nonnull_to_json(|| {
                raw_value
                    .take()
                    .unwrap_or_else(|| row.try_get_raw(col.ordinal()).unwrap())
            });
            decoded
        }
        Ok(_null) => Value::Null,
        Err(_) => Value::Null,
    }
}

pub fn sql_nonnull_to_json<'r>(
    mut get_ref: impl FnMut() -> sqlx::mysql::MySqlValueRef<'r>,
) -> Value {
    let raw_value = get_ref();
    let type_name = raw_value.type_info();
    let type_name = type_name.name();
    match type_name {
        "REAL" | "FLOAT" | "NUMERIC" | "FLOAT4" | "FLOAT8" | "DOUBLE" => {
            <f64 as Decode<sqlx::mysql::MySql>>::decode(raw_value)
                .unwrap_or(f64::NAN)
                .into()
        }
        "DECIMAL" => <sqlx::types::BigDecimal as Decode<sqlx::mysql::MySql>>::decode(raw_value)
            .unwrap()
            .to_f64()
            .into(),
        "INT8" | "BIGINT" | "INTEGER" => <i64 as Decode<sqlx::mysql::MySql>>::decode(raw_value)
            .unwrap_or_default()
            .into(),
        "INT" | "INT4" => <i32 as Decode<sqlx::mysql::MySql>>::decode(raw_value)
            .unwrap_or_default()
            .into(),
        "INT2" | "SMALLINT" => <i16 as Decode<sqlx::mysql::MySql>>::decode(raw_value)
            .unwrap_or_default()
            .into(),
        "BOOL" | "BOOLEAN" => <bool as Decode<sqlx::mysql::MySql>>::decode(raw_value)
            .unwrap_or_default()
            .into(),
        "DATE" => <chrono::NaiveDate as Decode<sqlx::mysql::MySql>>::decode(raw_value)
            .as_ref()
            .map_or_else(std::string::ToString::to_string, ToString::to_string)
            .into(),
        "TIME" => <chrono::NaiveTime as Decode<sqlx::mysql::MySql>>::decode(raw_value)
            .as_ref()
            .map_or_else(ToString::to_string, ToString::to_string)
            .into(),
        "DATETIME" | "DATETIME2" | "DATETIMEOFFSET" | "TIMESTAMP" | "TIMESTAMPTZ" => {
            let mut date_time = <DateTime<Utc> as Decode<sqlx::mysql::MySql>>::decode(get_ref());
            if date_time.is_err() {
                date_time =
                    <chrono::NaiveDateTime as Decode<sqlx::mysql::MySql>>::decode(raw_value)
                        .map(|d| d.and_utc());
            }
            Value::String(
                date_time
                    .as_ref()
                    .map_or_else(ToString::to_string, DateTime::to_rfc3339),
            )
        }
        "JSON" | "JSON[]" | "JSONB" | "JSONB[]" => {
            <Value as Decode<sqlx::mysql::MySql>>::decode(raw_value).unwrap_or_default()
        }
        // Deserialize as a string by default
        _ => <String as Decode<sqlx::mysql::MySql>>::decode(raw_value)
            .unwrap_or_default()
            .into(),
    }
}
