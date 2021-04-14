from django.urls import path

from .views import main_page, landing

app_name = "main"

urlpatterns = [
    path("", main_page, name = "main"),
    path("landing/", landing, name = "landing"),
]