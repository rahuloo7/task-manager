from django.urls import path
from rest_framework import routers
from .api import TravelChallengeViewSet, ChallengeInviteViewSet, CompleteChallengeAPI, InviteFeedAPI, InviteRespondAPI

router = routers.DefaultRouter()
router.register('api/travel/challenges', TravelChallengeViewSet, 'travel-challenges')
router.register('api/travel/invites', ChallengeInviteViewSet, 'travel-invites')

urlpatterns = router.urls + [
    path('api/travel/challenges/<int:pk>/complete/', CompleteChallengeAPI.as_view(), name='complete-challenge'),
    path('api/travel/invites/feed/', InviteFeedAPI.as_view(), name='invite-feed'),
    path('api/travel/invites/<int:pk>/respond/', InviteRespondAPI.as_view(), name='invite-respond'),
]
