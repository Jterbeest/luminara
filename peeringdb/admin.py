from django.contrib import admin

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


class OrganizationAdmin(admin.ModelAdmin):

    pass

admin.site.register(Organization, OrganizationAdmin)


class NetworkAdmin(admin.ModelAdmin):

    pass

admin.site.register(Network, NetworkAdmin)


class InternetExchangeAdmin(admin.ModelAdmin):

    pass

admin.site.register(InternetExchange, InternetExchangeAdmin)


class FacilityAdmin(admin.ModelAdmin):

    pass

admin.site.register(Facility, FacilityAdmin)


class NetworkContactAdmin(admin.ModelAdmin):

    pass

admin.site.register(NetworkContact, NetworkContactAdmin)


class NetworkIXLanAdmin(admin.ModelAdmin):

    pass

admin.site.register(NetworkIXLan, NetworkIXLanAdmin)


class NetworkFacilityAdmin(admin.ModelAdmin):

    pass

admin.site.register(NetworkFacility, NetworkFacilityAdmin)


class IXLanAdmin(admin.ModelAdmin):

    pass

admin.site.register(IXLan, IXLanAdmin)


class IXLanPrefixAdmin(admin.ModelAdmin):

    pass

admin.site.register(IXLanPrefix, IXLanPrefixAdmin)


class InternetExchangeFacilityAdmin(admin.ModelAdmin):

    pass

admin.site.register(InternetExchangeFacility, InternetExchangeFacilityAdmin)
