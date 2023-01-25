from django.http import HttpResponse
from django.shortcuts import render
from django.views import View


class HomeView(View):
    def get(self, request):
        context = {}
        return render(request, "home/home.html", context)


class AboutView(View):
    def get(self, request):
        context = {}
        return render(request, "home/about.html", context)


class ContactView(View):
    def get(self, request):
        context = {}
        return render(request, "home/contact.html", context)
