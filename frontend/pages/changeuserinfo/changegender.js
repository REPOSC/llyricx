var app = getApp();
import * as Tools from '../../base.js'
Page({
  data: {
    skinStyle:null,
    genderlist: [
    {
      'id': '男',
      'name':'男生'
    },
    {
      'id': '女',
      'name': '女生'
    } , 
    {
      'id': '保密',
      'name': '保密'
    }
    ],
    userid: null,
  },
  onLoad: function (options) {
    this.data.userid = app.globalData.userid
    let genderlist = this.data.genderlist
    for (let i = 0; i < this.data.genderlist.length; ++i){
      if (options.gender == this.data.genderlist[i].id){
        genderlist[i].name = '*' + genderlist[i].name
      }
    }
    this.setData({genderlist,
        skinStyle : app.globalData.skin,
    })
  },
  clickselectitem: function (e) {
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/selectgender", qs.stringify({
      id: that.data.userid,
      gender: e.target.id
    })).then(function (response) {
      wx.showToast({
        title: '选择性别成功！',
        icon: 'success',
        duration: 2000
      })
      wx.navigateBack({})
    })
  }
})