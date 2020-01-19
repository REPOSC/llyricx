//index.js
//获取应用实例
var app = getApp();
import * as Tools from '../../base.js'

Page({
  data: {
    skinStyle: null,
  },
  init: function () {
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
      that.setData({
        skinStyle: app.globalData.skin,
      })
  },
  onLoad: function (options) {
    var that = this;
    this.data.userid = app.globalData.userid

  },

  onShow: function () {
    // 页面显示
    this.init();
    console.log(this.data.bookList)
  },

 
})
