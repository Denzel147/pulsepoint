# Use an official Python image
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy files from your project folder into the container
COPY . .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port your app runs on (change to 8080)
EXPOSE 8080

# Start the app
CMD ["python", "app.py"]

