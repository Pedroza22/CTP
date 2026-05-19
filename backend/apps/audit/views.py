from rest_framework import viewsets
from .models import AuditLog
from .serializers import AuditLogSerializer
from apps.users.permissions import IsAdminRole

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminRole]
