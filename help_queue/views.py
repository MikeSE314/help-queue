from django.shortcuts import render
# from django.http import HttpResponse


def index(request):
    context = {}
    return render(request, 'help_queue/index.html', context)
