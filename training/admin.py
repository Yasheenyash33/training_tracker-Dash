from django.contrib import admin
from .models import User, Program, ProgramTopic, Batch, BatchTrainer, BatchTrainee, Designation, DesignationProgram, TraineeDesignation, ProgressRecord, AuditLog
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    pass

admin.site.register(Program)
admin.site.register(ProgramTopic)
admin.site.register(Batch)
admin.site.register(BatchTrainer)
admin.site.register(BatchTrainee)
admin.site.register(Designation)
admin.site.register(DesignationProgram)
admin.site.register(TraineeDesignation)
admin.site.register(ProgressRecord)
admin.site.register(AuditLog)
