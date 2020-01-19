# -*- coding: UTF-8 -*-
"""
Definition of urls for FirstDJProj.
"""

from django.conf.urls import url
from . import func
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = [
    url('admin/', admin.site.urls),
    url('login', func.login),
    url('getuserbookinfo', func.getuserbookinfo),
    url('getallbookinfo', func.getallbookinfo),
    url('getbookinfo', func.getbookinfo),
    url('getunboughtbooks', func.getunboughtbooks),
    url('getboughtbooks', func.getboughtbooks),
    url('selectbook', func.selectbook),
    url('searchword', func.searchword),
    url('getuserinfo', func.getuserinfo),
    url('getuserimage', func.getuserimage),
	url('getbookimage', func.getbookimage),
    url('modifynickname', func.modifynickname),
    url('selectgender', func.selectgender),
    url('modifyintroduction', func.modifyintroduction),
    url('modifyimage', func.modifyimage),
    url('checkinnotebook', func.checkinnotebook),
    url('addinnotebook', func.addinnotebook),
    url('deleteinnotebook', func.deleteinnotebook),
    url('getnotebooklist', func.getnotebooklist),
    url('getlearningwords', func.getlearningwords),
    url('getreviewwords', func.getreviewwords),
    url('learnwords', func.learnwords),
    url('reviewwords', func.reviewwords),
	url('checkincollins', func.checkincollins),
    url('getbooks', func.getbooks),
    url('setstudycount', func.setstudycount),
    url('setreviewcount', func.setreviewcount),
	url('buybook', func.buybook),
	url('setstudymode', func.setstudymode)
]