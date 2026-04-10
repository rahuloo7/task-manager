from django.utils import timezone
from django.db.models import Q
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import TravelChallenge, ChallengeInvite
from .serializers import TravelChallengeSerializer, ChallengeInviteSerializer


class TravelChallengeViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TravelChallengeSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return TravelChallenge.objects.filter(creator=self.request.user)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class CompleteChallengeAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, pk):
        try:
            challenge = TravelChallenge.objects.get(pk=pk, creator=request.user)
        except TravelChallenge.DoesNotExist:
            return Response({'error': 'Challenge not found.'}, status=status.HTTP_404_NOT_FOUND)

        if challenge.status == TravelChallenge.STATUS_COMPLETED:
            return Response({'error': 'Challenge already completed.'}, status=status.HTTP_400_BAD_REQUEST)

        proof_photo = request.FILES.get('proof_photo')
        if not proof_photo:
            return Response({'error': 'proof_photo is required.'}, status=status.HTTP_400_BAD_REQUEST)

        challenge.proof_photo = proof_photo
        challenge.status = TravelChallenge.STATUS_COMPLETED
        challenge.completed_at = timezone.now()
        challenge.save()

        serializer = TravelChallengeSerializer(challenge)
        return Response(serializer.data)


class ChallengeInviteViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChallengeInviteSerializer
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        return ChallengeInvite.objects.filter(invitee=self.request.user)

    def perform_create(self, serializer):
        serializer.save(inviter=self.request.user)

    def create(self, request, *args, **kwargs):
        # Validate inviter is not challenging themselves
        invitee_username = request.data.get('invitee_username', '')
        if invitee_username == request.user.username:
            return Response({'error': 'You cannot challenge yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)


class InviteFeedAPI(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChallengeInviteSerializer

    def get_queryset(self):
        user = self.request.user
        return ChallengeInvite.objects.filter(
            Q(inviter=user) | Q(invitee=user)
        ).select_related('challenge', 'inviter', 'invitee')


class InviteRespondAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def patch(self, request, pk):
        try:
            invite = ChallengeInvite.objects.get(pk=pk, invitee=request.user)
        except ChallengeInvite.DoesNotExist:
            return Response({'error': 'Invite not found.'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        valid = [ChallengeInvite.STATUS_ACCEPTED, ChallengeInvite.STATUS_DECLINED, ChallengeInvite.STATUS_COMPLETED]

        if new_status not in valid:
            return Response({'error': f"status must be one of: {', '.join(valid)}"}, status=status.HTTP_400_BAD_REQUEST)

        if new_status == ChallengeInvite.STATUS_COMPLETED:
            proof_photo = request.FILES.get('proof_photo')
            if not proof_photo:
                return Response({'error': 'proof_photo is required to complete the challenge.'}, status=status.HTTP_400_BAD_REQUEST)
            invite.proof_photo = proof_photo
            invite.completed_at = timezone.now()

        invite.status = new_status
        invite.save()

        serializer = ChallengeInviteSerializer(invite)
        return Response(serializer.data)
