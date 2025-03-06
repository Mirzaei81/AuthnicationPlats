# Pull official base image
FROM python:3.11-slim-bullseye


# Set work directory
WORKDIR /srv/auth

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    gcc \
    netcat \
    libpq-dev \
    postgresql-client \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

# Install Python dependencies
COPY ./authnication/requirements.txt .
RUN pip install -r requirements.txt

# Copy project files
COPY ./authnication/ .

CMD ["/bin/bash", "/srv/auth/authnication/run.sh"]
