from django.urls import path
from . import views

urlpatterns = [
    path('taschenrechner/', views.taschenrechner, name='taschenrechner'),
    path('webscraper/', views.webscraper, name='webscraper'),
    path('settings/', views.settings, name='settings'),
    path('malen/', views.malen, name='malen'),
    path('interactive/', views.interactive, name='interactive'),
    path('pwgen/', views.pwgen, name='pwgen'),
    path('systemcalculator/', views.systemcalculator, name='systemcalculator'),
    path('', views.main, name='main'),
]