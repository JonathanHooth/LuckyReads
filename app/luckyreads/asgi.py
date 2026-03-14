"""
ASGI config for luckyreads project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os
import django 

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "luckyreads.settings.development")

django.setup()

from channels.routing import ProtocolTypeRouter
from django.core.asgi import get_asgi_application
from uvicorn.workers import UvicornWorker


class DjangoUvicornWorker(UvicornWorker):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.config.lifespan = "off"


django_application = get_asgi_application()

#TODO ENable for websockets
#from .routing import application as ws_application  # noqa: E402

application = ProtocolTypeRouter(
    {"http": django_application, 
     #"websocket": ws_application
     }
)