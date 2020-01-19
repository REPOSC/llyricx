# -*- coding: UTF-8 -*-
"""
Definition of models.
"""

from django.db import models

class Dict(models.Model):
    id = models.AutoField(primary_key=True)
    word = models.CharField(max_length=4095, null=True)
    phonetic = models.CharField(max_length=4095, null=True)
    definition = models.CharField(max_length=4095, null=True)
    translation = models.CharField(max_length=4095, null=True)
    exchange = models.CharField(max_length=4095, null=True)
    
class User(models.Model):
    id = models.CharField(max_length=127, unique=True, primary_key=True)
    nickname = models.CharField(max_length=4095)
    money = models.IntegerField(default=0)
    image = models.ImageField(upload_to='images/user_image', default='')
    gender = models.CharField(max_length=4, default='保密')
    introduction = models.CharField(max_length=4095, null=True)
    activebook = models.ForeignKey("Book", null=True, on_delete=models.SET_NULL)
    studycount = models.IntegerField(default=20)
    reviewcount = models.IntegerField(default=20)
    activemode = models.IntegerField(default=0)

class Book(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=4095)
    money = models.IntegerField(default=0)
    image = models.ImageField(upload_to='images/book_image', default='')
    introduction = models.CharField(max_length=4095, null=True)

class Word(models.Model):
    id = models.AutoField(primary_key=True)
    book = models.ForeignKey("Book", on_delete=models.CASCADE)
    en = models.CharField(max_length=4095)
    ch = models.CharField(max_length=4095)

class StudyWord(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    word = models.ForeignKey("Word", on_delete=models.CASCADE)
    grasped = models.BooleanField(default=False)
    grasppercent = models.IntegerField(default=0)

class NoteBook(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    word = models.ForeignKey("Word", on_delete=models.CASCADE)

class UserBook(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    book = models.ForeignKey("Book", on_delete=models.CASCADE)
