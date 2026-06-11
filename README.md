## 🎓ProyClassroom
Aplicación web fullstack para gestión de aula virtual con React en el frontend y Express en el backend.

## 🚀 Demo

 *Próximamente* 🟡 En desarrollo activo
---

### Estructura
- src: componentes e interfaces de usuario, incluyendo autenticación, perfil, publicaciones, comentarios y panel de administración.
- routes: rutas del servidor para manejar sesión, usuarios, posts, comentarios y archivos.
- public: datos de usuario y archivos subidos.
- server.js: servidor Express principal.
- vite.config.js: configuración de Vite para desarrollo rápido.

### Funcionalidades
- 🔐 Autenticación y autorización de usuarios
- 📝 Gestión de perfiles y edición de datos.
- Creación y visualización de publicaciones.
- Comentarios en posts y sección de administración de contenido.
- Subida de archivos y manejo de datos de usuario.
- 👥 Soporte para roles administrativos/maestros.

### 🛠️ Tecnologías utilizadas
- `react`, `react-dom`, `react-router-dom`
- `@tanstack/react-query`, `@tanstack/react-query-devtools`
- `express`, `cors`, `mssql`, `multer`, `bcrypt`

### Base de datos
- **SQL Server** — Almacenamiento y gestión de datos relacionales


## 📁 Estructura del proyecto

```
proyClassroom/
├── routes/         # Rutas Node.js (backend)
│   ├── comments_routes.js
|   ├── db_connection.js
│   ├── post_routes.js
|   ├── profile_routes.js
|   ├── session_routes.js
|   └── teacher_routes.js
|   
├── src/            # Aplicación React (frontend)
│   ├── assets/
│   ├── compontens/
|   ├── genUser-actions/
|   ├── genUser-sections/
|   ├── main-sections/
|   ├── teacher-sections/
|   ├── App.jsx
|   ├── index.css
│   └── main.jsx
|
├── .env.development
├── .env.production
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── server.js       # API Node.js (backend)
└── vite.config.js

```
---

### Valor agregado
Aplicación moderna que integra frontend reactivo con backend REST, manejo de datos en SQL y experiencia de usuario para gestión educativa en línea.

## 👤 Autor

**Angel HC**  
[GitHub](https://github.com/AngelHC001)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.


