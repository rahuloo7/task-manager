from django.contrib import admin
from .models import TravelChallenge, ChallengeInvite

@admin.register(TravelChallenge)
class TravelChallengeAdmin(admin.ModelAdmin):
    list_display = ['title', 'creator', 'status', 'created_at']
    list_filter = ['status']

@admin.register(ChallengeInvite)
class ChallengeInviteAdmin(admin.ModelAdmin):
    list_display = ['challenge', 'inviter', 'invitee', 'status', 'created_at']
    list_filter = ['status']
