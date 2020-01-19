const app = getApp();
import * as Tools from '../../base.js'
Page({
  data: {
    userid: null,
    ischecked: false,
  },

  init: function()
  {
    let that =this;
    if (app.globalData.skin == "dark") {
      that.setData({
        ischecked: true,
        skinStyle: app.globalData.skin
      })
    }
    else if (app.globalData.skin == null) {
      that.setData({
        ischecked: false,
        skinStyle: app.globalData.skin
      })
    }

  },
  onLoad: function (options) {
    this.data.userid = app.globalData.userid
    this.init();
  },
  go_learningset:function(e){
    wx.navigateTo({
      url: '../learningset/learningset',
    })
  },
  clearbuffer: function(){
    wx.getSavedFileList({
      success(res){
        let filelist = res.fileList
        for (let i = 0; i < filelist.length; ++i){
          wx.removeSavedFile({
            filePath: filelist[i].filePath,
          })
        }
      }
    })
    wx.clearStorage()
    wx.showToast({
      title: '清除缓存成功！',
      duration: 1000
    })
  },
  go_about: function (e) {
    wx.navigateTo({
      url: '../about/about',
    })
  },
  switchChange: function (e) {
   
    var that = this
    //设置全局变量
    if (e.detail.value == "")
    {
      app.globalData.skin = null
      that.setData({
        ischecked: false,
        skinStyle: app.globalData.skin
      })
    }
    else if  (e.detail.value == true)
    {
      app.globalData.skin = "dark"
      that.setData({
        ischecked: true,
        skinStyle: app.globalData.skin
      })
    }
    //保存到本地
    wx.setStorage({
      key: "skin",
      data: app.globalData.skin
    })
    
  }
})