import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import time
import json

try:
    con = psycopg2.connect( database="layers" ,user="postgres", password="admin", host="127.0.0.1", port="5432")
    print("Connected")
except Exception:
    print("err")
    
con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
# Obtain a DB Cursor
cursor = con.cursor()
# Create table statement
query = " SELECT ST_AsGeoJSON(nyc_roads.*) from nyc_roads; "
# Create a table in PostgreSQL database

try:
    cursor.execute(query)
    results = cursor.fetchall()
    print("Gor Data!!!")
except Exception:
    print("Error")
    
asd = json.dumps(results)
js_res = json.loads(asd)

# newString = js_res.replace('\ ', '"')
print(js_res)

with open("blank.json", "w") as file:
    file.write(js_res)
    
cursor.close()

con.close()
    