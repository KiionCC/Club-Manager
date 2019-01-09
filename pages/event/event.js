//获取App实例
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,

    events: [],
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    if (!app.globalData.userInfo) {
      wx.showLoading({
        title: '登录中',
      });
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.hideLoading();
        }
      })
    }
    //获取注册状态
    wx.cloud.callFunction({
      name: 'isRegistered',
      complete: res => {
        console.log(res)
        app.globalData.isRegistered = res.result.length
        if (app.globalData.isRegistered) {
          app.globalData.stuNum = res.result[0].number //如果已注册，获取学号
          app.globalData.name = res.result[0].name
        }
      }
    })

    //获取公开活动列表
    db.collection('event').where({
      isPublic: _.eq(true)
    }).orderBy('_id', 'desc').get({
      success(res) {
        if (res.data.length > 0) {
          that.setData({
            isEmpty: false,
            events: res.data
          })
          for (var i = 0; i < that.data.events.length; i++) {
            var beginTime = 'events[' + i + '].beginTime'
            that.setData({
              [beginTime]: that.data.events[i].beginTime.toLocaleDateString().replace(/\//g, "-") + " " + that.data.events[i].beginTime.toTimeString().substr(0, 8)
            })
          }
        }
        console.log("活动列表获取完成")
      },
      fail: console.error
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /*查看活动详情*/
  eventDetail: function(e) {
    var that = this

    /*获取点击活动*/
    var id = e.currentTarget.dataset.index;
    id = parseInt(id);
    app.globalData.currentEvent = that.data.events[id];

    wx.navigateTo({
      url: '../eventDetail/index',
    })
  }
})