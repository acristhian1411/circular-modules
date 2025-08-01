export const getAllComponents = async (db) => {
  const components = await db.all('SELECT cp.name as parent_name, c.* FROM components c left join components cp on cp.id = c.parent_id');

  if (!components || components.length === 0) {
    throw new Error('No components found');
  }
  return components;
};

export const getComponent = async (db, id) => {
  const component = await db.get('SELECT cp.name as parent_name, c.* FROM components c left join components cp on cp.id = c.parent_id WHERE c.id = ?', [id]);
  if (!component) {
    throw new Error('Component not found');
  }
  const children = await db.all('SELECT * FROM components WHERE parent_id = ?', [id]);
  component.children = children;
  return component;
};

export const getComponentChildren = async (db, id) => {
  const children = await db.all('SELECT * FROM components WHERE parent_id = ?', [id]);
  if (!children) {
    throw new Error('Component not found');
  }
  return children;
};

export const searchComponent = async(db, name) => {
  const components = await db.all('SELECT * FROM components WHERE name LIKE ? or description ilike ?', [`%${name}%`, `%${name}%`]);
  if (!components) {
    throw new Error('Component not found');
  }
  return components;
}

export const createComponent = async (db, { name, type, parent_id, description }) => {
  const result = await db.run(
    'INSERT INTO components (name, type, parent_id, description) VALUES (?, ?, ?, ?)',
    [name, type, parent_id || null, description || null]
  );
  if (!result) {
    throw new Error('Failed to create component');
  }
  return { id: result.lastID, message: 'Component created successfully' };
};

export const updateComponent = async (db, id, { name, type, parent_id, description }) => {
  const result = await db.run(
    'UPDATE components SET name = ?, type = ?, parent_id = ?, description = ? WHERE id = ?',
    [name, type, parent_id || null, description || null, id]
  );
  if (!result) {
    throw new Error('Failed to update component');
  }
  return { id: result.lastID, message: 'Component updated successfully' };
};

export const deleteComponent = async (db, id) => {
  const result = await db.run('DELETE FROM components WHERE id = ?', [id]);
  if (!result) {
    throw new Error('Failed to delete component');
  }
  return { id: result.lastID, message: 'Component deleted successfully' };
};

export const addDependency = async (db, component_id, depends_on_id) => {
  const result = await db.run(
    'INSERT INTO component_dependencies (component_id, depends_on_id) VALUES (?, ?)',
    [component_id, depends_on_id]
  );
  if (!result) {
    throw new Error('Failed to add dependency');
  }
  return { id: result.lastID, message: 'Dependency added successfully' };
};

export const getDependencies = async (db, component_id) => {
  const dependencies = await db.all(
    `SELECT c.*, d.depends_on_id
     FROM components c
     JOIN component_dependencies d ON d.depends_on_id = c.id
     WHERE d.component_id = ?`,
    [component_id]
  );
  if (!dependencies) {
    throw new Error('Failed to get dependencies');
  }
  return dependencies;
};

export const deleteDependency = async (db, depends_on_id) => {
  const result = await db.run(
    'DELETE FROM component_dependencies WHERE depends_on_id = ?',
    [depends_on_id]
  );
  if (!result) {
    throw new Error('Failed to delete dependency');
  }
  return { id: result.lastID, message: 'Dependency deleted successfully' };
};
