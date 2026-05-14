from rest_framework import serializers
from .models import AuditLog
from apps.users.serializers import UserSerializer

class AuditLogSerializer(serializers.ModelSerializer):
    actor_detail = UserSerializer(source='actor', read_only=True)

    class Meta:
        model = AuditLog
        fields = ('id', 'actor', 'actor_detail', 'action', 'model_name', 'object_id', 'changes', 'timestamp', 'ip_address')
        read_only_fields = ('id', 'timestamp')
