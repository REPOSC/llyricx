//index.js
//获取应用实例
const app = getApp()
import * as Tools from '../../base.js'

Page({
  data: {
    WelcomeText: "欢迎使用",
    ProductNameText: "MOCA背单词小程序",
    LoginText: '立即开始',
    userInfo: {},
    userid: null,
    hasUserInfo: false,
    skinStyle:null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  go: function(){
    let that = this;
    wx.redirectTo({
      url: '../homepage/homepage?userid=' + that.data.userid
    })
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        skinStyle:app.globalData.skin,
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo.id
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  ButtonClick: function (e) {
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let appid = Tools.get_appid()
    let appsecret = Tools.get_appsecret()
    let that = this
    wx.login(
      {
        success(res){
          if (res.code){
            fly.post(Tools.get_url() + '/login', qs.stringify({
              code: res.code,
              appid: appid,
              appsecret:appsecret
            })).then(
              function (response) {
                that.setData({
                  userid: response.data.id,
                })
                app.globalData.userid = response.data.id
                that.go();
              }
            )
          }
          else {
            wx.showToast({
              title: '登录失败',
              icon: 'none',
              duration: 2000
            })
          }
        }
      }
    ) 
  }
})

