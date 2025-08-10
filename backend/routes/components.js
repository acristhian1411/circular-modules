import express from 'express';
import {
  getAllComponents,
  getComponent,
  createComponent,
  searchComponent,
  getComponentChildren,
  addDependency,
  getDependencies,
  updateComponent,
  deleteComponent,
  deleteDependency,
} from '../models/components.js';

export const componentRouter = (db) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const components = await getAllComponents(db);
      res.json(components);
    } catch (error) {
      res.status(500).json({ error: error.message, message: 'No se encontraron datos' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const component = await getComponent(db, req.params.id);
      res.json(component || {});
    } catch (error) {
      res.status(404).json({ error: error.message, message: 'No se encontraron datos' });
    }
  });

  router.get('/:id/children', async (req, res) => {
    try {
      const children = await getComponentChildren(db, req.params.id);
      res.json(children || []);
    } catch (error) {
      res.status(404).json({ error: error.message, message: 'No se encontraron datos' });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const result = await updateComponent(db, req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message, message: 'No se pudo actualizar el componente' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const result = await createComponent(db, req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message, message: 'No se pudo crear el componente' });
    }
  });

  router.get('/search/:name', async (req, res) => {
    try {
      const components = await searchComponent(db, req.params.name);
      res.json(components || []);
    } catch (error) {
      res.status(404).json({ error: error.message, message: 'No se encontraron datos' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const result = await deleteComponent(db, req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message, message: 'No se pudo eliminar el componente' });
    }
  });

  router.post('/:id/dependencies', async (req, res) => {
    try {
      const { depends_on_id } = req.body;
      const result = await addDependency(db, req.params.id, depends_on_id);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message, message: 'No se pudo agregar la dependencia' });
    }
  });

  router.get('/:id/dependencies', async (req, res) => {
    try {
      const deps = await getDependencies(db, req.params.id);
      res.json(deps);
    } catch (error) {
      res.status(500).json({ error: error.message, message: 'No se encontraron datos' });
    }
  });

  router.delete('/:id/dependencies/:depends_on_id', async (req, res) => {
    try {
      const result = await deleteDependency(db, req.params.depends_on_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message, message: 'No se pudo eliminar la dependencia' });
    }
  });

  return router;
};
