# Circular Docs

Aplicacion web para gestionar componentes de software y sus dependencias, con backend Express, frontend React + Vite y base SQLite local.

## Stack

- Frontend: React + Vite + Material UI
- Backend: Node.js + Express
- Base de datos: SQLite
- Auth: Laravel Passport via OAuth2 password grant

## Variables de entorno

Backend en `.env`:

```env
PORT=3001
AUTH_BASE_URL=http://localhost
AUTH_CLIENT_ID=
AUTH_CLIENT_SECRET=
AUTH_SCOPE=
AUTH_USERINFO_URL=http://localhost/api/user
AUTH_USERINFO_CACHE_TTL_MS=30000
```

Frontend en `frontend/.env`:

```env
VITE_API_BASE=http://localhost:3001/api
```

## Desarrollo local sin Docker

Instalar dependencias del backend:

```bash
npm install
```

Instalar dependencias del frontend:

```bash
cd frontend
npm install
```

Levantar backend y frontend en terminales separadas:

```bash
npm run dev:backend
```

```bash
cd frontend
npm run dev
```

## Docker

El repositorio incluye dos servicios separados:

- `backend`: Express en Node 22, expuesto en `http://localhost:3001`
- `frontend`: React + Vite en Node 22, expuesto en `http://localhost:5173`

La base SQLite persiste en un volumen Docker montado sobre `/app/backend/db`.

### Produccion simple

Construir y levantar:

```bash
docker compose up --build
```

Detener:

```bash
docker compose down
```

El frontend queda compilado con la API apuntando al servicio `backend` dentro de la red de Compose.

### Desarrollo con hot reload

Construir y levantar:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Detener:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

En este modo:

- El backend corre con `node --watch`
- El frontend corre con el servidor de Vite
- El codigo fuente se monta como bind volume

### Notas

- `docker-compose.yml` define el modo base de produccion simple.
- `docker-compose.dev.yml` sobreescribe el modo base para desarrollo.
- El archivo `.env` del root se usa para el backend dentro de Compose.
- `frontend/.env` no es necesario dentro de Compose porque `VITE_API_BASE` se define desde Docker.

## Auth

- El frontend hace login contra `POST /api/auth/login`.
- El backend solicita el token al servicio Laravel configurado por variables de entorno.
- Las rutas `/api/components/*` requieren Bearer token valido.
