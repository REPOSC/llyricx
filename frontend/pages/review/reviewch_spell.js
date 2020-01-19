// pages/recite words/recite.js
import * as Tools from '../../base.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    input: "",
    userid: null,
    learningwords: null,
    learnedwordsid: [],
    presentword: null,
    grades: [],
    percent: 0,
    locked: false,
    skinStyle:"",
  },

  update: function () {
    this.unlock()
    this.setData({
      input: "",
      presentword: this.data.learningwords[this.data.num]
    })
  },
  
  lock: function(){
    this.setData({
      locked: true
    })
  },

  unlock: function(){
    this.setData({
      locked: false
    })
  },
  
  submit: function () {
    this.lock()
    let that = this
    if (that.data.input.trim().toLowerCase() == that.data.learningwords[that.data.num].en.trim().toLowerCase()) {
      this.data.grades.push(true)
      wx.showToast({
        title: '做对了！',
        duration: 500,
        icon: 'none',
        success: function () {
          setTimeout(function () {
            that.data.learnedwordsid.push(that.data.learningwords[that.data.num].id)
            that.setData({
              num: that.data.num + 1,
              percent: Math.round(((that.data.num + 1) / that.data.learningwords.length) * 100),
            })
            that.onShow()
          }, 500)
        }
      })
    }
    else {
      this.data.grades.push(false)
      wx.showToast({
        title: '做错了！',
        duration: 500,
        icon: 'none',
        success: function () {
          setTimeout(function () {
            that.data.learnedwordsid.push(that.data.learningwords[that.data.num].id)
            wx.navigateTo({
              url: '../word/word?word=' + JSON.stringify(that.data.learningwords[that.data.num]),
            })
            that.setData({
              num: that.data.num + 1,
              percent: Math.round(((that.data.num + 1) / that.data.learningwords.length) * 100),
            })
          }, 500)
        }
      })
    }
  },

  init: function () {
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/getreviewwords", qs.stringify({
      id: that.data.userid
    })).then(function (response) {
      that.setData({
        skinStyle:app.globalData.skin,
        learningwords: response.data.words,
      })
      that.show()
    })
  },

  onLoad: function (options) {
    this.data.userid = app.globalData.userid
    this.init()
  },

  show: function () {
    if (this.data.num >= this.data.learningwords.length) {
      let fly = Tools.get_fly()
      let qs = Tools.get_qs()
      let that = this
      fly.post(Tools.get_url() + "/reviewwords", qs.stringify({
        id: that.data.userid,
        words: JSON.stringify(that.data.learnedwordsid),
        grades: JSON.stringify(that.data.grades)
      })).then(function (response) {
        wx.showToast({
          title: '复习完成！您已经\r\n获得' + response.data.addmoney + '金币！',
          icon: 'none',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.navigateBack({})
            }, 2000)
          }
        })
      })
    }
    else {
      this.update();
    } 
  },

  onShow: function () {
    if (this.data.learningwords) {
      this.show()
    }
  },

  bindkeyinput: function (e) {
    this.setData({
      input: e.detail.value
    })
  }
})