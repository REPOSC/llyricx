var app = getApp();
import * as Tools from '../../base.js'
// page/learningset/learningset.js
Page({
  data: {
    skinStyle:null,
    studycount: null,
    reviewcount: null,
    countarray: ['10', '20', '30', '40', '50'],
    userid: null,
    studymode: null,

    STUDYMODE_CONSTS: {
      ENG_CHS: 0,
      AUDIO_CHS: 1,
      CHS_ENG: 2,
      CHS_SELECT: 3,
      CHS_SPELL: 4
    },

    modesarray: ['看英文选中文', '听音选中文', '看中文选英文', '看中文选块拼写', '看中文输入拼写']
  },

  studycountchange(e) {
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/setstudycount", qs.stringify({
      id: that.data.userid,
      count: that.data.countarray[e.detail.value]
    })).then(function (response) {
      that.setData({
        studycount: that.data.countarray[e.detail.value],
      })
    }) 
  },

  reviewcountchange(e) {
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/setreviewcount", qs.stringify({
      id: that.data.userid,
      count: that.data.countarray[e.detail.value]
    })).then(function (response) {
      that.setData({
        reviewcount: that.data.countarray[e.detail.value],
      })
    })    
  },

  modecountchange(e) {
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/setstudymode", qs.stringify({
      id: that.data.userid,
      mode: e.detail.value,
    })).then(function (response) {
      that.setData({
        studymode: that.data.modesarray[e.detail.value]
      })
    }) 
  },


  init: function(){
    this.data.skinStyle = app.globalData.skin;
    this.data.userid = app.globalData.userid
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    that.setData({
      skinStyle: app.globalData.skin
    })
    fly.post(Tools.get_url() + "/getuserinfo", qs.stringify({
      id: that.data.userid
    })).then(function (response) {
      that.setData({
        studycount: response.data.studycount,
        reviewcount: response.data.reviewcount,
        studymode: that.data.modesarray[response.data.mode]
      })
    })
  },


  onShow: function(){
    this.init();
  },
})