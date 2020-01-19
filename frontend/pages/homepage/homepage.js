var app = getApp(); 
import * as Tools from '../../base.js'
Page({
  data: {
    selectorchangebook: null,
    studiedwordcount: 0,
    wordcount: 0,
    usingbook: null,
    usingbookid: null,
    userid: null,
    tabbar: {},
    startdisabled: false,
    checkword: null,
    checkwords: [],
    skinStyle: null,
    studymode: 0, 
    
    STUDYMODE_CONSTS: {
      ENG_CHS: 0,
      AUDIO_CHS: 1,
      CHS_ENG: 2,
      CHS_SELECT: 3,
      CHS_SPELL: 4
    }
  },
  init: function(){
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/getuserbookinfo", qs.stringify({
      id: that.data.userid
    })).then(function (response) {
      that.setData({
        skinStyle : app.globalData.skin,
        selectorchangebook: response.data.bookname == 'null' ? '选择书籍' : '更改书籍',
        usingbookid: response.data.bookid != 'null' ? response.data.bookid : null,
        studiedwordcount: response.data.studiedwordcount != 'null' ? response.data.studiedwordcount : null,
        wordcount: response.data.allwordcount != 'null' ? response.data.allwordcount : null,
        usingbook: (response.data.bookname != 'null') ?  response.data.bookname : '您没有学习任何书籍',
        studymode: response.data.mode
      })
      if (that.data.wordcount <= that.data.studiedwordcount){
        that.data.startdisabled = true
      }
      if (response.data.bookid != 'null'){
        wx.downloadFile({
          url: Tools.get_url() + "/getbookimage?id=" + response.data.bookid,
          success: function (imageres) {
            if (imageres.statusCode === 200) {
              that.setData({
                srcbookimage:imageres.tempFilePath
              })
            }
          }
        })
      }      
    })
  },
  onLoad: function (options) {
    //调用app中的函数
    app.changeTabBar();
  },
  onShow: function (){
    this.data.userid = app.globalData.userid
    this.init();
   
  },
  selectbook: function() {
    wx.navigateTo({
      url: '../selectbook/selectbook'
    })
  },
  go_words: function () {
    if (this.data.checkwords.length > 0){
      wx.navigateTo({
        url: '../words/words?checkwordslist=' + JSON.stringify(this.data.checkwords),
      })
    }
    else {
      wx.navigateTo({
        url: '../words/words'
      })
    }    
  },
  go_self: function () {
    wx.redirectTo({
      url: '../self/self',
    })
  },
  go_study: function () {
    let that = this
    switch (that.data.studymode) {
      case that.data.STUDYMODE_CONSTS.ENG_CHS:
        wx.navigateTo({
          url: '../study/study',
        })
        break;
      case that.data.STUDYMODE_CONSTS.AUDIO_CHS:
        wx.navigateTo({
          url: '../study/studyaudio_ch',
        })
        break;
      case that.data.STUDYMODE_CONSTS.CHS_ENG:
        wx.navigateTo({
          url: '../study/studych_en',
        })
        break;
      case that.data.STUDYMODE_CONSTS.CHS_SELECT:
        wx.navigateTo({
          url: '../study/studych_select',
        })
        break;
      case that.data.STUDYMODE_CONSTS.CHS_SPELL:
        wx.navigateTo({
          url: '../study/studych_spell',
        })
        break;
    }
  },
  go_review: function(){
    let that = this
    switch (that.data.studymode) {
      case that.data.STUDYMODE_CONSTS.ENG_CHS:
        wx.navigateTo({
          url: '../review/review',
        })
        break;
      case that.data.STUDYMODE_CONSTS.AUDIO_CHS:
        wx.navigateTo({
          url: '../review/reviewaudio_ch',
        })
        break;
      case that.data.STUDYMODE_CONSTS.CHS_ENG:
        wx.navigateTo({
          url: '../review/reviewch_en',
        })
        break;
      case that.data.STUDYMODE_CONSTS.CHS_SELECT:
        wx.navigateTo({
          url: '../review/reviewch_select',
        })
        break;
      case that.data.STUDYMODE_CONSTS.CHS_SPELL:
        wx.navigateTo({
          url: '../review/reviewch_spell',
        })
        break;
    }
  },
  wordInput: function (e) {
    this.setData({ checkword: e.detail.value });
  },
  searchWord: function () {
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/searchword", qs.stringify({
      checkword: that.data.checkword      
    })).then(function (response) {
      that.setData({
        checkwords: response.data.checkwords,
      })
      that.go_words()
    })
  },
  share: function(){
    wx.navigateTo({
      url: '../learning rate/learning rate',
    })
  }
})

