from rest_framework import viewsets, permissions, filters, status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
import secrets
from datetime import timedelta
from .models import User, Program, ProgramTopic, Batch, BatchTrainer, BatchTrainee, Designation, DesignationProgram, TraineeDesignation, ProgressRecord, AuditLog, PasswordResetToken, Class
from .serializers import *
from .permissions import IsAdmin, IsTrainerOrAdmin

class StandardListMixin:
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    search_fields = ()
    ordering_fields = '__all__'
    filterset_fields = ()

class UserViewSet(viewsets.ModelViewSet, StandardListMixin):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    search_fields = ('username','email','first_name','last_name')
    ordering_fields = ('id','username','email')
    filterset_fields = ('role', 'is_active_flag')

class ProgramViewSet(viewsets.ModelViewSet, StandardListMixin):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [IsAdmin]
    search_fields = ('name','description')
    filterset_fields = ('is_active',)
    ordering_fields = ('name','created_at')

class ProgramTopicViewSet(viewsets.ModelViewSet, StandardListMixin):
    queryset = ProgramTopic.objects.all()
    serializer_class = ProgramTopicSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ('program',)

class BatchViewSet(viewsets.ModelViewSet, StandardListMixin):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer
    permission_classes = [IsTrainerOrAdmin]
    search_fields = ('name',)
    filterset_fields = ('program','status')
    ordering_fields = ('start_date','end_date')

class BatchTrainerViewSet(viewsets.ModelViewSet, StandardListMixin):
    queryset = BatchTrainer.objects.all()
    serializer_class = BatchTrainerSerializer
    permission_classes = [IsTrainerOrAdmin]

class BatchTraineeViewSet(viewsets.ModelViewSet, StandardListMixin):
    queryset = BatchTrainee.objects.all()
    serializer_class = BatchTraineeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ('batch','trainee','status')
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return BatchTrainee.objects.all()
        if getattr(user,'role','') == 'trainee':
            return BatchTrainee.objects.filter(trainee=user)
        return BatchTrainee.objects.all()

class DesignationViewSet(viewsets.ModelViewSet, StandardListMixin):
    queryset = Designation.objects.all()
    serializer_class = DesignationSerializer
    permission_classes = [IsAdmin]

class DesignationProgramViewSet(viewsets.ModelViewSet, StandardListMixin):
    queryset = DesignationProgram.objects.all()
    serializer_class = DesignationProgramSerializer
    permission_classes = [IsAdmin]

class TraineeDesignationViewSet(viewsets.ModelViewSet, StandardListMixin):
    queryset = TraineeDesignation.objects.all()
    serializer_class = TraineeDesignationSerializer
    permission_classes = [IsAdmin]

class ProgressRecordViewSet(viewsets.ModelViewSet, StandardListMixin):
    queryset = ProgressRecord.objects.all()
    serializer_class = ProgressRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ('trainee','batch','status')
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return ProgressRecord.objects.all()
        return ProgressRecord.objects.filter(trainee=user)
    def perform_create(self, serializer):
        user = self.request.user
        if getattr(user,'role','') == 'trainee':
            serializer.save(trainee=user, updated_by=user)
        else:
            serializer.save()

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().order_by('-created_at')
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAdminUser]

class ClassViewSet(viewsets.ModelViewSet, StandardListMixin):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsTrainerOrAdmin]
    search_fields = ('name', 'trainer_name', 'description')
    filterset_fields = ('is_active',)
    ordering_fields = ('name', 'created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ClassViewSet(viewsets.ModelViewSet, StandardListMixin):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsTrainerOrAdmin]
    search_fields = ('name', 'trainer_name', 'description')
    filterset_fields = ('is_active',)
    ordering_fields = ('name', 'created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

# Authentication Views
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Log the registration
        AuditLog.objects.create(
            user=user,
            action='USER_REGISTERED',
            table_name='User',
            record_id=user.id,
            new_values={'username': user.username, 'role': user.role}
        )

        return Response({
            "message": "User created successfully",
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_request(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = User.objects.get(email=serializer.validated_data['email'])

    # Generate secure token
    token = secrets.token_urlsafe(32)
    expires_at = timezone.now() + timedelta(hours=1)

    # Create reset token
    PasswordResetToken.objects.create(
        user=user,
        token=token,
        expires_at=expires_at
    )

    # Send email (implementation depends on email backend)
    reset_link = f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')}/reset-password?token={token}"
    try:
        send_mail(
            'Password Reset Request',
            f'Click the following link to reset your password: {reset_link}',
            getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@example.com'),
            [user.email],
            fail_silently=False,
        )
    except Exception as e:
        # Log email failure but don't expose to user
        AuditLog.objects.create(
            user=user,
            action='PASSWORD_RESET_EMAIL_FAILED',
            table_name='PasswordResetToken',
            new_values={'error': str(e)}
        )

    # Log the request
    AuditLog.objects.create(
        user=user,
        action='PASSWORD_RESET_REQUESTED',
        table_name='PasswordResetToken',
        new_values={'email': user.email}
    )

    return Response({"message": "Password reset email sent"})

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_confirm(request):
    serializer = PasswordResetSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    reset_token = serializer.validated_data['reset_token']
    user = reset_token.user

    # Update password
    user.set_password(serializer.validated_data['new_password'])
    user.save()

    # Mark token as used
    reset_token.is_used = True
    reset_token.save()

    # Log the reset
    AuditLog.objects.create(
        user=user,
        action='PASSWORD_RESET_COMPLETED',
        table_name='User',
        record_id=user.id
    )

    return Response({"message": "Password reset successfully"})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_current_user(request):
    """
    Get current authenticated user information
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
    return Response(serializer.data)
