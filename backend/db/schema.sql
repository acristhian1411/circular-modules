CREATE TABLE IF NOT EXISTS components (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    parent_id INTEGER,
    FOREIGN KEY (parent_id) REFERENCES components(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS component_dependencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    component_id INTEGER NOT NULL,
    depends_on_id INTEGER NOT NULL,
    criticality TEXT NOT NULL DEFAULT 'optional',
    CHECK (criticality IN ('critical', 'optional')),
    CHECK (component_id != depends_on_id),
    UNIQUE (component_id, depends_on_id),
    FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE,
    FOREIGN KEY (depends_on_id) REFERENCES components(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cd_depends_on_id ON component_dependencies(depends_on_id);
CREATE INDEX IF NOT EXISTS idx_cd_component_id  ON component_dependencies(component_id);
