import express from 'express';
import {
  getAllComponents,
  getComponent,
  createComponent,
  getComponentChildren,
  updateComponent,
  deleteComponent,
  addDependency,
  getDependencies,
  getDependents,
  getImpactTree,
  deleteDependency,
} from '../models/components.js';

const parseId = (raw) => {
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

const parseParentFilter = (raw) => {
  if (raw === undefined) return undefined;
  if (raw === 'null') return null;
  return parseId(raw);
};

const isSqliteConstraintError = (error) =>
  typeof error?.message === 'string' &&
  (error.message.includes('SQLITE_CONSTRAINT') || error.message.includes('UNIQUE constraint failed'));

export const componentRouter = (db) => {
  const router = express.Router();

  // GET /api/components?name=&type=&parent_id=&criticality=
  router.get('/', async (req, res) => {
    try {
      const filters = {};
      if (req.query.name) filters.name = req.query.name;
      if (req.query.type) filters.type = req.query.type;
      if (req.query.criticality) filters.criticality = req.query.criticality;
      if (req.query.parent_id !== undefined) {
        const parentFilter = parseParentFilter(req.query.parent_id);
        if (parentFilter === null && req.query.parent_id !== 'null') {
          return res.status(400).json({ error: 'parent_id filter must be a positive integer or null' });
        }
        filters.parent_id = parentFilter;
      }
      const components = await getAllComponents(db, filters);
      res.json(components);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/components/:id
  router.get('/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    try {
      const component = await getComponent(db, id);
      res.json(component);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  // GET /api/components/:id/children
  router.get('/:id/children', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    try {
      const children = await getComponentChildren(db, id);
      res.json(children);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/components/:id/dependencies
  router.get('/:id/dependencies', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    try {
      const deps = await getDependencies(db, id);
      res.json(deps);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/components/:id/dependents
  router.get('/:id/dependents', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    try {
      const dependents = await getDependents(db, id);
      res.json(dependents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/components/:id/impact-tree
  router.get('/:id/impact-tree', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    try {
      const tree = await getImpactTree(db, id);
      res.json(tree);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/components
  router.post('/', async (req, res) => {
    try {
      const result = await createComponent(db, req.body);
      res.status(201).json(result);
    } catch (error) {
      const status = isSqliteConstraintError(error) ? 400 : 500;
      res.status(status).json({ error: error.message });
    }
  });

  // PUT /api/components/:id
  router.put('/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    try {
      const result = await updateComponent(db, id, req.body);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Component not found') {
        return res.status(404).json({ error: error.message });
      }
      const status = isSqliteConstraintError(error) ? 400 : 500;
      res.status(status).json({ error: error.message });
    }
  });

  // DELETE /api/components/:id
  router.delete('/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    try {
      const result = await deleteComponent(db, id);
      res.status(200).json(result);
    } catch (error) {
      const status = error.message.startsWith('Cannot delete') ? 409 : 404;
      res.status(status).json({ error: error.message });
    }
  });

  // POST /api/components/:id/dependencies
  router.post('/:id/dependencies', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    try {
      const { depends_on_id, criticality } = req.body;
      const dependsOnId = parseId(depends_on_id);
      if (!dependsOnId) {
        return res.status(400).json({ error: 'depends_on_id is required' });
      }
      const result = await addDependency(db, id, dependsOnId, criticality);
      res.status(201).json(result);
    } catch (error) {
      const status = error.message.includes('already exists') ? 409 : 400;
      res.status(status).json({ error: error.message });
    }
  });

  // DELETE /api/components/:id/dependencies/:depends_on_id
  router.delete('/:id/dependencies/:depends_on_id', async (req, res) => {
    const id = parseId(req.params.id);
    const dependsOnId = parseId(req.params.depends_on_id);
    if (!id || !dependsOnId) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    try {
      const result = await deleteDependency(db, id, dependsOnId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  return router;
};

