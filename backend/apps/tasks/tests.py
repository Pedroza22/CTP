from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.projects.models import Project
from apps.tasks.models import Task, Comment
from apps.notifications.models import Notification
from apps.audit.models import AuditLog
import datetime

User = get_user_model()

class BusinessLogicTest(TestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            email='admin@test.com',
            username='admin',
            password='password123',
            role='ADMIN'
        )
        self.member_user = User.objects.create_user(
            email='member@test.com',
            username='member',
            password='password123',
            role='MEMBER'
        )
        self.project = Project.objects.create(
            name="Test Project",
            description="Test Description",
            start_date=datetime.date.today(),
            end_date=datetime.date.today() + datetime.timedelta(days=30),
            created_by=self.admin_user
        )

    def test_task_signals(self):
        """Test that creating a task triggers audit log and notification"""
        # 1. Create task
        task = Task.objects.create(
            project=self.project,
            title="Test Task",
            description="Task Description",
            due_date=datetime.date.today() + datetime.timedelta(days=7),
            assigned_to=self.member_user,
            priority='HIGH'
        )

        # Check Audit Log
        audit_exists = AuditLog.objects.filter(task=task, action__icontains="Created").exists()
        self.assertTrue(audit_exists, "Audit Log should be created for new task")

        # Check Notification
        notification_exists = Notification.objects.filter(user=self.member_user, message__icontains=task.title).exists()
        self.assertTrue(notification_exists, "Notification should be created for assigned user")

        # 2. Update task
        task.status = 'IN_PROGRESS'
        task.save()

        # Check Updated Audit Log
        update_audit_exists = AuditLog.objects.filter(task=task, action__icontains="Updated").exists()
        self.assertTrue(update_audit_exists, "Audit Log should be created for task update")

    def test_comments(self):
        """Test comment creation"""
        task = Task.objects.create(
            project=self.project,
            title="Comment Task",
            description="...",
            due_date=datetime.date.today()
        )
        comment = Comment.objects.create(
            task=task,
            user=self.member_user,
            content="This is a test comment"
        )
        self.assertEqual(task.comments.count(), 1)
        self.assertEqual(task.comments.first().content, "This is a test comment")

    def test_dashboard_stats(self):
        """Verify the logic used in dashboard_stats (simulated)"""
        Task.objects.create(
            project=self.project,
            title="Task 1",
            due_date=datetime.date.today(),
            status='PENDING'
        )
        Task.objects.create(
            project=self.project,
            title="Task 2",
            due_date=datetime.date.today(),
            status='DONE'
        )
        
        pending_count = Task.objects.filter(status='PENDING').count()
        done_count = Task.objects.filter(status='DONE').count()
        
        self.assertEqual(pending_count, 1)
        self.assertEqual(done_count, 1)
