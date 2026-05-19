import uuid
from django.db import models
from django.conf import settings
from apps.tasks.models import Task

class Notification(models.Model):
    TYPE_CHOICES = [
        ('task_due', 'Task Due'),
        ('task_assigned', 'Task Assigned'),
        ('comment', 'New Comment'),
        ('project_update', 'Project Update'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='notifications'
    )
    message = models.CharField(max_length=500)
    notif_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    related_task = models.ForeignKey(
        Task, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Notification for {self.recipient.email}: {self.message[:20]}...'
