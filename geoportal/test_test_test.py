from geoserver.catalog import Catalog
import os
import pathlib

url = "http://localhost:8080/geoserver/rest/{}"


def workspace_post():
    url_main = "workspaces"
    url.format(url_main)
    cat = Catalog(url, username="admin", password="geoserver")
    ws_name = str(input("Write down name of workspace "))
    try:
        cat.create_workspace(ws_name)
        print("Created")
        
    except :
        print("Error")

    return cat.get_workspaces()

# if not os.path.exists("C:/Workspace/Job/geoportal/geoportal/test_folder"):
#     os.mkdir("C:/Workspace/Job/geoportal/geoportal/test_folder")


# file_direction = pathlib.Path(__file__).parent.absolute()
# print(type(file_direction))

fine_name = os.path.basename()