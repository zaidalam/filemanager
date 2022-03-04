from rest_framework import viewsets, permissions, status
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404
from django.http import HttpResponse

from rest_framework.response import Response  # from viewsets doc
from rest_framework.parsers import MultiPartParser, FormParser
import pdb


class FileViewSet(viewsets.ViewSet):
    serializer_class = FileSerializer

    # FormParser and MultiPartParser together used for full support of HTML form
    parser_classes = [MultiPartParser, FormParser]

    # we only need list and create for now otherwise viewset creates all CRUD by default
    def list(self, request):
        queryset = File.objects.all()
        serializer = FileSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = FileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset = get_object_or_404(File, pk=pk)
        queryset.downloads += 1
        queryset.save()
        file_path = queryset.file.path
        document = open(file_path, 'rb')
        response = HttpResponse(
            document, content_type='application/{}'.format(queryset.filetype))
        response['Content-Disposition'] = 'attachment; filename={}'.format(
            queryset.name)
        return response


class UserViewSet(viewsets.ViewSet):

    def retrieve(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)


class OrganizationViewSet(viewsets.ViewSet):

    def list(self, request):
        queryset = Organization.objects.all()
        serializer = OrganizationSerializer(queryset, many=True)
        return Response(serializer.data)
