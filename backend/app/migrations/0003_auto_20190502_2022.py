# Generated by Django 2.1.7 on 2019-04-02 16:57
# -*- coding: utf-8 -*-

from django.db import migrations, models
from app.models import Dict
import csv

filename = 'dictfile/ecdict.csv'
headernames = {'word':0,
    'phonetic': 1,
    'definition': 2,
    'translation': 3,
    'exchange': 10,
}

def read_csv_in(filename, headernames):
    file = open(filename, 'r', encoding='utf8')
    data = csv.reader(file)
    results = [[] for i in range(len(headernames))]
    for lineinfo in data:
        count = 0
        for header in headernames:
            results[count].append(lineinfo[headernames[header]])
            count += 1
    file.close()
    return results

def forwards_func(apps, schema_editor):
    db_alias = schema_editor.connection.alias
    word, phonetic, definition, translation, exchange = read_csv_in(filename, headernames)
    dictdata = []
    dicttable = apps.get_model("app", "Dict")
    
    for i in range(len(word)):
        dictdata.append(Dict(word=None if word[i] == '' else word[i], 
            phonetic=None if word[i] == '' else phonetic[i], 
            definition=None if word[i] == '' else definition[i], 
            translation=None if word[i] == '' else translation[i], 
            exchange=None if word[i] == '' else exchange[i]))
    dicttable.objects.using(db_alias).bulk_create(dictdata)
    


def reserve_func(apps, schema_editor):
    db_alias = schema_editor.connection.alias
    apps.get_model("app", "Dict").using(db_alias).objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(forwards_func, reserve_func)
    ]
