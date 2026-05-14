from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Task
from apps.audit.models import AuditLog
from apps.notifications.models import Notification

@receiver(post_save, sender=Task)
def track_task_changes(sender, instance, created, **kwargs):
    action = "Created" if created else "Updated"
    AuditLog.objects.create(
        task=instance,
        action=f"{action} task: {instance.title}"
    )
    
    # Notify assigned user
    if instance.assigned_to:
        message = f"You have been assigned to task: {instance.title}"
        if not created:
            message = f"Task assigned to you has been updated: {instance.title}"
        
        # Avoid duplicate notifications for the same state if needed, 
        # but for simplicity we'll create one.
        Notification.objects.create(
            user=instance.assigned_to,
            message=message
        )

@receiver(post_delete, sender=Task)
def track_task_deletion(sender, instance, **kwargs):
    # We can't link to the task anymore if it's deleted (unless we use soft delete)
    # But we can log the action in a general way if we had a general audit log.
    # Since AuditLog is linked to Task via FK, it will be deleted on cascade.
    pass
