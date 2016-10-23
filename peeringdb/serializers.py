from rest_framework import serializers

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
    IXLanPrefix,
    InternetExchangeFacility
)


class Prefixes(serializers.ModelSerializer):

    class Meta:
        model = IXLanPrefix
        fields = [
            'prefix'
        ]


class Lans(serializers.ModelSerializer):

    class Meta:
        model = IXLan
        fields = [
            'id',
        ]

class IXPEnrichedSerializer(serializers.ModelSerializer):

    class Meta:
        model = InternetExchange
        fields = [
            'name',
            'city',
            'country',
            'website',
            'tech_email',
            'tech_phone',
            'policy_email',
            'policy_phone',
            'prefixes',
        ]

