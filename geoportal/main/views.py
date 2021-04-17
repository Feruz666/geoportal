from django.shortcuts import render

# Create your views here.


def main_page(request):
    return render(request, "main/main.html")


def landing(request):
    return render(request, "main/landing.html")

<<<<<<< HEAD

=======
def leaflet(request):
    return render(request, "main/leaflet.html")
>>>>>>> 866a128e1db3adb586d36193168aa7db0835df47
