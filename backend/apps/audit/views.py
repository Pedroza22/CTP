from rest_framework import viewsets, permissions
from .models import AuditLog
from .serializers import AuditLogSerializer

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = AuditLog.objects.all().order_by('-timestamp')
        task_id = self.request.query_params.get('task_id', None)
        if task_id is not None:
            queryset = queryset.filter(task_id=task_id)
        
        user = self.request.user
        if user.role == 'ADMIN':
            return queryset
        # Members can only see logs for tasks they are assigned to or tasks in their projects
        return queryset.filter(task__assigned_to=user) | queryset.filter(task__project__created_by=user)
