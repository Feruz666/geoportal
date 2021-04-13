from django.shortcuts import render
from django.http import  JsonResponse

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser

from django.views.decorators.csrf import csrf_exempt

from .models import SensorsData
from .serializers import SensorsDataSerializer

class SensorDataList(APIView):
    
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        s_datas = SensorsData.objects.all()
        serializer = SensorsDataSerializer(s_datas, many=True)
        return JsonResponse(serializer.data, safe=False)
    
    @csrf_exempt
    def post(self, request):
        data = JSONParser().parse(request)
        serializer = SensorsDataSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


def error_404(request, exception):
        data = {}
        return render(request,'404.html', data)