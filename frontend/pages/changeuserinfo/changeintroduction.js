// pages/changeuserinfo/changeintroduction.js
var app = getApp();
import * as Tools from '../../base.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userid: null,
    introduction: null,
    skinStyle:null,
  },
  onLoad: function (options) {
    this.setData({
      userid: app.globalData.userid,
      skinStyle: app.globalData.skin,
    })
  },
  wordInput: function (e) {
    this.setData({ introduction: e.detail.value });
  },
  confirm: function () {
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/modifyintroduction", qs.stringify({
      id: that.data.userid,
      introduction: that.data.introduction
    })).then(function (response) {
      wx.showToast({
        title: '修改个人简介成功！',
        icon: 'success',
        duration: 2000
      })
      wx.navigateBack({})
    })   
  },
  cancel: function () {
    wx.navigateBack({})
  }
})