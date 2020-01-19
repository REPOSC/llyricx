from django.http import HttpRequest
from django.http import JsonResponse, HttpResponse
from app.models import Dict
from app.models import User
from app.models import Book
from app.models import UserBook
from app.models import StudyWord
from app.models import Word
from app.models import NoteBook
from random import*
import requests, json
import sys
sys.path.append("..")
from Log import Log
import time
import random

txservice_getopenid_url = "https://api.weixin.qq.com/sns/jscode2session"


def getautonickname():
	lbefore = ["低调的", "快乐的", "勤奋的", "聪明的", "霸气的"]
	lafter = ["小熊", "月亮", "加菲猫", "松鼠", "企鹅"]
	x = random.randint(0, len(lbefore) - 1)
	y = random.randint(0, len(lafter) - 1)
	return lbefore[x] + lafter[y]
	
def getuserid(openid):
    resultuser = User.objects.filter(id=openid)
    if not resultuser.exists():
        resultuser = User.objects.create(id=openid, nickname=getautonickname(),
            money=0, image='', gender='保密', introduction=None, 
            activebook=None)        
        resultuser.save()
        resultfreebook = Book.objects.filter(money=0)
        userfreebooks = []
        for book in resultfreebook:
            userfreebooks.append(UserBook(user=resultuser, book=book)) #将所有免费书插入UserBook
        UserBook.objects.bulk_create(userfreebooks)
    else:
        resultuser = resultuser[0]
    return JsonResponse({
        'error':0,
        'id':resultuser.id,
    })

def getuserinfo(request):
    id = request.POST.get('id')
    resultuser = User.objects.get(id=id)
    return JsonResponse({
        'error':0,
        'hasintroduction':'1' if resultuser.introduction is not None else '0',
        'hasimage': '1' if resultuser.image != '' else '0',
        'introduction': 'null' if resultuser.introduction is None else resultuser.introduction,
        'gender': resultuser.gender,
        'nickname': resultuser.nickname,
        'money': resultuser.money,
        'studycount': resultuser.studycount,
        'reviewcount': resultuser.reviewcount,
        'mode': resultuser.activemode
    })

def getuserimage(request):
    id = request.GET.get('id')
    resultuser = User.objects.get(id=id)
    return HttpResponse(resultuser.image)
    
def getbookimage(request):
    id = request.GET.get('id')
    resultbook = Book.objects.get(id=id)
    return HttpResponse(resultbook.image)
    
def setstudymode(request):
    id = request.POST.get('id')
    mode = request.POST.get('mode')
    resultuser = User.objects.get(id=id)
    resultuser.activemode = mode
    resultuser.save()
    return JsonResponse({
        'error' : 0
    })

def getuserbookinfo(request): 
    id = request.POST.get('id')
    resultuser = User.objects.get(id=id)        
    bookname = 'null'
    bookid = 'null'
    allwordcount = 0
    studiedwordcount = 0
    if resultuser.activebook is not None:
        book = resultuser.activebook
        bookname = book.name
        bookid = book.id
        allword = Word.objects.filter(book=book)
        allwordcount = allword.count()
        studiedwordcount = StudyWord.objects.filter(user=resultuser).filter(word__in=allword).count()            
    return JsonResponse({
        'error':0,
        'bookid':bookid,
        'bookname':bookname,
        'allwordcount':allwordcount,
        'studiedwordcount':studiedwordcount,
        'mode': resultuser.activemode
    })

def getbooks(request):
    id = request.POST.get('id')
    resultuser = User.objects.get(id=id)        
    bookname = 'null'
    bookid = 'null'
    books = []
    all_books = Book.objects.all()
    for book in all_books:
        books.append({
            'id':book.id,
            'name':book.name
        })
    if resultuser.activebook is not None:
        book = resultuser.activebook
        bookname = book.name
        bookid = book.id    
    return JsonResponse({
        'error':0,
        'bookid':bookid,
        'bookname':bookname,
        'books':books,
    })


def getallbookinfo(request):
    id = request.POST.get('id')
    resultuser = User.objects.get(id=id)
    currentbookid = -1
    if resultuser.activebook is not None:
        currentbookid = resultuser.activebook.id
    resultbook = []
    all_books = UserBook.objects.filter(user=resultuser)
    for userbook in all_books:
        resultbook.append({
            'id':userbook.book.id,
            'name':userbook.book.name
        })
    return JsonResponse({
        'error':0,
        'books':resultbook,
        'currentbookid':currentbookid
    })

def getbookinfo(request):
    bookid = request.POST.get('bookid')
    resultbook = Book.objects.get(id=bookid)
    return JsonResponse({
        'error':0,
        'name':resultbook.name,
        'money':resultbook.money,
        
        'introduction':resultbook. introduction,
    })    

def getunboughtbooks(request):
    id = request.POST.get('id')
    resultuser = User.objects.get(id=id)
    filter = request.POST.get('filter')
    result_books = Book.objects.exclude(userbook__user=resultuser).filter(name__icontains=filter)
    resultbook = []
    for book in result_books:
        resultbook.append({
                'id':book.id,
                'name':book.name,
                'introduction':book.introduction,
                'money':book.money
            })
    return JsonResponse({
        'error':0,
        'books':resultbook,
    })

def getboughtbooks(request):
    id = request.POST.get('id')
    resultuser = User.objects.get(id=id)
    filter = request.POST.get('filter')
    result_books = UserBook.objects.filter(user=resultuser, book__name__icontains=filter)
    resultbook = []
    for userbook in result_books:
        resultbook.append({
                'id':userbook.book.id,  
                'name':userbook.book.name,
                'introduction':userbook.book.introduction,
                'money':userbook.book.money
            })
    return JsonResponse({
        'error':0,
        'books':resultbook,
    })    

def selectbook(request):
    userid = request.POST.get('userid')
    bookid = request.POST.get('bookid')
    resultuser = User.objects.get(id=userid)
    resultbook = Book.objects.get(id=bookid)
    resultuser.activebook = resultbook
    resultuser.save()
    return JsonResponse({
        'error':0
    })

def login(request):
    code = request.POST.get('code')
    appid = request.POST.get('appid')
    appsecret = request.POST.get('appsecret')
    r = requests.get(txservice_getopenid_url, params={
        'appid':appid,
        'secret':appsecret,
        'js_code':code,
        'grant_type':'authorization_code'
    })
    r.encoding = 'utf8'
    jsondata = r.content.decode()
    dictdata = json.loads(jsondata)
    if 'errcode' not in dictdata or dictdata['errcode'] == 0:
        return getuserid(dictdata['openid'])
    else:
        return JsonResponse({
            "error": dictdata['errcode']
        })

def searchword(request):
    searchword = request.POST.get('checkword')
    resultwords = Word.objects.filter(en=searchword)
    checkwords = []
    for checkword in resultwords:
        checkwords.append({
            'book':checkword.book.name,
            'id':checkword.id,
            'en':checkword.en,
            'ch':checkword.ch,
        })
    return JsonResponse({
        'error': 0,
        'checkwords':checkwords,
    })

def searchbooks(request):
    searchbook = request.POST.get('bookname')
    resultbooks = Word.objects.filter(en=searchword)
    checkwords = []
    for checkword in resultwords:
        checkwords.append({
            'book':checkword.book.name,
            'id':checkword.id,
            'en':checkword.en,
            'ch':checkword.ch,
        })
    return JsonResponse({
        'error': 0,
        'checkwords':checkwords,
    })


def modifynickname(request):
    id = request.POST.get('id')
    nickname = request.POST.get('nickname')
    resultuser = User.objects.get(id=id)
    resultuser.nickname = nickname
    resultuser.save()
    return JsonResponse({
        'error':0
    })

def modifyintroduction(request):
    id = request.POST.get('id')
    introduction = request.POST.get('introduction')
    resultuser = User.objects.get(id=id)
    resultuser.introduction = introduction
    resultuser.save()
    return JsonResponse({
        'error':0
    })

def modifyimage(request):
    id = request.POST.get('id')
    imagefile = request.FILES.get('file')
    resultuser = User.objects.get(id=id)
    resultuser.image = imagefile
    resultuser.save()
    return JsonResponse({
        'error':0
    })

def selectgender(request):
    id = request.POST.get('id')
    gender = request.POST.get('gender')
    resultuser = User.objects.get(id=id)
    resultuser.gender = gender
    resultuser.save()
    return JsonResponse({
        'error':0
    })

def checkinnotebook(request):
    userid = request.POST.get('userid')
    wordid = request.POST.get('wordid')
    resultuser = User.objects.get(id=userid)
    resultword = Word.objects.get(id=wordid)
    result = NoteBook.objects.filter(user=resultuser, word=resultword)
    if result.exists():
        return JsonResponse({
            'error':0,
            'innotebook':1
        })
    else:
        return JsonResponse({
            'error':0,
            'innotebook':0
        })

def addinnotebook(request):
    userid = request.POST.get('userid')
    wordid = request.POST.get('wordid')
    resultuser = User.objects.get(id=userid)
    resultword = Word.objects.get(id=wordid)
    result = NoteBook.objects.create(user=resultuser, word=resultword)
    result.save()
    return JsonResponse({
        'error':0,
    })

def deleteinnotebook(request):
    userid = request.POST.get('userid')
    wordid = request.POST.get('wordid')
    resultuser = User.objects.get(id=userid)
    resultword = Word.objects.get(id=wordid)
    NoteBook.objects.filter(user=resultuser, word=resultword).delete()
    return JsonResponse({
        'error':0,
    })


def getnotebooklist(request):
    id = request.POST.get('id')
    currentuser = User.objects.get(id=id)
    wordlist = NoteBook.objects.filter(user=currentuser)
    result = []
    for word in wordlist:
        result.append({
                'id': word.word.id,
                'en': word.word.en,
                'ch': word.word.ch})
    return JsonResponse({"error":0,
                         "words":result})

def getlearningwords(request):
    #begin = time.time()
    userid = request.POST.get('id')
    user = User.objects.get(id=userid)
    book = user.activebook
    wordlist = set(Word.objects.filter(book=book).values_list("id", flat=True)) #整个这本书的所有单词的id
    studywords = set(StudyWord.objects.filter(user=user, word__book=book).values_list("word", flat=True)) #用户背过的单词的id
    lastset = wordlist - studywords #差集
    currentnumber = user.studycount if len(lastset) >= user.studycount else len(lastset)  #这一次取出来多少个单词要背
    words = random.sample(lastset, currentnumber)   #随机从剩下的里面选
    lastset = wordlist - set(words) #剩下的单词（用于提供错误答案）
    currentnumber = 3 * user.studycount if len(lastset) >= 3 * user.studycount else len(lastset)  #选错误答案的个数
    otherwords = random.sample(lastset, currentnumber)  #错误答案的单词id
    resultwords = []
    resultotherwords = []
    length = 0
    for learningword in words:
        learningword = Word.objects.get(id=learningword)    #根据id选出来单词对象
        resultwords.append({
            "error":0,
            "id": learningword.id,
            "en": learningword.en,
            "ch": learningword.ch,
        })
        length += 1
    for otherword in otherwords:
        otherword = Word.objects.get(id=otherword)    #根据错误id选出来错误单词对象
        resultotherwords.append({
            "error":0,
            "id": otherword.id,
            "en": otherword.en,
            "ch": otherword.ch,
        })
    
    #end = time.time()
    #Log.log(end - begin)
    return JsonResponse({
                "words": resultwords,
                "otherwords": resultotherwords,
                "length":length
            })

def getreviewwords(request):
    userid = request.POST.get('id')
    user = User.objects.get(id=userid)
    book = user.activebook
    wordlist = set(Word.objects.filter(book=book).values_list("id", flat=True)) #整个这本书的所有单词的id
    studywords = StudyWord.objects.filter(user=user, word__book=book).order_by('grasppercent') #用户背过的单词的id
    currentnumber = user.reviewcount if len(studywords) >= user.reviewcount else len(studywords)  #这一次取出来多少个单词要复习
    words = set(studywords.values_list("word", flat=True)[:currentnumber]) #掌握最差的学过的currentnumber个单词
    lastset = wordlist - set(words) #剩下的单词，用于提供错误答案
    currentnumber = 3 * user.reviewcount if len(lastset) >= 3 * user.reviewcount else len(lastset) #错误答案对应的单词的个数
    otherwords = random.sample(lastset, currentnumber) #随机选出错误单词
    resultwords = []
    resultotherwords = []
    for learningword in words:
        learningword = Word.objects.get(id=learningword)   #根据id选出来单词对象（性能问题！）
        resultwords.append({
            "error":0,
            "id": learningword.id,
            "en": learningword.en,
            "ch": learningword.ch,
        })
    for otherword in otherwords:
        otherword = Word.objects.get(id=otherword)    #根据错误id选出来错误单词对象（性能问题！）
        resultotherwords.append({
            "error":0,
            "id": otherword.id,
            "en": otherword.en,
            "ch": otherword.ch,
        })
    #end = time.time()
    return JsonResponse({
                "words": resultwords,
                "otherwords": resultotherwords
            })

def addtograsp(current):
    return current + 10 if current + 10 <= 100 else 100
def subtograsp(current):
    return current - 10 if current - 10 > 0 else 0
def learnwords(request):
    userid = request.POST.get('id')
    grades = json.loads(request.POST.get('grades'))
    wordsid = json.loads(request.POST.get('words'))
    user = User.objects.get(id=userid)
    book = user.activebook
    objectstoput = []
    for i in range(len(grades)):
        grasppercent = addtograsp(0) if grades[i] == True else subtograsp(0)
        objectstoput.append(StudyWord(user=user,
            word=Word.objects.get(id=wordsid[i]),
            grasppercent=grasppercent,
            grasped=False))
    StudyWord.objects.bulk_create(objectstoput)
    addmoney = 20 * len(grades)
    user.money += addmoney
    user.save()
    return JsonResponse({
        "error": 0,
        "addmoney": addmoney
    })

def reviewwords(request):
    userid = request.POST.get('id')
    grades = json.loads(request.POST.get('grades'))
    wordsid = json.loads(request.POST.get('words'))
    user = User.objects.get(id=userid)
    book = user.activebook
    objectstoput = []
    for i in range(len(grades)):
        currentstudyword = StudyWord.objects.get(user=user, word=Word.objects.get(id=wordsid[i]))
        currentstudyword.grasppercent = addtograsp(currentstudyword.grasppercent) if grades[i] == True else subtograsp(currentstudyword.grasppercent)
        if currentstudyword.grasppercent == 100:
            currentstudyword.grasped = True
        currentstudyword.save()
    addmoney = 15 * len(grades)
    user.money += addmoney
    user.save()
    return JsonResponse({
        "error": 0,
        "addmoney": addmoney
    })
    
def checkincollins(request):
    word = request.POST.get('word')
    wordindict = Dict.objects.filter(word=word)
    if wordindict.exists():
        wordindict = wordindict[0]
        return JsonResponse({
            "error": 0,
            "gotword": '1',
            "collinsen": wordindict.word.replace('\\n', '\n\t'),
            "collinsphonetic": wordindict.phonetic.replace('\\n', '\n\t'),
            "collinsdefinition": wordindict.definition.replace('\\n', '\n\t'),
            "collinstranslation": wordindict.translation.replace('\\n', '\n\t')
            })
    else:
        return JsonResponse({
            "error": 0,
            "gotword": '0'
            })

def setstudycount(request):
    id = request.POST.get('id')
    studycount = int(request.POST.get('count'))
    resultuser = User.objects.get(id=id)
    resultuser.studycount = studycount
    resultuser.save()
    return JsonResponse({
        "error": 0
    })

def setreviewcount(request):
    id = request.POST.get('id')
    reviewcount = int(request.POST.get('count'))
    resultuser = User.objects.get(id=id)
    resultuser.reviewcount = reviewcount
    resultuser.save()
    return JsonResponse({
        "error": 0
    })

def buybook(request):
    userid = request.POST.get("userid")
    bookid = request.POST.get("bookid")
    resultuser = User.objects.get(id=userid)
    resultbook = Book.objects.get(id=bookid)
    if UserBook.objects.filter(user=resultuser, book=resultbook).exists():
        return  JsonResponse({
            "error": -2,
            "errmsg": "您已拥有这本书！"
        })
    elif resultuser.money >= resultbook.money:
        resultuser.money -= resultbook.money
        resultuser.save()
        userbook = UserBook.objects.create(user=resultuser, book=resultbook)
        userbook.save()
        return JsonResponse({
            "error": 0
        })
    else:
        return  JsonResponse({
            "error": -1,
            "errmsg": "金钱不足！"
        })