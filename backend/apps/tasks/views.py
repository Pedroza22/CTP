from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import Task, Comment
from .serializers import TaskSerializer, CommentSerializer
from apps.users.permissions import IsAdminRole, IsProjectMember, IsOwnerOrAdmin

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_permissions(self):
        if self.action in ['destroy']:
            return [IsOwnerOrAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.all()
        
        # Filtering
        project_id = self.request.query_params.get('project')
        status_param = self.request.query_params.get('status')
        priority_param = self.request.query_params.get('priority')
        assigned_to_param = self.request.query_params.get('assigned_to')
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        if status_param:
            queryset = queryset.filter(status=status_param)
        if priority_param:
            queryset = queryset.filter(priority=priority_param)
        if assigned_to_param:
            queryset = queryset.filter(assigned_to_id=assigned_to_param)

        if user.role == 'admin':
            return queryset
            
        # Members only see tasks in their projects or assigned to them
        return queryset.filter(project__members=user) | queryset.filter(assigned_to=user).distinct()

    @action(detail=False, methods=['get'], url_path='due-soon')
    def due_soon(self, request):
        now = timezone.now()
        soon = now + timedelta(hours=48)
        tasks = self.get_queryset().filter(due_date__range=[now, soon])
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-tasks')
    def my_tasks(self, request):
        tasks = self.get_queryset().filter(assigned_to=request.user)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get', 'post'], url_path='comments')
    def comments(self, request, pk=None):
        task = self.get_object()
        if request.method == 'GET':
            comments = task.comments.all()
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        
        # POST - Create comment
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, task=task)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def perform_create(self, serializer):
        # This is handled by TaskViewSet's action, but here for completeness
        serializer.save(author=self.request.user)

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Comment.objects.all()
        return Comment.objects.filter(author=self.request.user)
