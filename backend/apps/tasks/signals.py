from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.forms.models import model_to_dict
from .models import Task, Comment
from apps.audit.models import AuditLog
from apps.notifications.models import Notification
from apps.audit.middleware import get_current_user

@receiver(pre_save, sender=Task)
def capture_task_pre_save(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = Task.objects.get(pk=instance.pk)
            instance._old_values = model_to_dict(old_instance)
        except Task.DoesNotExist:
            instance._old_values = {}
    else:
        instance._old_values = {}

@receiver(post_save, sender=Task)
def track_task_changes(sender, instance, created, **kwargs):
    action = "created" if created else "updated"
    
    # Calculate changes
    changes = {}
    if not created and hasattr(instance, '_old_values'):
        new_values = model_to_dict(instance)
        for field, value in new_values.items():
            old_value = instance._old_values.get(field)
            if old_value != value:
                # Handle UUID and other non-JSON serializable objects if necessary
                changes[field] = {
                    'old': str(old_value) if old_value else None,
                    'new': str(value) if value else None
                }

    AuditLog.objects.create(
        actor=get_current_user() if get_current_user() and get_current_user().is_authenticated else None,
        action=action,
        model_name='Task',
        object_id=str(instance.id),
        changes=changes
    )
    
    # Notify assigned user
    if instance.assigned_to and (created or 'assigned_to' in changes):
        Notification.objects.create(
            recipient=instance.assigned_to,
            notif_type='task_assigned',
            related_task=instance,
            message=f"You have been assigned to task: {instance.title}"
        )
