// pages/recite words/recite.js
import * as Tools from '../../base.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    correctnum: 0,
    choicecount: 4,
    userid: null,
    learningwords: null,
    learnedwordsid: [],
    otherwords: null,
    presentword: null,
    chineselist: [],
    grades: [],
    fontsize: "20rpx",
    linesize: "25rpx",
    inneraudiocontext: null,
    urlforaudio: "http://dict.youdao.com/dictvoice?audio=",
    percent: 0,
    locked: false,
    skinStyle: "",
  },

  fillotherwords: function () {
    let learningwords = this.data.learningwords
    let otherwords = this.data.otherwords.slice()
    this.data.otherwords = []
    for (let i = 0; i < learningwords.length; ++i) {
      let tempwords = learningwords.slice(0, i)
      tempwords = tempwords.concat(learningwords.slice(i + 1, learningwords.length))
      tempwords = tempwords.concat(otherwords)
      this.data.otherwords = this.data.otherwords.concat(tempwords.random_select(this.data.choicecount))
    }
  },

  max: function (list) {
    let result = 0;
    for (let i = 0; i < list.length; ++i) {
      if (list[i].length > result) {
        result = list[i].length
      }
    }
    return result
  },
  update: function () {
    this.unlock()
    this.data.correctnum = Math.floor(Math.random() * this.data.choicecount)
    let presentword = this.data.learningwords[this.data.num]
    let chineselist = []
    for (let i = 0; i < this.data.choicecount; ++i) {
      if (i == this.data.correctnum) {
        chineselist.push(presentword.ch)
      }
      else {
        chineselist.push(this.data.otherwords[i + this.data.num * this.data.choicecount].ch)
      }
    }
    this.setData({
      presentword: presentword,
      chineselist: chineselist,
      linesize: Math.sqrt(70 * 700 / this.max(chineselist)) + "rpx",
      fontsize: Math.sqrt(70 * 700 / this.max(chineselist)) * 0.8 + "rpx"
    })
    this.playword()
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
  
  select: function (e) {
    this.lock()
    let that = this
    if (e.target.id == this.data.correctnum) {
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
    //初始化音频组件
    this.data.inneraudiocontext = wx.createInnerAudioContext()
    fly.post(Tools.get_url() + "/getreviewwords", qs.stringify({
      id: that.data.userid
    })).then(function (response) {
      that.setData({
        skinStyle:app.globalData.skin,
        learningwords: response.data.words,
        otherwords: response.data.otherwords,
      })
      that.fillotherwords()
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

  playword: function () {
    let that = this
    wx.getStorage({
      key: that.data.presentword.en,
      success(res) {
        that.data.inneraudiocontext.src = res.data
        that.data.inneraudiocontext.play()
      },
      fail(res) {
        wx.downloadFile({
          url: that.data.urlforaudio + that.data.presentword.en,
          success(res) {
            if (res.statusCode == 200) {
              wx.saveFile({
                tempFilePath: res.tempFilePath,
                success: function (savedres) {
                  that.data.inneraudiocontext.src = savedres.savedFilePath
                  that.data.inneraudiocontext.play()
                  wx.setStorage({
                    key: that.data.presentword.en,
                    data: savedres.savedFilePath,
                  })
                }
              })
            }
          }
        })
      }
    })
  },

  onShow: function () {
    if (this.data.learningwords) {
      this.show()
    }
  },
})