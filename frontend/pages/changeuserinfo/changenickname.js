// pages/changeuserinfo/changenickname.js
var app = getApp();
import * as Tools from '../../base.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userid: null,
    nickname: null,
    skinStyle:null,
  },
  onLoad: function(options){
    this.setData({
      userid: app.globalData.userid,
      skinStyle: app.globalData.skin,
    })
  },
  wordInput: function(e){
    this.setData({ nickname: e.detail.value });
  },
  confirm: function(){
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/modifynickname", qs.stringify({
      id: that.data.userid,
      nickname: that.data.nickname
    })).then(function (response) {
      wx.showToast({
        title: '修改昵称成功！',
        icon: 'success',
        duration: 2000
      })
      wx.navigateBack({})
    })   
  },
  cancel: function(){
    wx.navigateBack({})
  }
})