const app = getApp();
Page({
  data: {
    tabbar: {},
    disabled: true,
    userid: null,
  },
  onLoad: function (options) {
    //调用app中的函数
    app.changeTabBar();
  },
  go_homepage: function () {
    wx.redirectTo({
      url: '../homepage/homepage'
    })
  },
  go_self: function () {
    wx.redirectTo({
      url: '../self/self'
    })
  },
})