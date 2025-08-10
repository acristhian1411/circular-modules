# 🧩 Component Manager

Aplicación web para gestionar componentes de software y sus dependencias, ideal para proyectos modulares donde es importante tener un control claro de cómo se relacionan los diferentes elementos del sistema.

## 🚀 Stack Tecnológico

- **Frontend**: React + Material UI
<!-- - **Routing**: React Router DOM -->
- **Backend/API**: Node.js + Express (asumido)
- **Base de datos**: SQLite
- **Estado**: useState / useEffect
- **Estilo**: MUI (Material-UI)
- **Gestión de dependencias**: Fetch API para consumo de endpoints REST

## 📦 Instalación y puesta en marcha

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/component-manager.git
   cd component-manager
   ```
2. **Instalar dependencias**
   ```bash
   npm install
   ```
3. **Configurar variables de entorno**
   - Crear un archivo .env en la raíz con al menos:
     ```bash
     REACT_APP_API_URL=http://localhost:3000
     ```
   - Asegurarse de que la variable REACT_APP_API_URL apunte a la URL correcta de tu backend.
4. **Iniciar la aplicación**
   ```bash
   npm start
   ```
## 📁 Estructura principa
``` bash
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
- ✅ CRUD de componentes
- ✅ Visualización de dependencias
- ⏳ Agregar dependencia vía interfaz
- ⏳ Autenticación y roles (pendiente)