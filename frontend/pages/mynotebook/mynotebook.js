// pages/mynotebook/mynotebook.js
var app = getApp();
import * as Tools from '../../base.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordlist:null,
    userid:null,
    skinStyle:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  init: function(){
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/getnotebooklist", qs.stringify({
      id: that.data.userid
    })).then(function (response) {
      let result = []
      for (let i = 0; i < response.data.words.length; ++i) {
        result.push({
          'id': response.data.words[i].id,
          'en': response.data.words[i].en,
          'ch': response.data.words[i].ch
        })
      }
      that.setData({
        skinStyle:app.globalData.skin,
        wordlist: result
      })
    })
  },
  onLoad: function (options) {
    this.data.userid = app.globalData.userid
  },
  onShow: function(){
    this.init()
  },
  clickselectitem: function(e){
    let index = e.target.id
    let that = this
    wx.navigateTo({
      url: '../word/word?word=' + JSON.stringify(that.data.wordlist[index]),
    })
  }
})