import SQLite from 'tauri-plugin-sqlite-api';

/** The path will be 'src-tauri/test.db', you can customize the path */
export const getDB = async () => {
    const db = await SQLite.open('./test.db');
    console.log('db', db);
};
