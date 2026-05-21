import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ADMIN = 'admin'
    MEMBER = 'member'
    
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (MEMBER, 'Member'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=MEMBER)
    avatar_url = models.ImageField(upload_to='avatars/', blank=True, null=True)
    
    # Use email as the primary login identifier
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
