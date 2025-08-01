import express from 'express';
import cors from 'cors';
import { initDB } from './database.js';
import { componentRouter } from './routes/components.js';

const startServer = async () => {
  const app = express();
  const db = await initDB();

  app.use(cors());
  app.use(express.json());

  app.use('/api/components', componentRouter(db));

  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
  });
};

startServer();
