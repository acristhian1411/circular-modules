# 🧩 Circular Docs

Aplicación web para gestionar componentes de software y sus dependencias, ideal para proyectos modulares donde es importante tener un control claro de cómo se relacionan los diferentes elementos del sistema.

## 🚀 Stack Tecnológico

- **Frontend**: React + Material UI
- **Routing**: React Router DOM
- **Backend/API**: Node.js + Express (asumido)
- **Base de datos**: SQLite o PostgreSQL (según configuración del backend)
- **Estado**: useState / useEffect
- **Estilo**: MUI (Material-UI)
- **Gestión de dependencias**: Fetch API para consumo de endpoints REST

## 📦 Instalación y puesta en marcha

1. **Clonar el repositorio**

   ```bash
      git clone https://github.com/tu-usuario/circular-modules.git
      cd circular-modules
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Backend (`/.env`):

   ```env
   PORT=3001
   AUTH_BASE_URL=http://localhost
   AUTH_CLIENT_ID=...
   AUTH_CLIENT_SECRET=...
   AUTH_USERINFO_URL=http://localhost/api/user
   ```

   Frontend (`/frontend/.env`):

   ```env
   VITE_API_BASE=http://localhost:3001/api
   ```

4. **Ejecutar en desarrollo**

   ```bash
   npm run dev
   ```

5. **Build para producción**

   ```bash
   npm run build
   ```

6. **(Opcional) Servir el build**

   ```bash
   npm run preview
   ```

## 📁 Estructura principal

```
src/
├── api/
│   └── component.js          # Funciones de consumo de API
├── components/
│   └── ComponentList.jsx     # Lista de componentes
│   └── ComponentDetail.jsx   # Detalle + dependencias
├── App.jsx                   # Root del enrutamiento
├── main.jsx                  # Entrada de la app
```

## 🧪 Estado del proyecto

✅ CRUD de componentes
✅ Visualización de dependencias
✅ Agregar dependencia vía interfaz
✅ Autenticación con Laravel Passport (login + rutas protegidas)

## 🔐 Flujo de autenticación

- Frontend inicia sesión contra `POST /api/auth/login`.
- Backend solicita token OAuth2 al servicio Laravel (`/oauth/token`) con Password Grant.
- Frontend almacena `access_token` y lo envía como Bearer Token.
- Backend protege `/api/components/*` validando token contra `AUTH_USERINFO_URL`.

---

Contribuciones, ideas o bugs son bienvenidos. ¡Gracias por usar Circular Docs!
