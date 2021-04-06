from django.db import models

# Create your models here.

class SensorsData(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    humidity = models.FloatField(blank=True)
    temperature = models.FloatField(blank=True)
    CO2 = models.FloatField(blank=True)

