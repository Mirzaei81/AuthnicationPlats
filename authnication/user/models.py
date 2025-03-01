from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin,
)
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    """
    Custom user model manager where email is required for authentication.
    """

    def create_user(self, email=None, username=None, password=None, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError("The Email must be set.")
        
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.full_clean()  # Validate the model
        user.save()
        return user

    def create_superuser(self, email=None, username=None, password=None, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_verified", True)
 

        if not email:
            raise ValueError("Superuser must have an Email.")
        
        return self.create_user(email=email, username=username, password=password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User Model for authentication management through email and/or username
    """
    firstname =models.CharField(max_length=255) 
    lastname = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=150, unique=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    reset_password = models.BooleanField(default=False)
    phone_number =models.CharField(max_length=255)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    role = models.BinaryField(null=True)
    objects = UserManager()
    USERNAME_FIELD = "username"  # Use username for authentication
    REQUIRED_FIELDS = ['email',"phone_number"]  # Only eamil is required for extra fields
    def __str__(self):
        return self.email or self.username
    def clean(self):
        """
        Custom validation to ensure that at least email or username is provided.
        """
        if not self.email and not self.username:
            raise ValueError("At least one of email or username must be provided.")
class userRoles(models.Model):
    userRole = models.BinaryField(null=False)
    name = models.CharField(max_length=255)