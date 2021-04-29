from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.files.storage import FileSystemStorage
from django.conf import settings 
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator

from .forms import CreateUserForm
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from requests.auth import HTTPBasicAuth
from geo.Geoserver import Geoserver

from .configs import *

import psycopg2
import os
import json
import requests


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


def postgre_con_create_db(db_name):
        try:
            con = psycopg2.connect(database="gis_layers", user=USER, password=PASSWORD, host=HOST, port=PORT)
            print("Connected to the Postgre")
        except Exception:
            print("error while connecting to Postgre")

        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = con.cursor()
        sqlCreateDatabase = "CREATE DATABASE "+db_name+";"

        cursor.execute(sqlCreateDatabase)
        print("DataBase created")

        try:
            con = psycopg2.connect( database=db_name ,user=USER, password=PASSWORD, host=HOST, port=PORT)
            print(f"Connected to {db_name} DB")
        except Exception:
            print("Unable to connect to the database")
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        
        cursor = con.cursor()    
        ext = "postgis"
        ext_query = "CREATE EXTENSION "+ext+";"

        try:
            cursor.execute(ext_query)
            print("extension created")
        except:
            print("extension didnt creat")
        
        con.commit()
        cursor.close()
        con.close()

class CreateGetDataStore(View):
    def __init__(self):
        self.geo = GEO
        self.user_workspace = None
        self.datastores = None
        self.template = "accounts/add_DB.html"
        self.default_db = "gis_layers"
        self.error_template = 0


    @method_decorator(login_required)
    def post(self, request):
        if request.method == "POST":
            user = request.user
            db_name = request.POST.get("db_name")
            if user is not None:
                try:
                    postgre_con_create_db(db_name)


                    ws = user
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
                                    {"@key":"host","$":HOST},
                                    {"@key":"port","$":PORT},
                                    {"@key":"database","$":f"{db_name}"},
                                    {"@key":"user","$":USER},
                                    {"@key":"passwd","$":PASSWORD},
                                    {"@key":"dbtype","$":"postgis"}
                                ]
                            }
                        }
                    }
                    r = requests.post(formatted_url, data = json.dumps(datas), auth =HTTPBasicAuth(GEOSERVER_LOG, GEOSERVER_PASS), headers = r_headers) 
                    if r.status_code == 201: 
                        print("A datastore has been сreated!")
                    else:
                        print("A datastore has already created")

                    return render(request, self.template)
                except Exception:
                    print("Не удалось создать базу в постгре или в геосервере")
                    return render(request, "accounts/error_page.html")
            else:
                return render(request, "accounts/error_page.html")


    @method_decorator(login_required)
    def get(self, request):
        if request.method == "GET":
            user = request.user
            if user is not None:
                try:
                    self.user_workspace = self.geo.get_workspace(workspace=user)
                    self.datastores = self.geo.get_datastores(workspace=user)

                    
                    data_iter = self.datastores["dataStores"]["dataStore"]
                    ds_list = []
                    for i in data_iter:
                        ds_list.append(i["name"])
                    print(ds_list)
                        
                    return  render(request, self.template, context={"ds_list": ds_list})

                except Exception:
                    print("Something goes wrong")
            
        return render(request, self.template)  



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
    
