import json
import logging
from functools import update_wrapper
from typing import Literal, Optional, TypedDict


from django.contrib import admin
from django.db import models
from django.template.response import TemplateResponse
from django.urls import reverse
from django.urls.resolvers import URLPattern
from django.utils.safestring import mark_safe
from pygments import highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import JsonLexer

from apps.core.abstracts.models import ModelBase
from apps.utils.admin import get_model_admin_reverse



class AdminBase:
  """Common fields, utilities for model admin, inline admin, etc."""

  admin_name = "admin"

  def get_admin_url(
      self,
      model: models.Model,
      url_context: Literal[
          "changelist", "add", "history", "delete", "change"
      ] = "changelist",
      admin_name=None,
      as_link=False,
      link_text=None,
  ):
      """Given a model, return a link to the appropriate admin page."""
      admin_name = admin_name or self.admin_name
      url = get_model_admin_reverse(admin_name, model, url_context)

      if url_context in ["change", "history", "delete"]:
          url = reverse(url, args=[model.id])
      else:
          url = reverse(url)

      if as_link:
          return self.as_link(url, link_text or url)

      return url

  def as_link(self, url, text=None):
      """Create anchor tag for a url."""
      text = text or url

      return mark_safe(f'<a href="{url}" target="_blank">{text}</a>')

  def as_image(self, image: models.ImageField):
      if not image:
          return None

      return mark_safe(
          "<svg width='90' height='90' style='background-color:white'>"
          f"<image  xlink:href={image.url} width='100%'>"
          "</svg>"
      )

  def as_model_link(self, obj: ModelBase, text="%(model)s"):
      """Show object as a link to it's detail/edit page."""

      text = text % {"model": obj.__str__()}
      return self.as_link(obj.admin_edit_url, text=text)

  def as_json(self, obj):
      """
      Convert obj to html json format.

      Reference: https://daniel.feldroy.com/posts/pretty-formatting-json-django-admin
      """

      if obj is None:
          return None

      if isinstance(obj, dict) or isinstance(obj, list):
          obj = json.dumps(obj)

      response = json.dumps(json.loads(obj), indent=2)

      formatter = HtmlFormatter()

      response = highlight(response, JsonLexer(), formatter)
      response = response.replace("\\n", "<br>")
      style = "<style>" + formatter.get_style_defs() + "</style><br>"

      return mark_safe(style + response)
  
class ObjectTool(TypedDict):
  url: str
  label: str

class ModelAdminBase(AdminBase, admin.ModelAdmin):
  """Base class for all model admins."""

  prefetch_related_fields = ()
  """Makes another query to select a set of related objects."""

  select_related_fields = ()
  """Uses SQL Join to select a single related object."""

  readonly_fields = (
    "id",
    "created_at",
    "updated_at",
  )

  object_tools: tuple[ObjectTool] = ()

  formfield_overrides = {}

  #################################
  # == Django Method Overrides == #
  #################################

  def __init__(self, model: type, admin_site: admin.AdminSite | None) -> None:
    super().__init__(model, admin_site)


class InlineBase(AdminBase):
  extra = 0
  formfield_overrides = {}

class StackedInlineBase(InlineBase, admin.StackedInline):
  """Display fk related objects as cards, form flowing down."""


class TabularInlineBase(InlineBase, admin.TabularInline):
  """Display fk related objects in a table, fields flowing horizontally in rows."""