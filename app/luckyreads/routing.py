from channels.routing import URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
#from apps.core.middleware import WebSocketMiddleware

websocket_urlpatterns = [
  
]

# TODO ENABLE Wnen doing websockets
#application = AllowedHostsOriginValidator(
#    WebSocketMiddleware(URLRouter(websocket_urlpatterns))
#)
