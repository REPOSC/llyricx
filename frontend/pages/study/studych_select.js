// pages/recite words/recite.js
import * as Tools from '../../base.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    percent:0,
    num: 0,
    input: "",
    userid: null,
    learningwords: null,
    learnedwordsid: [],
    presentword: null,
    grades: [],
    partlist: [],
    correctlist: [],
    partselectedlist: ['　'],
    selectedlist: [],
    selected: [],
    innerconvtable: 'aeiouy',
    locked: false,
    skinStyle:"",
  },

  update: function () {
    this.unlock()
    let that = this
    this.setData({
      input: "",
      presentword: that.data.learningwords[that.data.num],
      partselectedlist: ['　'],
      selectedlist: [],
    })
    let results = this.split(that.data.presentword.en, 2, 5)
    this.setData({
      partlist: results.partlist,
      correctlist: results.correctlist,
      selected: results.selected
    })
  },
  lock: function(){
    this.setData({
      locked: true
    })
  },

  unlock: function(){
    this.setData({
      locked: false
    })
  },


  split: function (presentword, minL, maxL){
    //划分成小块
    let patches = []
    for (let i = 0;;){
      let j = Math.floor(Math.random() * (maxL - minL)) + minL;
      if (i + j + 1 < presentword.length){
        patches.push(presentword.slice(i, i + j + 1))
        i += j + 1
      }
      else {
        patches.push(presentword.slice(i, i + j + 1))
        break
      }
    }
    //打乱顺序，记录正确顺序
    let correctlist = []
    for (let i = 0; i < patches.length; ++i){
      correctlist.push(i)
    }
    correctlist = correctlist.random_select(correctlist.length)
    //按照正确顺序变化
    let partlist = patches.slice()
    for (let i = 0; i < patches.length; ++i){
      partlist[correctlist[i]] = patches[i]
    }
    //选出n/2个需要变形的单词片
    //只变形aeiou这些
    let canconvert = []
    for (let i = 0; i < partlist.length; ++i){
      let isinner = false
      for (let j = 0; j < partlist[i].length; ++j){
        if (this.data.innerconvtable.includes(partlist[i][j])){
          isinner = true
          break
        }
      }
      if (isinner){
        canconvert.push(i)
      }
    }
    canconvert = canconvert.random_select(Math.round(canconvert.length / 2))
    //开始变形
    let temppartlist = partlist.slice()
    //每次变形添加一个对象，并广播
    let convindex = []
    for (let i = 0; i < canconvert.length + partlist.length; ++i){
      convindex.push(i)
    }
    convindex = convindex.random_select(canconvert.length).sort()
    for (let i = 0; i < convindex.length; ++i){
      partlist.splice(convindex[i], 0, this.change(temppartlist[canconvert[i]]))
    }
    for (let i = 0; i < convindex.length; ++i){
      for (let j = 0; j < correctlist.length; ++j){
        if (correctlist[j] >= convindex[i]){
          ++correctlist[j]
        }
      }
    }
    let selected = []
    for (let i = 0; i < partlist.length; ++i){
      selected.push(false)
    }
    return {
      partlist: partlist,
      correctlist: correctlist,
      selected: selected
    }
  },
  change: function (x) {
    let pos = []
    for (let i = 0; i < x.length; ++i){
      if (this.data.innerconvtable.indexOf(x[i]) != -1){
        pos.push(i)
      }
    }
    let dopos = pos[Math.floor(pos.length * Math.random())]
    let thenconvtable = this.data.innerconvtable.replace(x[dopos], "")
    let result = x.substr(0, dopos)
    result += thenconvtable[Math.floor(Math.random() * thenconvtable.length)]
    result += x.substr(dopos + 1)
    return result
  },

  lock: function(){
    this.setData({
      locked: true
    })
  },

  unlock: function(){
    this.setData({
      locked: false
    })
  },

  submit: function () {
    this.lock()
    let that = this
    let correct = true
    if (that.data.selectedlist.length != that.data.correctlist.length){
      correct = false
    }
    else {
      for (let i = 0; i < that.data.selectedlist.length; ++i){
        if (that.data.selectedlist[i] != that.data.correctlist[i]){
          correct = false
        }
      }
    }
    if (correct) {
      this.data.grades.push(true)
      wx.showToast({
        title: '做对了！',
        duration: 500,
        icon: 'none',
        success: function () {
          setTimeout(function () {
            that.data.learnedwordsid.push(that.data.learningwords[that.data.num].id)
            wx.navigateTo({
              url: '../word/word?word=' + JSON.stringify(that.data.learningwords[that.data.num]),
            })
            that.setData({
              num: that.data.num + 1,
              percent: Math.round(((that.data.num + 1) / that.data.learningwords.length) * 100),
            })
          }, 500)
        }
      })
    }
    else {
      this.data.grades.push(false)
      wx.showToast({
        title: '做错了！',
        duration: 500,
        icon: 'none',
        success: function () {
          setTimeout(function () {
            that.data.learnedwordsid.push(that.data.learningwords[that.data.num].id)
            wx.navigateTo({
              url: '../word/word?word=' + JSON.stringify(that.data.learningwords[that.data.num]),
            })
            that.setData({
              num: that.data.num + 1,
              percent: Math.round(((that.data.num + 1) / that.data.learningwords.length) * 100),
            })
          }, 500)
        }
      })
    }
  },

  init: function () {
    let fly = Tools.get_fly()
    let qs = Tools.get_qs()
    let that = this
    fly.post(Tools.get_url() + "/getlearningwords", qs.stringify({
      id: that.data.userid
    })).then(function (response) {
      that.setData({
        learningwords: response.data.words
      })
      that.show()
    })
  },

  onLoad: function (options) {
    this.data.userid = app.globalData.userid
    this.init()
  },

  show: function () {
    if (this.data.num >= this.data.learningwords.length) {
      let fly = Tools.get_fly()
      let qs = Tools.get_qs()
      let that = this
      fly.post(Tools.get_url() + "/learnwords", qs.stringify({
        id: that.data.userid,
        words: JSON.stringify(that.data.learnedwordsid),
        grades: JSON.stringify(that.data.grades)
      })).then(function (response) {
        wx.showToast({
          title: '背诵完成！您已经\r\n获得' + response.data.addmoney + '金币！',
          icon: 'none',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.navigateBack({})
            }, 2000)
          }
        })
      })
    }
    else {
      this.update();
    }
  },

  select: function (e) {
    this.data.selectedlist.push(parseInt(e.target.id))
    this.data.partselectedlist.push(this.data.partlist[this.data.selectedlist[this.data.selectedlist.length - 1]])
    this.data.selected[parseInt(e.target.id)] = true
    this.setData({
      partselectedlist: this.data.partselectedlist,
      selected: this.data.selected
    })
  },

  remove: function(){
    if (this.data.selectedlist.length > 0){
      this.data.selected[this.data.selectedlist.pop()] = false
      this.data.partselectedlist.pop()
      this.setData({
        partselectedlist: this.data.partselectedlist,
        selected: this.data.selected
      })
    }
  },

  onShow: function () {
    if (this.data.learningwords) {
      this.show()
    }
  },

  bindkeyinput: function (e) {
    this.setData({
      input: e.detail.value
    })
  }
})