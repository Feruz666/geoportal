from django.shortcuts import render

# Create your views here.


def main_page(request):
    return render(request, "main/main.html")


def landing(request):
    return render(request, "main/landing.html")

def leaflet(request):
    return render(request, "main/leaflet.html")
