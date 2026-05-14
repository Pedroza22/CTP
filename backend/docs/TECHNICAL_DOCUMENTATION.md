# Documentación Técnica - Sistema de Control de Proyectos y Tareas

## 1. Arquitectura del Backend
El backend está construido con **Django 5.x** y **Django REST Framework**. Sigue una estructura modular donde cada funcionalidad principal está aislada en su propia aplicación dentro del directorio `apps/`.

### Aplicaciones
- **users**: Gestión de usuarios, roles (ADMIN, MEMBER) y autenticación JWT.
- **projects**: Gestión de proyectos y generación de reportes.
- **tasks**: Gestión de tareas, comentarios y lógica de asignación.
- **notifications**: Sistema de notificaciones automáticas.
- **audit**: Registro de historial de cambios (Audit Log).

## 2. Modelado de Datos
### Principales Modelos
- **User**: Extiende `AbstractUser`. Identificador principal: `email`. Roles: `ADMIN`, `MEMBER`.
- **Project**: Almacena información de proyectos. Relacionado con `User` (creador).
- **Task**: Tareas dentro de un proyecto. Relacionado con `Project` y `User` (asignado).
- **Comment**: Comentarios en tareas. Relacionado con `Task` y `User`.
- **Notification**: Notificaciones para usuarios.
- **AuditLog**: Registro de acciones sobre tareas.

## 3. Endpoints de la API
### Autenticación
- `POST /api/auth/login/`: Obtener tokens JWT.
- `POST /api/auth/register/`: Registro de nuevos usuarios.
- `GET /api/auth/me/`: Perfil del usuario autenticado.

### Proyectos
- `GET /api/projects/`: Listar proyectos.
- `POST /api/projects/`: Crear proyecto (Solo Admin).
- `GET /api/projects/{id}/dashboard_stats/`: Estadísticas para gráficos.
- `GET /api/projects/{id}/export_pdf/`: Exportar reporte en PDF.
- `GET /api/projects/{id}/export_excel/`: Exportar reporte en Excel.

### Tareas y Comentarios
- `GET /api/tasks/`: Listar tareas (filtrable por `project_id`).
- `POST /api/tasks/`: Crear tarea.
- `GET /api/tasks/comments/`: Listar comentarios (filtrable por `task_id`).
- `POST /api/tasks/comments/`: Agregar comentario.

### Notificaciones e Historial
- `GET /api/notifications/`: Listar notificaciones del usuario.
- `GET /api/audit/`: Listar historial de cambios (Solo Admin o involucrados).

## 4. Lógica de Negocio y Automatización
- **Señales (Signals)**: Se utilizan señales de Django para automatizar:
  - Creación de logs de auditoría al crear o actualizar tareas.
  - Envío de notificaciones cuando se asigna una tarea a un usuario.
- **Permisos**: 
  - Los Admins tienen acceso total.
  - Los Miembros solo ven proyectos que crearon o tareas asignadas.

## 5. Reportes
- **PDF**: Generado con `reportlab`.
- **Excel**: Generado con `openpyxl`.
Ambos se sirven como descargas directas desde la API.

## 6. Despliegue
- El backend está preparado para ser desplegado en **Render** o **Railway**.
- Base de datos: **Supabase (PostgreSQL)**.
- Variables de entorno necesarias: `DATABASE_URL`, `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`.
