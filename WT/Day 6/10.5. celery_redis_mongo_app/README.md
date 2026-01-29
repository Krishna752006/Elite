# Celery + Redis + MongoDB Join Application

## Description
Asynchronous pipeline where:
- Client submits request
- Celery worker performs MongoDB join
- Result stored in Redis KV store

## Files
- celery_app.py : Celery configuration
- tasks.py : Worker task
- client.py : Submit task
- fetch_result.py : Fetch result from Redis