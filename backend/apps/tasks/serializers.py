from rest_framework import serializers
from .models import Task
from apps.users.serializers import UserSerializer

class TaskSerializer(serializers.ModelSerializer):
    assigned_to_detail = UserSerializer(source='assigned_to', read_only=True)

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
