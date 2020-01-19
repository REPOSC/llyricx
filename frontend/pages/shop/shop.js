//index.js
//获取应用实例
var app = getApp();
import * as Tools from '../../base.js'

Page({
  data: {
    checkword: "",
    toRe:0,
    bookList: [],
    userid:null,
    imgUrls: [
      "../../figures/banner1.jpg",
      "../../figures/banner2.jpg",
    ],
    skinStyle:null,
    state: "other"
  },
  wordInput: function (e) {
    this.setData({ checkword: e.detail.value });
  },
  init: function(){
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    if (that.data.state == "my"){
      fly.post(Tools.get_url() + "/getboughtbooks", qs.stringify({
        id: that.data.userid,
        filter: that.data.checkword
      })).then(function (response) {
        let result = []
        for (let i = 0; i < response.data.books.length; ++i) {
          result.push({
            id: response.data.books[i].id,
            bookname: response.data.books[i].name,
            money: response.data.books[i].money,
            introduction: response.data.books[i].introduction,
          })
        }
        if (response.data.books.length <= 0) {
          that.setData({
            skinStyle: app.globalData.skin,
            bookList: result
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
                    bookList: result
                  })
                }
              }
            })
          }
        } 
      })
    }
    else {
      fly.post(Tools.get_url() + "/getunboughtbooks", qs.stringify({
        id: that.data.userid,
        filter: that.data.checkword
      })).then(function (response) {
        let result = []
        for (let i = 0; i < response.data.books.length; ++i) {
          result.push({
            id: response.data.books[i].id,
            bookname: response.data.books[i].name,
            money: response.data.books[i].money,
            introduction: response.data.books[i].introduction,
          })
        }
        if (response.data.books.length <= 0){
          that.setData({
            skinStyle: app.globalData.skin,
            bookList: result
          })
        }
        else{
          for (let i = 0; i < response.data.books.length; ++i) {
            wx.downloadFile({
              url: Tools.get_url() + "/getbookimage?id=" + result[i].id,
              success: function (res) {
                if (res.statusCode === 200) {
                  result[i].image = res.tempFilePath
                  that.setData({
                    skinStyle: app.globalData.skin,
                    bookList: result
                  })
                }
              }
            })
          }
        }        
      })
    }
  },
  
  onLoad: function (options) {
    var that = this;
    this.data.userid = app.globalData.userid
  },

  toRefresh: function(){
    this.setData({
      state: this.data.state == "my" ? "other" : "my"
    })
    this.init()
  },

  onShow: function () {
    // 页面显示
    this.data.checkword = ""
    this.init();
  },
})
