from django.urls import path
from . import views

urlpatterns = [
    path('cheatsheet/sheetjs/', views.sheetjs, name='sheetjs'),
    path('cheatsheet/sheetcss/', views.sheetcss, name='sheetcss'),
    path('cheatsheet/', views.cheatsheet, name='cheatsheet'),
    path('taschenrechner/', views.taschenrechner, name='taschenrechner'),
    path('webscraper/', views.webscraper, name='webscraper'),
    path('settings/', views.settings, name='settings'),
    path('malen/', views.malen, name='malen'),
    path('interactive/', views.interactive, name='interactive'),
    path('pwgen/', views.pwgen, name='pwgen'),
    path('systemcalculator/', views.systemcalculator, name='systemcalculator'),
    path('', views.main, name='main'),
]