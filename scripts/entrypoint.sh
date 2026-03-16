#!/bin/sh

python manage.py wait_for_db
python manage.py migrate

python manage.py init_superuser

gunicorn luckyreads.asgi:application -k uvicorn.workers.UvicornWorker -c gunicorn.conf.py