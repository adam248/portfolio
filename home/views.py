from django.http import HttpResponse
from django.shortcuts import render
from django.views import View


class HomeView(View):
    def get(self, request):
        context = {}
        return render(request, "home/home.html", context)


def about(request):
    return HttpResponse("<h1>About</h1>")
