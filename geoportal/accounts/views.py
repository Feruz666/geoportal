from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.files.storage import FileSystemStorage
from django.conf import settings 

from .forms import CreateUserForm
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from requests.auth import HTTPBasicAuth
from geo.Geoserver import Geoserver


import psycopg2
import os
import json
import requests
import pathlib


@csrf_exempt
def registerPage(request):
    
    geo = Geoserver('http://127.0.0.1:8080/geoserver', username='admin', password='geoserver')
    
    form = CreateUserForm()

    if request.method == "POST":
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            user = form.cleaned_data.get("username")
            messages.success(request, user + " Ваш аккаунт создан, пожалуйста пройдите авторизацию")
            
            geo.create_workspace(workspace=user)

            return redirect("accounts:login")
    

    context = {"form": form}
    return render(request, "accounts/registration.html", context)

@csrf_exempt
def loginPage(request):
    if request.method == "POST":
            username = request.POST.get("username")
            password = request.POST.get("password")

            user = authenticate(request, username = username, password = password)

            if user is not None:
                login(request, user)
                print(user)
                return redirect("accounts:userpage")
            else:
                messages.info(request, "Ошибка при вводе логина или пароля")
    context = {}
    return render(request, "accounts/login.html", context)


def logoutUser(request):
    logout(request)
    return redirect("accounts:login")

@login_required(login_url="accounts:login")
def user_cab(request):
    return render(request, "accounts/user_cab.html")

@csrf_exempt
@login_required(login_url="accounts:login")
def create_datastore(request):
    if request.method == "POST":
        db_name = request.POST.get("db_name")
        
        try:
            con = psycopg2.connect( database="gis_layers" ,user="postgres", password="admin", host="127.0.0.1", port="5432")
            print("Connected")
        except Exception:
            print("err")
        
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        
        cursor = con.cursor()
        
        sqlCreateDatabase = "CREATE DATABASE "+db_name+";"

        cursor.execute(sqlCreateDatabase)
        print("DataBase created")
        
        try:
            con = psycopg2.connect( database=db_name ,user="postgres", password="admin", host="127.0.0.1", port="5432")
            print(f"Connected to {db_name} DB")
        except Exception:
            print("Unable to connect to the database")
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        
        cursor = con.cursor()    
        ext = "postgis"
        ext_query = "CREATE EXTENSION "+ext+";"

        try:
            cursor.execute(ext_query)
            print("ext created")
        except:
            print("ext didnt creat")
        
        con.commit()
        cursor.close()
        con.close()
        
        logged_user = request.user
        if logged_user is not None:
            try:
                ws = logged_user
                r_url = "http://localhost:8080/geoserver/rest/workspaces/{}/datastores"
                formatted_url = r_url.format(ws)
                r_headers = {'Content-type': 'application/json',  # Определение типа данных
                        'Accept': 'text/plain',
                        'Content-Encoding': 'utf-8'}
                datas = {
                    "dataStore": {
                        "name": f"{db_name}",
                        "connectionParameters": {
                            "entry": [
                                {"@key":"host","$":"localhost"},
                                {"@key":"port","$":"5432"},
                                {"@key":"database","$":f"{db_name}"},
                                {"@key":"user","$":"postgres"},
                                {"@key":"passwd","$":"admin"},
                                {"@key":"dbtype","$":"postgis"}
                            ]
                        }
                    }
                }
                r = requests.post(formatted_url, data = json.dumps(datas), auth =HTTPBasicAuth('admin', 'geoserver'), headers = r_headers) 
                if r.status_code == 201:
                    print("A datastore has been сreated!")
                else:
                    print("A datastore has already created")
                    
            except Exception:
                print("Couldnt create a datastore in the geoserver")
        else:
            print(f"Creating datastore for this workspace is unable")
             
        return render(request, "accounts/add_DB.html")
        
    return render(request, "accounts/add_DB.html")


@csrf_exempt
@login_required(login_url="accounts:login")
def addLayer(request):
    
    file_system = None
    file_folder = None
    file_dir    = None
    datast      = ""
    
    geo = Geoserver('http://127.0.0.1:8080/geoserver', username='admin', password='geoserver')
    
    if request.method == "POST":
        logged_user = request.user
        if logged_user is not None:
            logged_user = str(logged_user)            
            uploaded_file = request.FILES["upload_file"]
            if not os.path.exists(os.path.join(settings.MEDIA_ROOT, logged_user)):
                try:
                    os.mkdir(os.path.join(settings.MEDIA_ROOT, logged_user))      
                except Exception:
                    print("Error while creating direction to the user")
            
            file_folder = os.path.join(settings.MEDIA_ROOT, logged_user)
            file_system = FileSystemStorage(file_folder)
            file_system.save(uploaded_file.name, uploaded_file)
            file_folder = str(file_folder)
            file_dir = os.path.join(file_folder, uploaded_file.name)
            
            datastores = geo.get_datastores(workspace=logged_user) 
            data_iter = datastores['dataStores']['dataStore']
            
            for i in data_iter:
                datast = i['name']
            
            try:
                geo.create_shp_datastore(path=file_dir, store_name=datast, workspace=logged_user)
                print("Shapefile added and published")

            except Exception:
                print("Error while adding shape")
            
            
        else:
            print(f"не удалось сохранить .zip")
    return render(request, "accounts/upload_shape.html")
    


def main_page(request):
    return render(request, "accounts/main.html")
