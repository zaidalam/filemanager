from api.models import Employee, Organization, File
from django.conf import settings
from django.contrib.auth.models import User
from django.core.files.storage import Storage
from django.urls import reverse
from io import StringIO
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from unittest.mock import patch
import jwt


class BaseTestCase(APITestCase):

    def setUp(self):
        # create user
        self.email = 'user@example.com'
        self.username = 'user'
        self.password = 'pass'
        self.user = User(username=self.username, email=self.email)
        self.user.is_active = True
        self.user.set_password(self.password)
        self.user.save()

        # create organization
        self.organization = Organization(name='org')
        self.organization.save()
        # create employee
        self.employee = Employee(
            user=self.user, organization=self.organization)
        self.employee.save()
        self.data = {
            'username': self.username,
            'password': self.password
        }
        self.client = APIClient(enforce_csrf_checks=True)


class FileViewSetTestCase(BaseTestCase):

    def setUp(self):
        return super(FileViewSetTestCase, self).setUp()

    @patch('django.core.files.storage.FileSystemStorage.save')
    def test_api(self, mock_save):  # TO DO #### Create separate tests for each api endpoint
        url = reverse('token_obtain_pair')
        # Get access token
        resp = self.client.post(
            url, self.data, format='json')
        token = resp.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        # decode payload to see if we got the right access token
        decoded_payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=["HS256"])
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(decoded_payload['user_id'], self.user.id)

        # Make a Post request to correct access token to create a File
        mock_save.return_value = 'test.pdf'
        resp = self.client.post('/api/files/', {
            'file': StringIO('test'),
            'organization': self.organization.id
        })
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(File.objects.count(), 1)
        mock_save.assert_called_once()  # No file saved!

        # Make a Get request to get a list of files
        resp = self.client.get('/api/files/', format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
