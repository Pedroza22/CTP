import logging
from rest_framework import views, permissions
from rest_framework.response import Response
from django.db.models import Count, Q
from apps.projects.models import Project
from apps.tasks.models import Task

logger = logging.getLogger(__name__)

class GlobalStatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            if user.role == 'admin':
                projects = Project.objects.all()
                tasks = Task.objects.all()
            else:
                projects = Project.objects.filter(Q(members=user) | Q(created_by=user)).distinct()
                tasks = Task.objects.filter(Q(project__in=projects) | Q(assigned_to=user)).distinct()

            stats = {
                "total_projects": projects.count(),
                "total_tasks": tasks.count(),
                "active_projects": projects.filter(status='active').count(),
                "completed_tasks": tasks.filter(status='done').count(),
                "pending_tasks": tasks.filter(status='pending').count()
            }
            return Response(stats)
        except Exception as e:
            logger.error(f"Error in GlobalStatsView: {str(e)}", exc_info=True)
            return Response({"error": str(e)}, status=500)

class ProjectProgressView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            if user.role == 'admin':
                projects = Project.objects.all()
            else:
                projects = Project.objects.filter(Q(members=user) | Q(created_by=user)).distinct()

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
        except Exception as e:
            logger.error(f"Error in ProjectProgressView: {str(e)}", exc_info=True)
            return Response({"error": str(e)}, status=500)

class TasksByStatusView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            if user.role == 'admin':
                tasks = Task.objects.all()
            else:
                tasks = Task.objects.filter(Q(project__members=user) | Q(assigned_to=user)).distinct()

            status_counts = list(tasks.values('status').annotate(count=Count('status')))
            return Response(status_counts)
        except Exception as e:
            logger.error(f"Error in TasksByStatusView: {str(e)}", exc_info=True)
            return Response({"error": str(e)}, status=500)
