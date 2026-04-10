from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TravelChallenge, ChallengeInvite


class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class TravelChallengeSerializer(serializers.ModelSerializer):
    creator = UserSummarySerializer(read_only=True)
    invite_count = serializers.SerializerMethodField()

    class Meta:
        model = TravelChallenge
        fields = ['id', 'guid', 'title', 'location_description', 'creator',
                  'status', 'proof_photo', 'completed_at', 'created_at', 'invite_count']
        read_only_fields = ['id', 'guid', 'creator', 'status', 'proof_photo', 'completed_at', 'created_at']

    def get_invite_count(self, obj):
        return obj.invites.count()


class ChallengeInviteSerializer(serializers.ModelSerializer):
    challenge = TravelChallengeSerializer(read_only=True)
    challenge_id = serializers.PrimaryKeyRelatedField(
        queryset=TravelChallenge.objects.all(), source='challenge', write_only=True
    )
    inviter = UserSummarySerializer(read_only=True)
    invitee = UserSummarySerializer(read_only=True)
    invitee_username = serializers.CharField(write_only=True)

    class Meta:
        model = ChallengeInvite
        fields = ['id', 'challenge', 'challenge_id', 'inviter', 'invitee',
                  'invitee_username', 'status', 'proof_photo', 'completed_at', 'created_at']
        read_only_fields = ['id', 'inviter', 'invitee', 'status', 'proof_photo', 'completed_at', 'created_at']

    def validate_invitee_username(self, value):
        try:
            return User.objects.get(username=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(f"User '{value}' does not exist.")

    def create(self, validated_data):
        invitee = validated_data.pop('invitee_username')
        validated_data['invitee'] = invitee
        return super().create(validated_data)
