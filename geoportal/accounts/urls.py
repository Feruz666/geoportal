from django.urls import path
from .views import *
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.conf import settings

app_name = "accounts"

urlpatterns = [ 
    path('register/', registerPage, name = 'register'),
    path('login/', loginPage, name = 'login'),   
    path('logout/', logoutUser, name = 'logout'),   
    path('user-cab/', user_cab, name = 'userpage'),
    path('user-cab/create-datastore/', create_datastore, name = 'create-datastore'),
    # path('user-cab/create-datastore/', CreateGetDataStore.as_view()),
    path('user-cab/add_layer/', addLayer, name = 'add-layer'),
    
]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)