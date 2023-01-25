from django.urls import path

from . import views

urlpatterns = [
    path("", views.HomeView.as_view()),
    path("about", views.AboutView.as_view()),
    path("contact", views.ContactView.as_view()),
]
