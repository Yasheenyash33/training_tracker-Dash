from django.db.models.signals import post_save, pre_delete, pre_save
from django.dispatch import receiver
from .models import Program, ProgressRecord, AuditLog
def record_audit(instance, action, old=None, new=None, user=None):
    try:
        AuditLog.objects.create(
            user=user,
            action=action,
            table_name=instance._meta.db_table,
            record_id=getattr(instance, 'id', None),
            old_values=old,
            new_values=new,
        )
    except Exception:
        pass

@receiver(pre_save, sender=Program)
def pre_save_program(sender, instance, **kwargs):
    if instance.pk:
        try:
            old = sender.objects.get(pk=instance.pk)
            instance._old_values = {
                'name': old.name,
                'description': old.description,
                'duration_days': old.duration_days,
                'is_active': old.is_active,
            }
        except sender.DoesNotExist:
            instance._old_values = None

@receiver(post_save, sender=Program)
def post_save_program(sender, instance, created, **kwargs):
    if created:
        record_audit(instance, 'create', old=None, new={'name': instance.name})
    else:
        record_audit(instance, 'update', old=getattr(instance, '_old_values', None), new={'name': instance.name})

@receiver(post_save, sender=ProgressRecord)
def post_save_progress(sender, instance, created, **kwargs):
    if created:
        record_audit(instance, 'create_progress', new={'status': instance.status, 'completion': instance.completion_percentage})
    else:
        record_audit(instance, 'update_progress', new={'status': instance.status, 'completion': instance.completion_percentage})

@receiver(pre_delete, sender=Program)
def pre_delete_program(sender, instance, **kwargs):
    record_audit(instance, 'delete', old={'name': instance.name})
