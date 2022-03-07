# # Base Image
FROM python:3.9

# set working directory
WORKDIR /app

COPY requirements.txt requirments.txt
RUN python3 install -r requirments.txt

COPY . .

CMD [ "python3", "manage.py", "runserver", "0.0.0.0:8000"]
# Base Image
FROM python:3.9

# set working directory
WORKDIR /app

COPY requirements.txt requirments.txt
RUN pip3 install -r requirments.txt

COPY . .

CMD [ "python3", "manage.py", "runserver", "0.0.0.0:8000"]
