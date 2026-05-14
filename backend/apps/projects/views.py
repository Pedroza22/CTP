from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from django.db.models import Count
from .models import Project
from .serializers import ProjectSerializer
from .reports import generate_project_pdf, generate_project_excel
from apps.tasks.models import Task

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Project.objects.all()
        return Project.objects.filter(created_by=user)

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        user = self.request.user
        if user.role == 'ADMIN':
            projects = Project.objects.all()
            tasks = Task.objects.all()
        else:
            projects = Project.objects.filter(created_by=user)
            tasks = Task.objects.filter(project__created_by=user) | Task.objects.filter(assigned_to=user)

        stats = {
            "total_projects": projects.count(),
            "total_tasks": tasks.count(),
            "tasks_by_status": list(tasks.values('status').annotate(count=Count('status'))),
            "tasks_by_priority": list(tasks.values('priority').annotate(count=Count('priority'))),
            "active_projects": projects.filter(status='ACTIVE').count(),
            "completed_projects": projects.filter(status='COMPLETED').count(),
        }
        return Response(stats)

    @action(detail=True, methods=['get'])
    def export_pdf(self, request, pk=None):
        project = self.get_object()
        buffer = generate_project_pdf(project)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="project_{project.id}.pdf"'
        return response

    @action(detail=True, methods=['get'])
    def export_excel(self, request, pk=None):
        project = self.get_object()
        buffer = generate_project_excel(project)
        response = HttpResponse(buffer, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename="project_{project.id}.xlsx"'
        return response
