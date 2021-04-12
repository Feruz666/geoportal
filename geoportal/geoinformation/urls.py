from django.urls import path

from .views import SensorDataList

app_name = "geoinformation"

urlpatterns = [
    path("sensors/", SensorDataList.as_view()),
]