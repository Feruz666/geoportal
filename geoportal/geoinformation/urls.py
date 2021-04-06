from django.urls import path

from .views import SensorDataList

urlpatterns = [
    path("sensors/", SensorDataList.as_view())
]