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

  await db.exec('PRAGMA foreign_keys = ON;');

  const schema = fs.readFileSync(path.join(dbDir, 'schema.sql'), 'utf-8');
  await db.exec(schema);

  // Additive migration: add criticality column to existing databases
  const cols = await db.all('PRAGMA table_info(component_dependencies)');
  if (!cols.find(c => c.name === 'criticality')) {
    await db.exec(
      "ALTER TABLE component_dependencies ADD COLUMN criticality TEXT NOT NULL DEFAULT 'optional'"
    );
  }

  // Normalize legacy data before enforcing stronger constraints.
  await db.exec("UPDATE component_dependencies SET criticality = 'optional' WHERE criticality IS NULL OR criticality NOT IN ('critical', 'optional')");
  await db.exec('DELETE FROM component_dependencies WHERE component_id = depends_on_id');
  await db.exec(`
    DELETE FROM component_dependencies
    WHERE id NOT IN (
      SELECT MIN(id)
      FROM component_dependencies
      GROUP BY component_id, depends_on_id
    )
  `);

  // Performance: indexes for dependency traversal (critical for impact-tree CTE).
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_cd_depends_on_id ON component_dependencies(depends_on_id)'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_cd_component_id ON component_dependencies(component_id)'
  );

  // Additive constraint hardening for existing databases.
  await db.exec(
    'CREATE UNIQUE INDEX IF NOT EXISTS uq_component_dependency_edge ON component_dependencies(component_id, depends_on_id)'
  );
  await db.exec(`
    CREATE TRIGGER IF NOT EXISTS trg_component_dependencies_no_self_insert
    BEFORE INSERT ON component_dependencies
    FOR EACH ROW
    WHEN NEW.component_id = NEW.depends_on_id
    BEGIN
      SELECT RAISE(ABORT, 'A component cannot depend on itself');
    END;
  `);
  await db.exec(`
    CREATE TRIGGER IF NOT EXISTS trg_component_dependencies_no_self_update
    BEFORE UPDATE ON component_dependencies
    FOR EACH ROW
    WHEN NEW.component_id = NEW.depends_on_id
    BEGIN
      SELECT RAISE(ABORT, 'A component cannot depend on itself');
    END;
  `);
  await db.exec(`
    CREATE TRIGGER IF NOT EXISTS trg_component_dependencies_criticality_insert
    BEFORE INSERT ON component_dependencies
    FOR EACH ROW
    WHEN NEW.criticality NOT IN ('critical', 'optional')
    BEGIN
      SELECT RAISE(ABORT, 'Invalid criticality value');
    END;
  `);
  await db.exec(`
    CREATE TRIGGER IF NOT EXISTS trg_component_dependencies_criticality_update
    BEFORE UPDATE ON component_dependencies
    FOR EACH ROW
    WHEN NEW.criticality NOT IN ('critical', 'optional')
    BEGIN
      SELECT RAISE(ABORT, 'Invalid criticality value');
    END;
  `);

  return db;
};
