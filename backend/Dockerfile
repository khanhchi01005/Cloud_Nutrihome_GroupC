# Backend Dockerfile for Nutrihome
# Build with: docker build -t nutrihome-backend:latest .

FROM python:3.11-slim

# Run as root for installation steps, container will run app as non-root user
ENV PYTHONUNBUFFERED=1
WORKDIR /app

# Install system libraries needed for common Python packages (Pillow, build tools)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libjpeg62-turbo-dev \
        zlib1g-dev \
        libpng-dev \
        libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy only dependency files first for better caching
COPY requirements.txt /app/requirements.txt

RUN pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r /app/requirements.txt

# Copy application code into image
COPY . /app

# Create a non-root user to run the app
RUN useradd --create-home appuser && chown -R appuser /app
USER appuser

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

EXPOSE 5000

CMD ["python", "app.py"]
