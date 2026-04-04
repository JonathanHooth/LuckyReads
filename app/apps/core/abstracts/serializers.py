
import copy
from enum import Enum
from django.db import models

from django.utils.functional import cached_property
from rest_framework import serializers
from django.core import validators


class FieldType(Enum):
  READONLY = "readonly"
  WRITABLE = "writable"
  REQUIRED = "required"
  UNIQUE = "unique"
  LIST = "list"
  IMAGE = "image"
  BOOLEAN = "boolean"


class SerializerBase(serializers.Serializer):
  """Wrapper around the base drf serializer."""

  datetime_format = "%Y-%m-%d %H:%M:%S"


  @cached_property
  def all_fields(self) -> list[str]:
    """Get list of all fields in serializer."""

    return list(self.get_fields().keys())
  

  def get_fields(self) -> dict[str, serializers.Field | serializers.BaseSerializer]:
    return super().get_fields()
  

  def get_field_types(self, field_name: str, serializer=None) -> list[FieldType]:
    """Get ``FieldType`` for a given field."""
    serializer = serializer if serializer is not None else self

    field_types = []

    if field_name in serializer.writable_fields:
        field_types.append(FieldType.WRITABLE)

    if field_name in serializer.readonly_fields:
        field_types.append(FieldType.READONLY)

    if field_name in serializer.required_fields:
        field_types.append(FieldType.REQUIRED)

    if field_name in serializer.unique_fields:
        field_types.append(FieldType.UNIQUE)

    if field_name in serializer.list_fields:
        field_types.append(FieldType.LIST)

    if field_name in serializer.image_fields:
        field_types.append(FieldType.IMAGE)

    if field_name in serializer.boolean_fields:
        field_types.append(FieldType.BOOLEAN)

    return field_types

  

class ModelSerializerBase(SerializerBase, serializers.ModelSerializer):
  """Default functionality for model serializer."""

  datetime_format = SerializerBase.datetime_format

  default_fields = ["id", "created_at", "updated_at"]

  class Meta:
    model = None

  @property
  def model_class(self) -> type[models.Model]:
    return self.Meta.model


  def run_prevalidation(self, data=None):
    """
    Can be used to pull out objects and set child querysets before actual validation.
    This can be used to scope querysets of certain fields to other fields.

    Example setting queryset of "child" field based on "parent":
    ```
    def run_pre_validation(self, data=None):
        children = data.pop('children', None)

        res = super().run_prevalidation(data)
        parent = res.get('parent')
        self.fields['children'].child_relation.queryset = Model.objects.filter(parent=parent)

        return res
    """
    return super().run_validation(data)
  
  def run_validation(self, data=None):
    pre_data = copy.deepcopy(data)
    self.run_prevalidation(pre_data)
    return super().run_validation(data)

class ModelSerializer(ModelSerializerBase):
  """Main Serializer Class"""

  datetime_format = SerializerBase.datetime_format

  id = serializers.IntegerField(label="ID", read_only=True)
  created_at = serializers.DateTimeField(
      format=datetime_format, read_only=True, required=False
  )
  updated_at = serializers.DateTimeField(
      format=datetime_format, read_only=True, required=False
  )

  class Meta:
      fields = "__all__"
      read_only_fields = ["id", "created_at", "updated_at"]


class RetrieveParamSerializer(serializers.Serializer):
    pk = serializers.IntegerField(validators=[validators.MinValueValidator(1)])

    class Meta:
        fields = "__all__"