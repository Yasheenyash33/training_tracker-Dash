from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils import timezone

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('trainer', 'Trainer'),
        ('trainee', 'Trainee'),
    ]

    phone = models.CharField(max_length=50, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='trainee')
    expertise = models.TextField(blank=True, null=True)
    designation = models.CharField(max_length=255, blank=True, null=True)
    is_active_flag = models.BooleanField(default=True)
    def __str__(self):
        return self.get_full_name() or self.username

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"Reset token for {self.user.username}"

    def is_expired(self):
        return timezone.now() > self.expires_at

    class Meta:
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['expires_at']),
        ]

class Designation(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self): return self.name

class Program(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    duration_days = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='programs_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self): return self.name

class ProgramTopic(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='topics')
    topic_name = models.CharField(max_length=255)
    topic_description = models.TextField(blank=True, null=True)
    topic_order = models.IntegerField(default=0)
    estimated_hours = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"{self.program.name} - {self.topic_name}"

class Batch(models.Model):
    name = models.CharField(max_length=255)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='batches')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    max_capacity = models.IntegerField(default=0)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='batches_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.name} ({self.program.name})"

class BatchTrainer(models.Model):
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='trainers')
    trainer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trainer_batches')
    is_lead = models.BooleanField(default=False)
    assigned_date = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.trainer} -> {self.batch}"

class BatchTrainee(models.Model):
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='trainees')
    trainee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='batches_as_trainee')
    enrollment_date = models.DateField(null=True, blank=True)
    completion_date = models.DateField(null=True, blank=True)
    STATUS_CHOICES = [
        ('enrolled', 'Enrolled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('dropped', 'Dropped'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='enrolled')
    rating = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.trainee} in {self.batch}"

class DesignationProgram(models.Model):
    designation = models.ForeignKey(Designation, on_delete=models.CASCADE, related_name='designation_programs')
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='designation_programs')
    is_required = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.designation} - {self.program}"

class TraineeDesignation(models.Model):
    trainee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='designations')
    designation = models.ForeignKey(Designation, on_delete=models.CASCADE)
    assigned_date = models.DateField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_designations')
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"{self.trainee} => {self.designation}"

class ProgressRecord(models.Model):
    trainee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress_records')
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='progress_records')
    topic = models.ForeignKey(ProgramTopic, on_delete=models.SET_NULL, null=True, blank=True)
    STATUS_CHOICES = [
        ('not_started', 'Not started'),
        ('in_progress', 'In progress'),
        ('completed', 'Completed'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    completion_percentage = models.IntegerField(default=0)
    notes = models.TextField(blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='progress_updated_by')
    def __str__(self):
        return f"{self.trainee} - {self.batch} - {self.topic}"

class AuditLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255)
    table_name = models.CharField(max_length=255, blank=True, null=True)
    record_id = models.IntegerField(null=True, blank=True)
    old_values = models.JSONField(null=True, blank=True)
    new_values = models.JSONField(null=True, blank=True)
    ip_address = models.CharField(max_length=45, blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"{self.action} - {self.table_name} - {self.record_id}"

class Class(models.Model):
    name = models.CharField(max_length=255)
    trainer_name = models.CharField(max_length=255)
    class_timings = models.CharField(max_length=255)  # e.g., "Mon, Wed, Fri 10:00 AM - 12:00 PM"
    google_meet_link = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='classes_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.trainer_name}"
