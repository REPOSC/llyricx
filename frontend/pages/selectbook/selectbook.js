var app =getApp();
import * as Tools from '../../base.js'
Page({
  data: {
    booklist: [],
    userid: null,
    skinStyle:null,
  },
  init: function(){
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/getallbookinfo", qs.stringify({
      id: that.data.userid
    })).then(function (response) {
      let result = []
      let count = 0
      for (let i = 0; i < response.data.books.length; ++i){
        result.push({
          'id': response.data.books[i].id,
          'bookname': response.data.books[i].id == response.data.currentbookid ? '*' + response.data.books[i].name : response.data.books[i].name,
        })
      }
      console.log(response.data.books)
      if (response.data.books.length <= 0) {
        that.setData({
          skinStyle: app.globalData.skin,
          booklist: result
        })
      }
      else {
        for (let i = 0; i < response.data.books.length; ++i) {
          wx.downloadFile({
            url: Tools.get_url() + "/getbookimage?id=" + result[i].id,
            success: function (res) {
              if (res.statusCode === 200) {
                result[i].image = res.tempFilePath
                that.setData({
                  skinStyle: app.globalData.skin,
                  booklist: result
                })
              }
            }
          })
        }
      } 
    })
    console.log(this.data.booklist)
  },
  onLoad: function (options) {
    app.changeTabBar()
    this.data.userid = app.globalData.userid
    this.init()
  },
  clickselectitem: function(e) {
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