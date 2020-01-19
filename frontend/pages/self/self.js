var app =getApp();
import * as Tools from '../../base.js'
Page({
  data: {
    tabbar: {},
    disabled: true,
    userid: null,
    nickname: null,
    gender: null,
    introduction: null,
    addorchangeintroduction: null,
    moneycount: null,
    skinStyle:null,
  },
  init: function(){
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/getuserinfo", qs.stringify({
      id: that.data.userid
    })).then(function (response) {
      if (response.data.hasintroduction == '1'){
        that.setData({
          introduction: response.data.introduction,
          addorchangeintroduction: '修改'
        })
      }
      else {
        that.setData({
          introduction: '还没有简介',
          addorchangeintroduction: '添加'
        })
      }
      that.setData({
        skinStyle:app.globalData.skin,
        nickname: response.data.nickname.length > 15 ? response.data.nickname.substring(0, 12) + '...' : response.data.nickname,
        gender: response.data.gender,
        moneycount: response.data.money
      })
      if (response.data.hasimage == '1') {
        wx.downloadFile({
          url: Tools.get_url() + "/getuserimage?id=" + that.data.userid,
          success: function (res) {
            if (res.statusCode === 200) {
              that.setData({
                srcuserimage: res.tempFilePath
              })
            }
          }
        })
      }
      else {
        if (that.data.gender == '男'){
          that.setData({
            srcuserimage: '../../figures/default_user_image_male.png'
          })
        }
        else if (that.data.gender == '女'){
          that.setData({
            srcuserimage: '../../figures/default_user_image_female.png'
          })
        }
        else {
          that.setData({
            srcuserimage: '../../figures/default_user_image_person.png'
          })
        }
      }
    })
  },
  onLoad: function (options) {
    //调用app中的函数
    app.changeTabBar()
    this.data.userid = app.globalData.userid
  },
  onShow: function(){
    this.init()
  },
  changenickname: function() {
    wx.navigateTo({
      url: '../changeuserinfo/changenickname',
    })
  },
  changegender: function () {
    let that = this
    wx.navigateTo({
      url: '../changeuserinfo/changegender?gender=' + that.data.gender,
    })
  },
  changeimage: function () {
    wx.navigateTo({
      url: '../changeuserinfo/changeimage',
    })
  },
  changeintroduction: function () {
    wx.navigateTo({
      url: '../changeuserinfo/changeintroduction',
    })
  },
  go_fight: function () {
    wx.redirectTo({
      url: '../fight/fight',
    })
  },
  go_homepage: function () {
    wx.redirectTo({
      url: '../homepage/homepage'
    })
  },

  viewmynotebook:function()
  {
    wx.navigateTo({
      url: '../mynotebook/mynotebook',
    })
  }
})