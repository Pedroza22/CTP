# Backend - Precision Flow (Control de Proyectos y Tareas)

Este es el backend del proyecto, desarrollado con **Django 5.x** y **Django REST Framework**.

## Tecnologías
- **Framework:** Django 5.x + DRF
- **Autenticación:** JWT (Simple JWT)
- **Base de Datos:** Supabase (PostgreSQL)
- **Seguridad:** CORS Headers, Variables de entorno (.env)

## Estructura de Carpetas
- `config/`: Configuración principal del proyecto Django.
- `apps/`: Aplicaciones modulares del sistema.
    - `users/`: Gestión de usuarios, roles y autenticación JWT.
    - `projects/`: Lógica de proyectos.
    - `tasks/`: Lógica de tareas.
- `requirements.txt`: Dependencias del proyecto.
- `.env`: Variables sensibles (No subir a Git).

## Configuración Inicial
1. Crear un entorno virtual: `python -m venv venv`
2. Activar entorno: `.\venv\Scripts\Activate.ps1` (Windows) o `source venv/bin/activate` (Linux/Mac)
3. Instalar dependencias: `pip install -r requirements.txt`
4. Configurar el archivo `.env` con las credenciales de Supabase.

## Endpoints de Autenticación
- `POST /api/auth/register/`: Registro de nuevos usuarios.
- `POST /api/auth/login/`: Obtención de tokens Access y Refresh.
- `POST /api/auth/token/refresh/`: Refrescar el token de acceso.
- `GET /api/auth/me/`: Obtener perfil del usuario autenticado.

## Despliegue (Render / Railway)
1. Conectar el repositorio de GitHub a la plataforma elegida.
2. Configurar las variables de entorno (`DATABASE_URL`, `SECRET_KEY`, `DEBUG=False`).
3. Comando de Build: `pip install -r requirements.txt`
4. Comando de Start: `gunicorn config.wsgi` (Asegúrate de instalar gunicorn).
