var app = getApp();
import * as Tools from '../../base.js'
Page({
  data: {
    booklist: [],
    userid: null,
    bookselectid: null,
    skinStyle:null, 
  },
  init: function () {
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/getbooks", qs.stringify({
      id: that.data.userid
    })).then(function (response) {
      let result = []
      for (let i = 0; i < response.data.books.length; ++i) {
        result.push({
          'id': response.data.books[i].id,
          'bookname': response.data.books[i].id == response.data.bookid ? '(正在读)' + response.data.books[i].name : response.data.books[i].name
        })
      }
      that.setData({
        skinStyle: app.globalData.skin,
        booklist: result,
        bookselectid: response.data.bookid
      })
    })
  },
  onLoad: function (options) {
    app.changeTabBar()
    this.data.userid = app.globalData.userid
    this.init()
  },
  clickselectitem: function (e) {
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/selectbook", qs.stringify({
      userid: that.data.userid,
      bookid: e.target.id
    })).then(function (response) {
      wx.showToast({
        title: '书籍选择成功！',
        icon: 'success',
        duration: 2000
      })
      wx.navigateBack({})
    })
  }
})