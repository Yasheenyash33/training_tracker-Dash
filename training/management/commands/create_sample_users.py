from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
User = get_user_model()
class Command(BaseCommand):
    help = "Create sample admin/trainer/trainee users"
    def handle(self, *args, **kwargs):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(username='admin', email='admin@example.com', password='adminpass', first_name='Admin', last_name='User', role='admin')
            self.stdout.write(self.style.SUCCESS('Created admin'))
        if not User.objects.filter(username='trainer1').exists():
            User.objects.create_user(username='trainer1', email='trainer1@example.com', password='trainerpass', first_name='Tina', last_name='Trainer', role='trainer')
            self.stdout.write(self.style.SUCCESS('Created trainer1'))
        if not User.objects.filter(username='trainee1').exists():
            User.objects.create_user(username='trainee1', email='trainee1@example.com', password='traineepass', first_name='Tom', last_name='Trainee', role='trainee')
            self.stdout.write(self.style.SUCCESS('Created trainee1'))
