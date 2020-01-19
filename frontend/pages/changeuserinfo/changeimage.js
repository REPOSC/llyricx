// pages/changeuserinfo/changenickname.js
var app = getApp();
import * as Tools from '../../base.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userid: null,
    imagesrc: null,
    skinStyle:null,
  },
  onLoad: function (options) {
    this.setData({
      userid : app.globalData.userid,
      skinStyle : app.globalData.skin,
    })
    
    console.log(app.globalData.skin)
  },
  uploadsrc: function(){
    let that = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], 
      success: function(response) {
        that.setData({
          imagesrc: response.tempFilePaths[0]
        })
      }
    })
  },
  confirm: function () {
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    if (that.data.imagesrc != null){
      wx.uploadFile({
        url: Tools.get_url() + '/modifyimage', // 仅为示例，非真实的接口地址
        filePath: that.data.imagesrc,
        name: 'file',   
        formData: {
          id: that.data.userid
        },
        success(res) {
          wx.showToast({
            title: '上传头像成功！',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack({})
        }
      })
    }
    else {
      wx.showToast({
        title: '还没有选择图片',
        duration: 2000
      })
    }
  },
  cancel: function () {
    wx.navigateBack({})
  }
})