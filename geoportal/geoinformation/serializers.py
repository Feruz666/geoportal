from .models import SensorsData
from rest_framework import serializers


class SensorsDataSerializer(serializers.ModelSerializer):
    # id     = serializers.IntegerField(read_only=True)
    # humidity   = serializers.FloatField( default=0)
    # temperature   = serializers.FloatField( default=0)
    # CO2  = serializers.FloatField( default=0)
    
    # def create(self, validated_data):
    #     return SensorsData.objects.create(**validated_data)
    
    class Meta:
        model = SensorsData
        fields = (
            "created", 
            "humidity", 
            "temperature", 
            "CO2"
            )