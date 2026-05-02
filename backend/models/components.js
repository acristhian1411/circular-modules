export const getAllComponents = async (db, filters = {}) => {
  const conditions = [];
  const params = [];

  if (filters.name) {
    conditions.push('c.name LIKE ?');
    params.push(`%${filters.name}%`);
  }
  if (filters.type) {
    conditions.push('c.type = ?');
    params.push(filters.type);
  }
  if (filters.parent_id !== undefined && filters.parent_id !== null) {
    conditions.push('c.parent_id = ?');
    params.push(filters.parent_id);
  }
  if (filters.criticality) {
    conditions.push(
      'EXISTS (SELECT 1 FROM component_dependencies cd2 WHERE cd2.component_id = c.id AND cd2.criticality = ?)'
    );
    params.push(filters.criticality);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return await db.all(
    `SELECT
      cp.name as parent_name,
      c.*,
      COUNT(cd.id) as dependency_count,
      SUM(CASE WHEN cd.criticality = 'critical' THEN 1 ELSE 0 END) as critical_dependency_count
     FROM components c
     LEFT JOIN components cp ON cp.id = c.parent_id
     LEFT JOIN component_dependencies cd ON cd.component_id = c.id
     ${where}
     GROUP BY c.id, cp.name
     ORDER BY c.name ASC`,
    params
  );
};

export const getComponent = async (db, id) => {
  const component = await db.get(
    'SELECT cp.name as parent_name, c.* FROM components c LEFT JOIN components cp ON cp.id = c.parent_id WHERE c.id = ?',
    [id]
  );
  if (!component) {
    throw new Error('Component not found');
  }
  const children = await db.all('SELECT * FROM components WHERE parent_id = ?', [id]);
  component.children = children;
  return component;
};

export const getComponentChildren = async (db, id) => {
  return await db.all('SELECT * FROM components WHERE parent_id = ?', [id]);
};

export const createComponent = async (db, { name, type, parent_id, description }) => {
  if (!name || !type) {
    throw new Error('name and type are required');
  }
  const result = await db.run(
    'INSERT INTO components (name, type, parent_id, description) VALUES (?, ?, ?, ?)',
    [name, type, parent_id || null, description || null]
  );
  return { id: result.lastID, message: 'Component created successfully' };
};

export const updateComponent = async (db, id, { name, type, parent_id, description }) => {
  if (!name || !type) {
    throw new Error('name and type are required');
  }
  const result = await db.run(
    'UPDATE components SET name = ?, type = ?, parent_id = ?, description = ? WHERE id = ?',
    [name, type, parent_id || null, description || null, id]
  );
  if (result.changes === 0) {
    throw new Error('Component not found');
  }
  return { id: Number(id), message: 'Component updated successfully' };
};

export const deleteComponent = async (db, id) => {
  const dependents = await db.all(
    `SELECT c.name FROM components c
     JOIN component_dependencies cd ON cd.component_id = c.id
     WHERE cd.depends_on_id = ? AND cd.criticality = 'critical'`,
    [id]
  );
  if (dependents.length > 0) {
    const names = dependents.map(d => d.name).join(', ');
    throw new Error(`Cannot delete: component is a critical dependency for [${names}]`);
  }
  const result = await db.run('DELETE FROM components WHERE id = ?', [id]);
  if (result.changes === 0) {
    throw new Error('Component not found');
  }
  return { id: Number(id), message: 'Component deleted successfully' };
};

export const addDependency = async (db, component_id, depends_on_id, criticality = 'optional') => {
  if (Number(component_id) === Number(depends_on_id)) {
    throw new Error('A component cannot depend on itself');
  }
  if (!['critical', 'optional'].includes(criticality)) {
    throw new Error("Invalid criticality value; must be 'critical' or 'optional'");
  }
  const existing = await db.get(
    'SELECT id FROM component_dependencies WHERE component_id = ? AND depends_on_id = ?',
    [component_id, depends_on_id]
  );
  if (existing) {
    throw new Error('Dependency already exists');
  }
  const result = await db.run(
    'INSERT INTO component_dependencies (component_id, depends_on_id, criticality) VALUES (?, ?, ?)',
    [component_id, depends_on_id, criticality]
  );
  return { id: result.lastID, message: 'Dependency added successfully' };
};

export const getDependencies = async (db, component_id) => {
  return await db.all(
    `SELECT c.*, cd.criticality, cd.id as dependency_id
     FROM components c
     JOIN component_dependencies cd ON cd.depends_on_id = c.id
     WHERE cd.component_id = ?`,
    [component_id]
  );
};

export const getDependents = async (db, component_id) => {
  return await db.all(
    `SELECT c.*, cd.criticality, cd.id as dependency_id
     FROM components c
     JOIN component_dependencies cd ON cd.component_id = c.id
     WHERE cd.depends_on_id = ?`,
    [component_id]
  );
};

// MAX_IMPACT_DEPTH caps recursion to prevent runaway traversal on large/cyclic graphs.
const MAX_IMPACT_DEPTH = 20;

export const getImpactTree = async (db, id) => {
  return await db.all(
    `WITH RECURSIVE impact_path(id, depth) AS (
      SELECT cd.component_id, 1
      FROM component_dependencies cd
      WHERE cd.depends_on_id = ?
      UNION
      SELECT cd.component_id, ip.depth + 1
      FROM component_dependencies cd
      JOIN impact_path ip ON cd.depends_on_id = ip.id
      WHERE ip.depth < ?
    )
    SELECT c.*, MIN(ip.depth) as depth
    FROM impact_path ip
    JOIN components c ON c.id = ip.id
    GROUP BY c.id
    ORDER BY depth ASC, c.name ASC`,
    [id, MAX_IMPACT_DEPTH]
  );
};

export const deleteDependency = async (db, component_id, depends_on_id) => {
  const result = await db.run(
    'DELETE FROM component_dependencies WHERE component_id = ? AND depends_on_id = ?',
    [component_id, depends_on_id]
  );
  if (result.changes === 0) {
    throw new Error('Dependency not found');
  }
  return { message: 'Dependency deleted successfully' };
};

