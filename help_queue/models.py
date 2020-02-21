# from django.db import models
from djongo import models

# Create your models here.
class User(models.Model):
    first_name = models.CharField(max_length=100)
