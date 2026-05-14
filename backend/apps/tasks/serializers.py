from rest_framework import serializers
from .models import Task, Comment
from apps.users.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    author_detail = UserSerializer(source='author', read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'task', 'author', 'author_detail', 'content', 'created_at', 'updated_at')
        read_only_fields = ('id', 'author', 'created_at', 'updated_at')

class TaskSerializer(serializers.ModelSerializer):
    assigned_to_detail = UserSerializer(source='assigned_to', read_only=True)
    created_by_detail = UserSerializer(source='created_by', read_only=True)
    comment_count = serializers.IntegerField(source='comments.count', read_only=True)

    class Meta:
        model = Task
        fields = (
            'id', 'project', 'title', 'description', 'due_date', 
            'status', 'priority', 'assigned_to', 'assigned_to_detail',
            'created_by', 'created_by_detail', 'created_at', 'updated_at',
            'comment_count'
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')
