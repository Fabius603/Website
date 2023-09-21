from django.urls import path
from . import views

urlpatterns = [
    path('settings/', views.settings, name='settings'),
    path('testing/', views.testing, name='testing'),
    path('interactive/', views.interactive, name='interactive'),
    path('pwgen/', views.pwgen, name='pwgen'),
    path('systemcalculator/', views.systemcalculator, name='systemcalculator'),
    path('', views.main, name='main'),
]