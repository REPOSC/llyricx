//app.js
App({
  globalData: {
    userInfo: null,
    userid: null,
    skin:null,
  },
  onLaunch: function(){
    Array.prototype.random_select = function (selectcount) {
      let result = []
      let rawdata = this.slice()
      for (let i = 0; i < selectcount; ++i) {
        let randomindex = Math.floor(Math.random() * rawdata.length)
        result.push(rawdata[randomindex])
        if (rawdata.length > selectcount - result.length) {
          rawdata.splice(randomindex, 1)
        }
      }
      return result
    } 
  },
  tabbar: {
    color: "#242424",
    selectedColor: "#f10b2e",
    backgroundColor: "#ffffff",
    borderStyle: "#d7d7d7",
    list: [
      {
        pagePath: "/pages/homepage/homepage",
        text: "首页",
        iconPath: "../../figures/cube.png",
        selectedIconPath: "../../figures/cube.png",
        selected: true
      },
      {
        pagePath: "/pages/settings/settings",
        text: "设置",
        iconPath: "../../figures/cube.png",
        selectedIconPath: "../../figures/cube.png",
        selected: false
      },
      
    ],
    position: "bottom"
  },
  getSkin: function () {
    var that = this
    wx.getStorage({
      key: 'skin',
      success: function (res) {
        that.globalData.skin = res.data
      }
    })
  },
  initcolor: function () {
    let that = this;
    that.setData({
      skinStyle: app.globalData.skin
    })
  },
  changeTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    //获取当前页面信息
    var _pagePath = _curPage.__route__;  //获取当前页面路径
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.tabbar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].selected = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].selected = true;//根据页面地址设置当前页面状态  
      }
    }
    _curPage.setData({
      tabbar: tabBar
    });
  },   
})