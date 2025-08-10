import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbDir = path.resolve('backend', 'db');
const dbFile = path.join(dbDir, 'docs.db');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const initDB = async () => {
  const db = await open({
    filename: dbFile,
    driver: sqlite3.Database
  });

  const schema = fs.readFileSync(path.join(dbDir, 'schema.sql'), 'utf-8');
  await db.exec(schema);

  return db;
};
