from rest_framework import serializers
from .models import Project, ProjectMember
from apps.users.serializers import UserSerializer

class ProjectMemberSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)

    class Meta:
        model = ProjectMember
        fields = ('id', 'user', 'user_detail', 'joined_at')
        read_only_fields = ('joined_at',)

class ProjectSerializer(serializers.ModelSerializer):
    created_by_detail = UserSerializer(source='created_by', read_only=True)
    members_count = serializers.IntegerField(source='members.count', read_only=True)

    class Meta:
        model = Project
        fields = (
            'id', 'name', 'description', 'start_date', 'end_date', 
            'status', 'created_by', 'created_by_detail', 
            'created_at', 'updated_at', 'members_count'
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')
