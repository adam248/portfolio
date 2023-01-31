from django.http import HttpResponse
from django.shortcuts import render
from django.views import View


class HomeView(View):
    def get(self, request):
        context = {}
        return render(request, "home/home.html", context)


class CreativeCodingView(View):
    def get(self, request):
        context = {}
        return render(request, "home/creative-coding.html", context)


class BouncingBallsView(View):
    def get(self, request):
        context = {}
        return render(request, "home/p5/bouncing-balls.html", context)


class StarfieldView(View):
    def get(self, request):
        context = {}
        return render(request, "home/p5/starfield.html", context)


class AboutView(View):
    def get(self, request):
        context = {}
        return render(request, "home/about.html", context)


class ContactView(View):
    def get(self, request):
        context = {}
        return render(request, "home/contact.html", context)
