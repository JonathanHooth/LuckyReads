from typing import Literal, Optional, TypedDict
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.request import Request
from django.db import models

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers

from rest_framework.viewsets import GenericViewSet, ModelViewSet, ViewSet

from rest_framework import authentication, filters, mixins, permissions

from apps.core.abstracts.serializers import RetrieveParamSerializer


class ViewSetBase(GenericViewSet):
  """
  Provide core functionality, additional type hints, and improved documentaton for viewsets.
  """

  authentication_classes = [authentication.TokenAuthentication]

  permission_classes = [permissions.IsAuthenticated]

  action: Literal["list", "create", "retrieve", "update", "partial_update", "destroy"]

  detail: bool

  request: Request

  kwargs: dict

  search_fields: list

  filterset_class: type
  """Optionally pass a filterset class to define complex filtering."""

  filterset_fields: list
  """Optionally define which fields can be filtered against in the url."""

  filter_backends: list = [DjangoFilterBackend]


  def filter_queryset(self, queryset: models.QuerySet) -> models.QuerySet:
    return super().filter_queryset(queryset)
  
  def __init__(self, **kwargs):
    super().__init__(**kwargs)

  def get_object(self):
    lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
    serializer = RetrieveParamSerializer(
        data={"pk": self.kwargs.get(lookup_url_kwarg, None)}
    )
    serializer.is_valid(raise_exception=True)
    return super().get_object()



class ObjectViewPermissions(permissions.DjangoObjectPermissions):
  """
  Check object permissions via api.

  Simply provides a wrapper around DRF's DjangoObjectPermissions class
  to allow for easy view/editing of additional permissions per each
  http method type.
  """

  perms_map = {
    "GET": ["%(app_label)s.view_%(model_name)s"],
    "OPTIONS": [],
    "HEAD": [],
    "POST": ["%(app_label)s.add_%(model_name)s"],
    "PUT": ["%(app_label)s.change_%(model_name)s"],
    "PATCH": ["%(app_label)s.change_%(model_name)s"],
    "DELETE": ["%(app_label)s.delete_%(model_name)s"],
  }


class ObjectViewDetailsPermissions(ObjectViewPermissions):
  """
  Overrides custom `ObjectViewPermissions` class to also require
  the `view_model_details` permission when viewing an object.
  """

  perms_map = {
    **ObjectViewPermissions.perms_map,
    "GET": [
        *ObjectViewPermissions.perms_map["GET"],
        "%(app_label)s.view_%(model_name)s_details",
    ],
  }

  
class ModelViewSetBase(ModelViewSet, ViewSetBase):
    """Base viewset for model CRUD operations."""

    # Enable permissions checking in API
    permission_classes = ViewSetBase.permission_classes + [ObjectViewPermissions]

    # Cache detail view for 5 seconds for each different Authorization header,
    # Helps speed up duplicate requests and helps against DDoS
    @method_decorator(cache_page(5))
    @method_decorator(vary_on_headers("Authorization"))
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    # Cache list view for 5 seconds for each different Authorization header
    # Helps speed up duplicate requests and helps against DDoSs
    @method_decorator(cache_page(5))
    @method_decorator(vary_on_headers("Authorization"))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)