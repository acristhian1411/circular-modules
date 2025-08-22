
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

   Crear un archivo `.env` en la raíz con al menos:

   ```env
   VITE_API_BASE=http://localhost:3000/api
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
⏳ Agregar dependencia vía interfaz
⏳ Autenticación y roles (pendiente)

---

Contribuciones, ideas o bugs son bienvenidos. ¡Gracias por usar Circular Docs!

