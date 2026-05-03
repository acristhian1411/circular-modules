import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { initDB } from './database.js';
import { componentRouter } from './routes/components.js';
import { authRouter } from './routes/auth.js';
import { requireAuth } from './middleware/requireAuth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from project root regardless of the terminal's current directory.
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const startServer = async () => {
  const app = express();
  const db = await initDB();

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRouter());
  app.use('/api/components', requireAuth(), componentRouter(db));

  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
  });
};

startServer();
