FROM python:3.13.7-alpine3.22

LABEL maintainer="jhooth@ufl.edu"

RUN mkdir /app

WORKDIR /app

ENV PYTHONUNBUFFERED=1 

# Install other packages
RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    # Psycopg & handling images
    apk add --update --no-cache postgresql-client jpeg-dev && \
    # Oauth, health checks
    apk add --update --no-cache xmlsec-dev curl && \
    # CLI utilities
    apk add --update --no-cache findutils && \
    # Temp deps for pip only, deleted after pip install
    apk add --update --no-cache --virtual .tmp-build-deps \
    build-base gcc musl-dev zlib zlib-dev linux-headers \
    # Oauth, celery, etc
    libressl libffi-dev libxslt-dev libxml2-dev \
    # Psycopg
    postgresql-dev

COPY ./requirements.txt /app/requirements.txt

RUN /py/bin/pip install --no-cache-dir -r requirements.txt

COPY ./app /app/app

WORKDIR /app/app

ENV PATH="/scripts:/app/.venv/bin:/root/.local/bin:/py/bin:/usr/bin:$PATH"
ENV PYTHONPATH="/app/app:$PYTHONPATH"

CMD ["entrypoint.sh"]