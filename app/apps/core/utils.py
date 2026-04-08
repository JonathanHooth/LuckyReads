import functools
from typing import Any, Callable, Optional, get_args, get_origin

import attr
from drf_spectacular.types import OPENAPI_TYPE_MAPPING, PYTHON_TYPE_MAPPING, OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema


def get_typing(t:type):
  """Converts python typing to OpenAPI Type"""

  if(t in PYTHON_TYPE_MAPPING):
    return PYTHON_TYPE_MAPPING.get(t)
  
  base_type = get_origin(t)

  # Default typing
  my_type = OpenApiTypes.STR
  if base_type is list:
    (inner,) = get_args(t)

    inner_type = PYTHON_TYPE_MAPPING.get(inner, OpenApiTypes.STR)

    openapi_type = OPENAPI_TYPE_MAPPING.get(inner_type, {'type': 'string'})

    my_type = {'type' : 'array', 'items' : openapi_type}
  #elif base_type is dict:
  #TODO implement if dict
  return my_type

@attr.s
class Query:
  """Class that defines structure of a query param"""

  query_type:type = attr.ib(
    default=OpenApiTypes.STR, converter=get_typing
  )
  default:Optional[Any] = attr.ib(default=None)
  required:bool = attr.ib(default=False)
  description:Optional[str] = attr.ib(default=None)

def query_parameters(response:any=None, **kwargs: Query):
  """Query params for Swagger"""
  
  def decorator[T: Callable](callable: T) -> T:

    @extend_schema(
      parameters=[
        OpenApiParameter(
          name=key,
          type=value.query_type,
          location=OpenApiParameter.QUERY,
          required=value.required,
          description=value.description
        )
        for key, value in kwargs.items()
      ],
      responses= response if response else None
    )
    @functools.wraps(callable)
    def wrapper(*f_args, **f_kwargs):
      query_values = {}

      try:
        request = f_args[1]
        if request:
          for key in kwargs.keys():
            query_values[key] = request.GET.get(key, None)
      
      except Exception:
        pass

      return callable(*f_args, **f_kwargs, **query_values)
    
    return wrapper
  
  return decorator
