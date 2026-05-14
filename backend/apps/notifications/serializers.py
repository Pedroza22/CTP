from rest_framework import serializers
from .models import Notification
from apps.tasks.serializers import TaskSerializer

class NotificationSerializer(serializers.ModelSerializer):
    related_task_detail = TaskSerializer(source='related_task', read_only=True)

    class Meta:
        model = Notification
        fields = ('id', 'recipient', 'message', 'notif_type', 'related_task', 'related_task_detail', 'is_read', 'created_at')
        read_only_fields = ('id', 'created_at')
