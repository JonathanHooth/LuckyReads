from typing import Literal, Optional, TypedDict
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.request import Request
from django.db import models


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


  