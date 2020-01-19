// pages/about/about.js
const app = getApp();
import * as Tools from '../../base.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skinStyle:null,

  },

  init: function()
  {
    let that = this;
    that.setData({
      skinStyle: app.globalData.skin
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init();
    console.log(app.globalData.skin);
  },



  
})