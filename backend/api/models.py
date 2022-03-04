from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Organization(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return str(self.name)


class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username


class File(models.Model):
    file = models.FileField(max_length=255)
    date_created = models.DateTimeField(default=timezone.now)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    downloads = models.IntegerField(default=0, blank=True, null=True)

    def __str__(self):
        return str(self.file.name)

    @property
    def filetype(self):
        if self.file.name:
            filename = self.file.name
            return filename.split('.')[-1]
        else:
            return None

    @property
    def name(self):
        file_name = ''
        if self.file and hasattr(self.file, 'name'):
            file_name = self.file.name
        return file_name
