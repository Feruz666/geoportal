from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include("accounts.urls")),
    path('geoinf/', include("geoinformation.urls")),
    path('', include("main.urls")),
    path('api/token/', obtain_auth_token, name = "obtain-token"),

]
