import requests
import json
from geo.Geoserver import Geoserver
from requests.auth import HTTPBasicAuth

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import time

# cat = Catalog("http://localhost:8080/geoserver/", username="admin", password="geoserver")
# topp = cat.get_workspace("TEEEEEEST")
# print(topp)

# """
# It works!!!!
geo = Geoserver('http://127.0.0.1:8080/geoserver', username='admin', password='geoserver')
# """


datastores = geo.get_datastores(workspace="zik")   

data = {
    'dataStores': {
        'dataStore': [
            {
                'name': 'NewBase', 
                'href': 'http://127.0.0.1:8080/geoserver/rest/workspaces/NewWorkspace/datastores/NewBase.json'
            }, 
            {
                'name': 'new york roads', 
                'href': 'http://127.0.0.1:8080/geoserver/rest/workspaces/NewWorkspace/datastores/new+york+roads.json'
            }, 
            {
                'name': 'testviags', 'href': 'http://127.0.0.1:8080/geoserver/rest/workspaces/NewWorkspace/datastores/testviags.json'
            }
        ]
    }
}


data_iter = datastores['dataStores']['dataStore']
ds_list = []
for i in data_iter:
    ds_list.append(i['name'])

print(*ds_list)
# workspaces = geo.get_workspaces()
# layers = geo.get_layers()
# print(layers)
# try:
#     geo.create_shp_datastore(path='./TestViaGS.zip', store_name='NewDB2', workspace='NewWorkspace')
#     print("Added")

# except Exception:
#     print("Error")
# datastore = geo.get_datastores(store_name='Nyc Roads')

# def workspace_get():
#     url = "http://localhost:8080/geoserver/rest/"
#     url_main = "workspaces"
#     url.format(url_main)
#     cat = Catalog(url, username="admin", password="geoserver")
#     ws_name = str(input("Write down name of workspace "))
#     try:
        
#         print(f"GET it, ws name {cat.get_workspace(ws_name)}" )
        
#     except :
#         print("Error")

#     return cat.get_workspaces()




    
    
# try:
#     con = psycopg2.connect( database="layers" ,user="postgres", password="admin", host="127.0.0.1", port="5432")
#     print("Connected")
# except Exception:
#     print("err")
    
# con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

# cursor = con.cursor()
# name_Database = "testdb"

# sqlCreateDatabase = "CREATE DATABASE "+name_Database+";"

# try:
#     cursor.execute(sqlCreateDatabase)
#     print("DataBase created")
# except Exception:
#     print("not created")
    
# con.commit()

# con.close()


# con = psycopg2.connect( database=name_Database ,user="postgres", password="admin", host="127.0.0.1", port="5432")
# print(f"Connected to {name_Database} DB")
    
# cursor = con.cursor()    

# ext = "postgis"
# ext_query = "CREATE EXTENSION "+ext+";"

# try:
#     cursor.execute(ext_query)
#     print("ext created")
# except:
#     print("ext didnt creat")

# con.commit()
   
# cursor.close()

# con.close()


# try:
#     ws = "NewWorkspace"
#     r_url = "http://localhost:8080/geoserver/rest/workspaces/{}/datastores"
#     formatted_url = r_url.format(ws)
#     r_headers = {'Content-type': 'application/json',  # Определение типа данных
#             'Accept': 'text/plain',
#             'Content-Encoding': 'utf-8'}

#     datas = {
#     "dataStore": {
#         "name": f"{name_Database}",
#         "connectionParameters": {
#             "entry": [
#                 {"@key":"host","$":"localhost"},
#                 {"@key":"port","$":"5432"},
#                 {"@key":"database","$":f"{name_Database}"},
#                 {"@key":"user","$":"postgres"},
#                 {"@key":"passwd","$":"admin"},
#                 {"@key":"dbtype","$":"postgis"}
#             ]
#         }
#     }
#     }
#     # print(json.dumps(datas))
#     r = requests.post(formatted_url, data = json.dumps(datas), auth =HTTPBasicAuth('admin', 'geoserver'), headers = r_headers) 
#     if r.status_code == 201:
#         print("Created!")
#     else:
#         print("Database has already created")

# except Exception:
#     print("Error!")
    
 
   
# geo = Geoserver('http://127.0.0.1:8080/geoserver', username='admin', password='geoserver')

# try:
#     geo.create_shp_datastore(path='./TestViaGS.zip', store_name=f'{name_Database}', workspace='NewWorkspace')
#     print("Shapefile added and publishe")

# except Exception:
#     print("Error while adding shape")




 
    


