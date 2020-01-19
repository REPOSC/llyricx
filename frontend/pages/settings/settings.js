const app = getApp();
import * as Tools from '../../base.js'
Page({
  data: {
    tabbar: {},
    disabled: true,
    userid: null,
    nickname: null,
    moneycount: null,
    skinStyle:null,
    gender: null,
  },
  onShareAppMessage(res) {
    return {
      title: '快来背单词吧！',
      imageUrl: '../../figures/product.png'
    }
  },
  init: function () {
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/getuserinfo", qs.stringify({
      id: that.data.userid
    })).then(function (response) {
      that.setData({
        skinStyle:app.globalData.skin,
        nickname: response.data.nickname.length > 15 ? response.data.nickname.substring(0, 12) + '...' : response.data.nickname,
        moneycount: response.data.money,
        userid: app.globalData.userid,
        gender: response.data.gender
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
        if (that.data.gender == '男') {
          that.setData({
            srcuserimage: '../../figures/default_user_image_male.png'
          })
        }
        else if (that.data.gender == '女') {
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
    this.data.userid = app.globalData.userid;
    //调用app中的函数
    app.changeTabBar();
  },
  onShow: function () {
    this.init();
  },
  go_self: function () {
    wx.navigateTo({
      url: '../self/self',
    })
  },
  go_mynotebook: function () {
    wx.navigateTo({
      url: '../mynotebook/mynotebook',
    })
  },
  go_learning_rate: function () {
    wx.navigateTo({
      url: '../learning rate/learning rate',
    })
  },
  go_books: function () {
    wx.navigateTo({
      url: '../books/books',
    })
  },
  go_selfset: function () {
    wx.navigateTo({
      url: '../selfset/selfset',
    })
  },
  go_shop: function () {
    wx.navigateTo({
      url: '../shop/shop',
    })
  }

})