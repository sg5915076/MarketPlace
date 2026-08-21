from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'role', 'phone',
            'preferred_city', 'preferred_locality', 'avatar_url',
            'is_email_verified', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'full_name', 'role',
            'phone', 'preferred_city', 'preferred_locality'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        role = validated_data.get('role', User.RoleChoices.CUSTOMER)
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user
