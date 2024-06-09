export type StorageConnection = {
  host: string;
  user: string;
  password: string;
  port: number;
  color: string;
};

const key = "connections";

export const StorageConnections = {
  getAll(): StorageConnection[] {
    return JSON.parse(localStorage.getItem(key) || "[]");
  },
  add(connection: StorageConnection) {
    const connections = StorageConnections.getAll();
    connections.push(connection);
    localStorage.setItem(key, JSON.stringify(connections));
  },
  remove(value: StorageConnection) {
    const connections = StorageConnections.getAll();
    const index = connections.findIndex((connection) => connection === value);
    connections.splice(index, 1);
    localStorage;
  },
};
