## 🎓ProyClassroom
Aplicación web FullStack inspirada en la dinámica de un chat grupal de canales de Microsoft Teams, ambientada con la temática de la franquicia Umamusume Pretty Derby para simular las interacciones de los usuarios.

**¿Quieres Probar la app rapidamente?**
- Credenciales modo usuario:
-   Matricula: GP-DEMO
-   Contraseña: gUes17Teio-Oo-o

- Credenciales modo ADMIN:
-   Matricula: ADMIN
-   Contraseña: Um4yvru_ma1n

## 🚀 Demo y Arquitectura
https://proyclassroom.onrender.com/
---
- Frontend y Backend: Desplegados en Render (Free Tier).
- Base de Datos: PostgreSQL alojada en Aiven.
- Almacenamiento de Medios: Cloudinary v2 (para la gestión exclusiva de imágenes en publicaciones y comentarios).

Nota técnica: El repositorio cuenta con una rama main configurada originalmente para SQL Server. Sin embargo, debido a limitaciones de costos y barreras de infraestructura en el free tier, se implementó y adaptó la rama postgre-mode para garantizar una alta disponibilidad de despliegue en la nube.

---
### 🛠️ Tecnologías utilizadas
Frontend
ReactJS & React Router DOM (Enrutamiento y vistas de usuario)

@tanstack/react-query & Devtools (Gestión de estado servidor y caché)

Backend & Base de Datos
Node.js con Express (API RESTful)

PostgreSQL & pg (Base de datos relacional)

Bcrypt & JWT (Autenticación y seguridad de contraseñas)

Multer & Cloudinary (Gestión de subida de archivos multimedia)

---
### Funcionalidades Principales
🔐 Sistema de Autenticación: Registro, login seguro y autorización mediante tokens (JWT).

📝 Gestión de Perfiles: Edición de datos de usuario e imagen de perfil.

💬 Interactividad Social: Creación de publicaciones, sección de comentarios y administración de contenido.

🖼️ Multimedia Integrada: Subida de imágenes optimizada y limitada exclusivamente a posts y comentarios mediante Cloudinary.

👥 Roles de Usuario: Soporte para roles administrativos o de "maestros" dentro de la plataforma.

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
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── server.js       # API Node.js (backend)
└── vite.config.js

```

## 👤 Autor

**Angel HC**  
[GitHub](https://github.com/AngelHC001)

---
## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.


