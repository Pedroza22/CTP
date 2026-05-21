# Precision Flow - Sistema de Gestión de Proyectos

![Logo](frontend/public/logo1_black_text.png)

Precision Flow es una plataforma colaborativa de alto rendimiento diseñada para la gestión eficiente de proyectos y tareas. Enfocada en la productividad y el cumplimiento de estándares de seguridad, permite a los equipos centralizar su flujo de trabajo en una interfaz moderna y rápida.

##  Credenciales de Prueba

Para acceder y probar las funcionalidades de la plataforma, utiliza las siguientes credenciales preconfiguradas:

###  Administrador (Acceso Total)
- **Email:** `admin@example.com`
- **Contraseña:** `admin123`
- **Capacidades:** Gestión de usuarios, visualización de todos los proyectos, acceso a reportes ejecutivos y estadísticas globales.

###  Desarrolladores (Miembros)
- **Emails disponibles:** 
  - `julian@example.com`
  - `catalina@example.com`
  - `esteban@example.com`
- **Contraseña:** `password123`
- **Capacidades:** Gestión de tareas asignadas, actualización de estados en el tablero Kanban y visualización de proyectos en los que participa.

---

##  Stack Tecnológico

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Estilos:** Tailwind CSS v4
- **Estado:** Zustand & TanStack Query
- **Drag & Drop:** @dnd-kit
- **Animaciones:** Framer Motion

### Backend
- **Framework:** Django 5 & Django REST Framework
- **Autenticación:** Simple JWT (Access & Refresh Tokens)
- **Base de Datos:** PostgreSQL (Supabase) con modo transacción.
- **Reportes:** ReportLab (PDF) & OpenPyXL (Excel)

---

##  Cumplimiento y Seguridad
- **Protección de Datos:** Implementación conforme a la **Ley 1581 de 2012 (Habeas Data)**.
- **Seguridad:** Arquitectura alineada con estándares **ISO/IEC 27001**.
- **Sesiones:** Persistencia segura mediante Cookies y validación de hidratación de estado.

---

##  Instalación y Desarrollo

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python manage.py migrate`
4. `python manage.py seed_db` (Para cargar las credenciales de prueba arriba mencionadas)
5. `python manage.py runserver`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---

##  Gráfico de Arquitectura

![Arquitectura](image.png)
