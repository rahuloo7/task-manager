from django.db import models
from django.contrib.auth.models import User

import uuid

class Task(models.Model):
    name = models.CharField(max_length=50)
    guid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_on = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, related_name="tasks", on_delete=models.CASCADE, null=True)
