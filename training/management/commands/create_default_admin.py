from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()

class Command(BaseCommand):
    help = 'Create default admin user with predefined credentials'

    def handle(self, *args, **options):
        username = 'admin@Stack'
        email = 'admin@stack.com'
        password = 'St@ckly2025'
        first_name = 'Super'
        last_name = 'Admin'

        try:
            # Check if user already exists
            if User.objects.filter(username=username).exists():
                user = User.objects.get(username=username)
                user.set_password(password)
                user.save()
                self.stdout.write(
                    self.style.WARNING(f'User {username} already exists. Password reset to {password}')
                )
                return

            # Create the user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                role='admin',
                is_staff=True,
                is_superuser=True
            )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created admin user: {username}\\n'
                    f'Email: {email}\\n'
                    f'Password: {password}\\n'
                    f'Role: admin'
                )
            )

        except IntegrityError as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating user: {e}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Unexpected error: {e}')
            )
