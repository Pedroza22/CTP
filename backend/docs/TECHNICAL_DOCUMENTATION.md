# Documentación Técnica - Sistema de Control de Proyectos y Tareas

## 1. Arquitectura del Backend
El backend está construido con **Django 5.x** y **Django REST Framework**. Sigue una estructura modular donde cada funcionalidad principal está aislada en su propia aplicación dentro del directorio `apps/`.

### Aplicaciones
- **users**: Gestión de usuarios, roles (admin, member) y autenticación JWT. Usa UUID como PK.
- **projects**: Gestión de proyectos, membresías y generación de reportes.
- **tasks**: Gestión de tareas, comentarios y lógica de asignación.
- **notifications**: Sistema de notificaciones automáticas (asignación, comentarios, etc.).
- **audit-log**: Registro de historial de cambios con diff de campos.
- **dashboard**: Endpoints de estadísticas globales y progreso.

## 2. Modelado de Datos (Core)
Todos los modelos usan **UUID** como clave primaria para mayor seguridad y escalabilidad.

### Principales Modelos
- **User**: Extiende `AbstractUser`. Identificador: `email`. Roles: `admin`, `member`.
- **Project**: Info de proyectos. Relación ManyToMany con `User` vía `ProjectMember`.
- **Task**: Tareas de proyecto. Campos: `status`, `priority` (incluye `critical`), `assigned_to`.
- **Comment**: Comentarios en tareas.
- **Notification**: Avisos para usuarios. Tipos: `task_assigned`, `task_due`, `comment`.
- **AuditLog**: Historial de cambios. Almacena `actor`, `action` y `changes` (JSONField).

## 3. Endpoints de la API
### Autenticación
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/token/refresh/`
- `GET /api/auth/me/` (Perfil y actualización)

### Usuarios (Solo Admin)
- `GET /api/auth/management/` (CRUD completo)
- `PATCH /api/auth/management/{id}/role/` (Cambio de rol)

### Proyectos
- `GET /api/projects/` (Listar según rol)
- `POST /api/projects/` (Solo Admin)
- `GET /api/projects/{id}/members/` (Gestión de miembros)
- `GET /api/projects/{id}/stats/` (Métricas del proyecto)
- `GET /api/projects/{id}/export_pdf/`
- `GET /api/projects/{id}/export_excel/`

### Tareas
- `GET /api/tasks/` (Filtros: project, status, priority, assigned_to)
- `GET /api/tasks/due-soon/` (Próximas 48h)
- `GET /api/tasks/my-tasks/` (Asignadas al usuario)
- `GET /api/tasks/{id}/comments/` (Listar/Crear comentarios)

### Dashboard y Auditoría
- `GET /api/dashboard/stats/` (Métricas globales)
- `GET /api/dashboard/project-progress/` (Avance %)
- `GET /api/audit-log/` (Historial completo - Solo Admin)

## 4. Seguridad y Permisos
Se implementaron clases personalizadas:
- `IsAdminRole`: Solo usuarios con `role='admin'`.
- `IsProjectMember`: Usuarios asignados al proyecto.
- `IsOwnerOrAdmin`: Creador del recurso o administrador.

## 5. Automatización (Signals)
- **Captura de Cambios**: Las tareas guardan un diff automático en `AuditLog` al ser actualizadas.
- **Notificaciones**: Envío automático al asignar un usuario a una tarea.

## 6. Despliegue
- Configurado para **Supabase (PostgreSQL)**.
- Requiere variables de entorno: `DATABASE_URL`, `SECRET_KEY`, `CORS_ALLOWED_ORIGINS`.
