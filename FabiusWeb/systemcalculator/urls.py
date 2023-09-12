from django.urls import path
from . import views

urlpatterns = [
    path('pwgen/', views.pwgen, name='pwgen'),
    path('systemcalculator/', views.systemcalculator, name='systemcalculator'),
    path('', views.main, name='main'),
]