from rest_framework import serializers
from .models import File, Employee, Organization
from django.contrib.auth.models import User
from django.db.models import Sum


class FileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    filetype = serializers.SerializerMethodField()
    since_added = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = ['id', 'file', 'since_added',
                  'name', 'filetype', 'organization', 'downloads']

    def get_name(self, obj):
        file_name = ''
        if obj.file and hasattr(obj.file, 'name'):
            file_name = obj.name
        return file_name

    def get_filetype(self, obj):
        if obj.file.name:
            return obj.filetype
        else:
            return None

    def get_since_added(self, obj):
        date_added = obj.date_created
        return date_added


class UserSerializer(serializers.ModelSerializer):
    organization = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'organization', 'username']

    def get_organization(self, obj):
        organization = obj.employee.organization.id
        return organization


class OrganizationSerializer(serializers.ModelSerializer):
    file_downloads = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ['id', 'name', 'file_downloads']

    def get_file_downloads(self, obj):
        downloads = obj.file_set.aggregate(Sum('downloads'))
        return downloads['downloads__sum']


# class RegistrationSerializer(serializers.ModelSerializer):
#     password2 = serializers.CharField(
#         style={'input:type': 'password'}, write_only=True)

#     class Meta:
#         model = User
#         fields = ['email', 'username', 'password', 'password2']
#         extra_kwargs = {
#             'password': {'write_only': True}
#         }

#     def save(self):
#         user = User(
#             email=self.validated_data['email'],
#             username=self.validated_data['username'],

#         )
#         password = self.validated_data['password']
#         password2 = self.validated_data['password2']

#         if password != password2:
#             raise serializers.ValidationError(
#                 {'password': 'Passwords must match.'})
#         user.set_password(password)
#         user.save()
#         Employee.create(
#             user=user, organization_id=self.validated_data['organization'])
