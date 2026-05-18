from rest_framework import views, permissions
from rest_framework.response import Response
from django.db.models import Count, Q
from apps.projects.models import Project
from apps.tasks.models import Task

class GlobalStatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'admin':
            projects = Project.objects.all()
            tasks = Task.objects.all()
        else:
            projects = Project.objects.filter(members=user) | Project.objects.filter(created_by=user)
            tasks = Task.objects.filter(project__in=projects) | Task.objects.filter(assigned_to=user)
            projects = projects.distinct()
            tasks = tasks.distinct()

        stats = {
            "total_projects": projects.count(),
            "total_tasks": tasks.count(),
            "active_projects": projects.filter(status='active').count(),
            "completed_tasks": tasks.filter(status='done').count(),
            "pending_tasks": tasks.filter(status='pending').count()
        }
        return Response(stats)

class ProjectProgressView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'admin':
            projects = Project.objects.all()
        else:
            projects = Project.objects.filter(members=user) | Project.objects.filter(created_by=user)
            projects = projects.distinct()

        data = []
        for project in projects:
            total = project.tasks.count()
            done = project.tasks.filter(status='done').count()
            progress = (done / total * 100) if total > 0 else 0
            data.append({
                "id": project.id,
                "name": project.name,
                "progress": progress
            })
        return Response(data)

class TasksByStatusView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'admin':
            tasks = Task.objects.all()
        else:
            tasks = Task.objects.filter(project__members=user) | Task.objects.filter(assigned_to=user)
            tasks = tasks.distinct()

        status_counts = tasks.values('status').annotate(count=Count('status'))
        return Response(status_counts)
