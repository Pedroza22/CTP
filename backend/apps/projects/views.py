from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from django.db.models import Count
from .models import Project, ProjectMember
from .serializers import ProjectSerializer, ProjectMemberSerializer
from .reports import generate_project_pdf, generate_project_excel
from apps.users.permissions import IsAdminRole, IsProjectMember
from apps.tasks.models import Task

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Project.objects.all()
        # Members only see projects where they are members or they created
        return Project.objects.filter(members=user) | Project.objects.filter(created_by=user).distinct()

    @action(detail=True, methods=['get', 'post'])
    def members(self, request, pk=None):
        project = self.get_object()
        if request.method == 'GET':
            members = ProjectMember.objects.filter(project=project)
            serializer = ProjectMemberSerializer(members, many=True)
            return Response(serializer.data)
        
        # POST - Add member (Only Admin or Owner)
        if request.user.role != 'admin' and project.created_by != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FOR_CONTENT)
            
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        member, created = ProjectMember.objects.get_or_create(project=project, user_id=user_id)
        if not created:
            return Response({'error': 'User is already a member'}, status=status.HTTP_400_BAD_REQUEST)
            
        return Response(ProjectMemberSerializer(member).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='members/(?P<uid>[^/.]+)')
    def remove_member(self, request, pk=None, uid=None):
        project = self.get_object()
        if request.user.role != 'admin' and project.created_by != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FOR_CONTENT)
            
        try:
            member = ProjectMember.objects.get(project=project, user_id=uid)
            member.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProjectMember.DoesNotExist:
            return Response({'error': 'Member not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        project = self.get_object()
        tasks = project.tasks.all()
        stats = {
            "total_tasks": tasks.count(),
            "tasks_by_status": list(tasks.values('status').annotate(count=Count('status'))),
            "tasks_by_priority": list(tasks.values('priority').annotate(count=Count('priority'))),
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
