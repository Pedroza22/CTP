from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.projects.models import Project, ProjectMember
from apps.tasks.models import Task
from django.utils import timezone
from datetime import timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with initial data for development'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # 1. Create Users
        admin, _ = User.objects.get_or_create(
            email='admin@example.com',
            defaults={
                'username': 'admin',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True
            }
        )
        admin.set_password('admin123')
        admin.save()

        member1, _ = User.objects.get_or_create(
            email='julian@example.com',
            defaults={'username': 'julian', 'role': 'member'}
        )
        member1.set_password('password123')
        member1.save()

        member2, _ = User.objects.get_or_create(
            email='catalina@example.com',
            defaults={'username': 'catalina', 'role': 'member'}
        )
        member2.set_password('password123')
        member2.save()

        member3, _ = User.objects.get_or_create(
            email='esteban@example.com',
            defaults={'username': 'esteban', 'role': 'member'}
        )
        member3.set_password('password123')
        member3.save()

        self.stdout.write(self.style.SUCCESS('Users created successfully'))

        # 2. Create Projects
        project1, _ = Project.objects.get_or_create(
            name='Sistema de Control de Proyectos',
            defaults={
                'description': 'Aplicación web para gestión colaborativa de proyectos y seguimiento de tareas.',
                'start_date': timezone.now().date(),
                'end_date': (timezone.now() + timedelta(days=30)).date(),
                'status': 'active',
                'created_by': admin
            }
        )

        project2, _ = Project.objects.get_or_create(
            name='Rediseño UI/UX Portal',
            defaults={
                'description': 'Modernización de la interfaz de usuario del portal corporativo.',
                'start_date': timezone.now().date(),
                'status': 'active',
                'created_by': admin
            }
        )

        # 3. Add Members to Projects
        ProjectMember.objects.get_or_create(project=project1, user=member1)
        ProjectMember.objects.get_or_create(project=project1, user=member2)
        ProjectMember.objects.get_or_create(project=project1, user=member3)
        
        ProjectMember.objects.get_or_create(project=project2, user=member2)

        self.stdout.write(self.style.SUCCESS('Projects and Memberships created'))

        # 4. Create Tasks
        tasks_data = [
            {'title': 'Configurar Backend Django', 'project': project1, 'assigned_to': member1, 'priority': 'high'},
            {'title': 'Diseñar Mockups Frontend', 'project': project1, 'assigned_to': member2, 'priority': 'medium'},
            {'title': 'Configurar Supabase', 'project': project1, 'assigned_to': member3, 'priority': 'high'},
            {'title': 'Implementar Auth JWT', 'project': project1, 'assigned_to': member1, 'priority': 'critical'},
            {'title': 'Crear componentes UI base', 'project': project2, 'assigned_to': member2, 'priority': 'low'},
        ]

        for task_info in tasks_data:
            Task.objects.get_or_create(
                title=task_info['title'],
                project=task_info['project'],
                defaults={
                    'description': f'Descripción para {task_info["title"]}',
                    'status': 'pending',
                    'priority': task_info['priority'],
                    'assigned_to': task_info['assigned_to'],
                    'created_by': admin,
                    'due_date': timezone.now() + timedelta(days=random.randint(1, 10))
                }
            )

        self.stdout.write(self.style.SUCCESS('Tasks created successfully'))
        self.stdout.write(self.style.SUCCESS('Database seeding completed!'))
