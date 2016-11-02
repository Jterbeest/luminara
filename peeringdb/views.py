from rest_framework import generics

from .serializers import IXPEnrichedSerializer

import django_peeringdb.models
from .models import (
  Organization,
  Network,
  InternetExchange,
  Facility,
  NetworkContact,
  NetworkIXLan,
  NetworkFacility,
  IXLan,
  InternetExchangeFacility
)


class IXPList(generics.ListAPIView):

    serializer_class = IXPEnrichedSerializer

    def get_queryset(self):

        queryset = InternetExchange.objects.all()

        return queryset
