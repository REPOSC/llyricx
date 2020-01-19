var app = getApp();
import * as Tools from '../../base.js'
Page({
  data: {
    checkwordslist: null,
    skinStyle:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  init:function(){
    this.setData({
      skinStyle: app.globalData.skin,
    })
  },
  onLoad: function (options) {
    if (options.checkwordslist){
      this.setData({
        checkwordslist: JSON.parse(options.checkwordslist)
      });
    }
  },
  gotoword: function(e){
    let index = e.target.id
    let that = this
    wx.navigateTo({
      url: '../word/word?word=' + JSON.stringify(that.data.checkwordslist[index]),
    })
  },
  goback: function () {
    wx.navigateBack({})
  }
})