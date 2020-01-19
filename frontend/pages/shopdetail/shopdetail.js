// pages/detail/detail.js
var app = getApp();
import * as Tools from '../../base.js'
Page({
  data: {
    userid:null,
    bookid:null,
    bookname:null,
    bookintroduction:null,
    bookmoney:null,
    srcbookimage: '../../figures/book_default.png',
    skinStyle:null,
    buyvisible: true,
  },
  onLoad: function (options) {
    this.setData({
      userid: app.globalData.userid,
      bookid: options.bookid,
      buyvisible: options.buyvisible == 'true' ? true : false
    });
    this.init();
  },
  init: function () {
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/getbookinfo", qs.stringify({
      bookid: that.data.bookid
    })).then(function (response) {
      that.setData({
        skinStyle:app.globalData.skin,
        bookname: response.data.bookname != 'null' ? response.data.name : null,
        bookintroduction: response.data.bookname != 'null' ? response.data.introduction : null,
        bookmoney: response.data.bookname != 'null' ? response.data.money : null,
      })
      wx.downloadFile({
        url: Tools.get_url() + "/getbookimage?id=" + that.data.bookid,
        success: function (imageres) {
          if (imageres.statusCode === 200) {
            that.setData({
              srcbookimage: imageres.tempFilePath
            })
          }
        }
      })
    })
  },
  buybook: function(){
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/buybook", qs.stringify({
      userid: that.data.userid,
      bookid: that.data.bookid
    })).then(function (response) {
      if (response.data.error == 0){
        wx.showToast({
          title: '购买成功！',
          duration: 2000
        })
        that.setData({
          buyvisible: false
        })
      }
      else {
        wx.showToast({
          image:"../../figures/false.png",
          title: response.data.errmsg,
          duration: 2000
        })
      }
    })
  }
})