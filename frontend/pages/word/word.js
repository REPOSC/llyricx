var app = getApp();
import * as Tools from '../../base.js'
Page({
  data: {
    userid: null,
    word: null,
    encolor: '#aa0000',
    addimage: null,
    added: false,
    urlforaudio: "http://dict.youdao.com/dictvoice?audio=",
    inneraudiocontext: null,
    openorclosecollins: '展开',
    collinsopened: false,
    hascollins: false,
    collins: null,
    skinStyle:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.userid = app.globalData.userid
    if (options.word) {
      this.setData({
        word: JSON.parse(options.word),
        encolor: this.randomcolor()
      });
    }
  },
  setadded: function(){
    this.setData({
      added: true,
      addimage: '../../figures/voca_book_del.png'
    })
  },
  setdeleted: function(){
    this.setData({
      added: false,
      addimage: '../../figures/voca_book.png'
    })
  },
  init: function(){
    //初始化音频组件
    this.setData({
      skinStyle:app.globalData.skin,
    })
    this.data.inneraudiocontext = wx.createInnerAudioContext()
    //初始化单词
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/checkinnotebook", qs.stringify({
      userid: that.data.userid,
      wordid: that.data.word.id
    })).then(function (response) {
      if (response.data.innotebook == '1'){
        that.setadded()
      }
      else {
        that.setdeleted()
      }
    })
    //初始化柯林斯词典    
    fly.post(Tools.get_url() + "/checkincollins", qs.stringify({
      word: that.data.word.en
    })).then(function (response) {
      if (response.data.gotword == '1') {
        that.setData({
          hascollins: true,
          collins: {
            en: response.data.collinsen,
            phonetic: response.data.collinsphonetic,
            definition: response.data.collinsdefinition,
            translation: response.data.collinstranslation
          }
        })
      }
      else {
        that.setData({
          hascollins: false,
          collins: null
        })
      }
    })
  },
  onShow: function(){
    this.init();
  },
  randomcolor: function(){
    let r = Math.floor(Math.random() * 20 + 80); 
    let g = Math.floor(Math.random() * 50); 
    let b = Math.floor(Math.random() * 20 + 80);
    return '#' + r + g + b
  },
  goback: function () {
    wx.navigateBack({})
  },
  playword: function(){
    let that = this
    wx.getStorage({
      key: that.data.word.en,
      success(res){
        that.data.inneraudiocontext.src = res.data
        that.data.inneraudiocontext.play()
      },
      fail(res){
        wx.downloadFile({
          url:that.data.urlforaudio + that.data.word.en,
          success(res){
            if (res.statusCode == 200){
              wx.saveFile({
                tempFilePath: res.tempFilePath,
                success: function(savedres){
                  that.data.inneraudiocontext.src = savedres.savedFilePath
                  that.data.inneraudiocontext.play()
                  wx.setStorage({
                    key: that.data.word.en,
                    data: savedres.savedFilePath,
                  })
                }
              })
            }
          }
        })
      }
    })
  },
  opencollins: function(){
    if (this.data.collinsopened == false){
      this.setData({
        collinsopened: true,
        openorclosecollins: '关闭'
      })
    }
    else {
      this.setData({
        collinsopened: false,
        openorclosecollins: '展开'
      })
    }
  },
  addtovocabook: function(){
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    if (that.data.added == false){
      fly.post(Tools.get_url() + "/addinnotebook", qs.stringify({
        userid: that.data.userid,
        wordid: that.data.word.id
      })).then(function (response) {
        that.setadded()
        wx.showToast({
          title: '添加成功！',
          icon: 'success',
          duration: 2000
        })
      })
    }
    else {
      fly.post(Tools.get_url() + "/deleteinnotebook", qs.stringify({
        userid: that.data.userid,
        wordid: that.data.word.id
      })).then(function (response) {
        that.setdeleted()
        wx.showToast({
          title: '删除成功！',
          icon: 'success',
          duration: 2000
        })
      })
    }
  }
})