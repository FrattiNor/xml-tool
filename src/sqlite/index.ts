import SQLite from 'tauri-plugin-sqlite-api';

const DB_KEY = '__sqlite_db__';
const DB_FILE_NAME = 'sqlite';

/** The path will be 'src-tauri/sqlite.db', you can customize the path */
export const getDB = async () => {
    const w = window as Record<string, any>;

    const db_in_window = w[DB_KEY] as SQLite | undefined;

    if (db_in_window) {
        return db_in_window;
    } else {
        const db = await SQLite.open(`./${DB_FILE_NAME}.db`);
        w[DB_KEY] = db;
        return db;
    }
};
