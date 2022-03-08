# File Manager REST API

Web application that provides a REST API for logged-in users to upload and download files. Each user belongs to an organization and can upload files that will belong to the same organization as the user. Users should see and be able to download any of the uploaded files from any organization. Keep track of how many times each file has been downloaded, and also how many total file downloads each organization has. The application uses Dockers, Django and Django REST Framework.

## Getting started

Since the API does not provide user registration for now. we need to create user using Django.You will have to create a user by running the command in the terminal `python manage.py createsuperuser` and then go to the admin panel `localhost:8000/admin` to link the user to the Employee and create Organization as well.Then you can use that user to access the API in the frontend

### Run Test

Navigate to `backend` folder and the following command

```
python manage.py test
```

### REST API Backend server(Django) with Docker

```
docker build --tag file-manager .
docker run --publish 8000:8000 file-manager
```

### REST API Backend server(Django) without Docker

To Run the backend server,navigate to the `backend` folder and run the following commands

```
python3.9 -m venv venv(or python 3)
source env/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

```

Your backend server will be running on `localhost:8000/api/`

### Frontend server(Javascript)

Start the frontend server by navigating to the js_client folder and run the following commands, assuming your virtual environment is created

```
source env/bin/activate
python -m http.server 8111

```

Your frontend server will be running on `localhost:8111`

## API endpoints

| Endpoint                       | Description          |
| ------------------------------ | -------------------- |
| `POST /api/files`              | Create a new File    |
| `GET /api/files/`              | List files           |
| `GET /api/files/<id>/`         | Download file        |
| `GET /organization/files/`     | List organizations   |
| `GET /api/users/<id>/`         | Get user information |
| `POST /api/auth/token/`        | create access tokens |
| `POST /api/auth/token/verify/` | verify tokens        |
