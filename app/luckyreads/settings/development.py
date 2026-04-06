from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

REST_FRAMEWORK = {
  "DEFAULT_AUTHENTICATION_CLASSES": [
      "rest_framework.authentication.TokenAuthentication",
  ],
  "DEFAULT_SCHEMA_CLASS": "drf_standardized_errors.openapi.AutoSchema",
  "EXCEPTION_HANDLER": "drf_standardized_errors.handler.exception_handler",
  "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
  
  'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
  'PAGE_SIZE': 100,

}

# # Database
# # https://docs.djangoproject.com/en/6.0/ref/settings/#databases
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }