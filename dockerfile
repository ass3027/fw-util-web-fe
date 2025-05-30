# BE DockerFile
FROM python:3.10-alpine
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# for as-is python BE
RUN apk add --no-cache openssh-client

COPY . .

EXPOSE 5005
ENTRYPOINT ["python"]
CMD ["flask_api.py"]
