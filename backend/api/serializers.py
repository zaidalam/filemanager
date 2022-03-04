import pdb
from rest_framework import serializers
from .models import File, Employee, Organization
from django.contrib.auth.models import User
from django.db.models import Sum


class FileSerializer(serializers.ModelSerializer):
    size = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    filetype = serializers.SerializerMethodField()
    since_added = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = ['id', 'file', 'since_added', 'size',
                  'name', 'filetype', 'organization', 'downloads']

    def get_size(self, obj):
        file_size = ''
        if obj.file and hasattr(obj.file, 'size'):
            file_size = obj.file.size
        return file_size

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
