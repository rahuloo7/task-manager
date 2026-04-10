from django.db import models
from django.contrib.auth.models import User
import uuid


class TravelChallenge(models.Model):
    STATUS_ACTIVE = 'active'
    STATUS_COMPLETED = 'completed'
    STATUS_CHOICES = [
        (STATUS_ACTIVE, 'Active'),
        (STATUS_COMPLETED, 'Completed'),
    ]

    guid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    title = models.CharField(max_length=100)
    location_description = models.TextField()
    creator = models.ForeignKey(User, related_name='created_challenges', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    proof_photo = models.ImageField(upload_to='challenge_proofs/', null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} by {self.creator.username}"


class ChallengeInvite(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_ACCEPTED = 'accepted'
    STATUS_COMPLETED = 'completed'
    STATUS_DECLINED = 'declined'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_ACCEPTED, 'Accepted'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_DECLINED, 'Declined'),
    ]

    challenge = models.ForeignKey(TravelChallenge, related_name='invites', on_delete=models.CASCADE)
    inviter = models.ForeignKey(User, related_name='sent_invites', on_delete=models.CASCADE)
    invitee = models.ForeignKey(User, related_name='received_invites', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    proof_photo = models.ImageField(upload_to='invite_proofs/', null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('challenge', 'invitee')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.inviter.username} challenged {self.invitee.username} — {self.challenge.title}"
