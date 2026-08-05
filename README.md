## 🎓ProyClassroom
Aplicación Web FullStack inspirado en un chat grupal de un canal de Teams, 
utilicé la tematica de la franquicia **Umamusume Pretty Derby** para simular las conversaciones.

En este canal virtual solitario puedes subir publicaciones, comentar y ajustar tu perfil de usuario de forma básica;
la subida de archivos esta limitada exclusivamente a imagenes (post y comentarios).


## 🚀 Demo
 https://proyclassroom.onrender.com/
---

### Estructura Interna
- Frontend: ReactJS
- Backend: Express
- Base de Datos Relacional: PostgreSQL (Service en Aiven)
      -- INFO: branch main usa SQLServer pero las barreras de pago y las limitaciones estrictas
          no fueron convenientes para el host en su lugar creé el branch postgre mode
- Cloudinary v2: API dedicada para el uso de Cloudinary, nube para guardar imagenes.

### Funcionalidades
- 🔐 Autenticación y autorización de usuarios.
- 📝 Gestión de perfiles y edición de datos.
- Creación y visualización de publicaciones.
- Comentarios en posts y sección de administración de contenido.
- Subida de archivos y manejo de datos de usuario.
- 👥 Soporte para roles administrativos/maestros.


### 🛠️ Tecnologías utilizadas
- `react`, `react-dom`, `react-router-dom`
- `@tanstack/react-query`, `@tanstack/react-query-devtools`
- `express`, `cors`, `mssql`, `multer`, `bcrypt`
- `pg`, `jwt`

---
### Resumen del Deploy
- Frontend/Backend: Render (Free Tier)
- Base de Datos Postgre: Aiven
- Guardado de Imagenes: Cloudinary

## 👤 Autor

**Angel HC**  
[GitHub](https://github.com/AngelHC001)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.


