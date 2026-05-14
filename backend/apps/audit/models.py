from django.db import models
from django.conf import settings
from apps.tasks.models import Task

class AuditLog(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='audit_logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.action} on task {self.task.id} by {self.user}'
