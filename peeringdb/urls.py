from django.conf.urls import url

from .views import IXPList

urlpatterns = [
    url(r'^ix/$', IXPList.as_view()),
]