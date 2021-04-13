from django.urls import path

from .views import SensorDataList, error_404

app_name = "geoinformation"

handler404 = "geoinformation.views.error_404"

urlpatterns = [
    path("sensors/", SensorDataList.as_view()),
]