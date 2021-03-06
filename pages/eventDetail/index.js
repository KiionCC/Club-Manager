// pages/eventDetail/index.js
var app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventData: {},
    eventState: 0, //活动状态：0为报名未截止活动未结束，1为报名截止活动未结束，2为报名截止活动结束

    myEnrollData: {},
    isManager: false,
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.setNavigationBarTitle({
      title: app.globalData.currentEvent.name //页面标题为社团名
    })

    //初始化活动数据
    that.setData({
      eventData: app.globalData.currentEvent
    })

    //比对社团信息
    if (app.globalData.currentEvent.club_id == app.globalData.currentClub._id) {
      that.setData({
        show: true
      })
    }

    if (that.data.eventData.signEndTime) {
      that.setData({
        'eventData.signEndTime': that.data.eventData.signEndTime.toLocaleDateString().replace(/\//g, "-") + " " + that.data.eventData.signEndTime.toTimeString().substr(0, 8)
      })
    }

    var _signEndTime = new Date(that.data.eventData.signEndTime)
    var _beginTime = new Date(that.data.eventData.beginTime)
    var timestamp = Date.parse(_beginTime)
    timestamp = timestamp - 30 * 60 * 1000
    var beginSignTime = new Date(timestamp)
    //到了签到时间前半小时但是管理员还没点击结算按钮（活动未结束），打开签到按钮，eventState设为1
    if (beginSignTime < new Date() && !that.data.eventData.isOver) { //刷新问题
      that.setData({
        eventState: 1
      })
    }

    //过了签到时间和活动开始时间，关闭签到按钮，活动发起者打开结算按钮，eventState设为2
    if (_beginTime < new Date()) {
      that.setData({
        eventState: 2
      })
    }

    //获取社团头像
    db.collection('club').doc(that.data.eventData.club_id).get({
      success(res) {
        that.setData({
          'eventData.icon_id': res.data.icon_id
        })
      }
    })

    //获取是否是管理员身份
    db.collection('club_member').where({
      club_id: that.data.eventData.club_id,
      student_id: app.globalData.stuNum,
    }).get({
      success(res) {
        if (res.data[0].level == 1 || res.data[0].level == 2)
          that.setData({
            isManager: true
          })
      }
    })

    //获取我的报名信息
    that.getMyEnroll()

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

  //活动报名
  enroll: function() {
    var that = this

    wx.showLoading({
      title: '提交中',
    })
    wx.cloud.callFunction({
      name: "enrollEvent",
      data: {
        club_id: app.globalData.currentClub._id,
        event_id: that.data.eventData._id,
        student_id: app.globalData.stuNum,
      },
      success(res) {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '报名成功',
          icon: 'success',
          duration: 1000
        })
        that.getMyEnroll()
      }
    })
  },

  //活动签到
  sign: function() {
    var that = this
    wx.showLoading({
      title: '签到中',
    })
    wx.cloud.callFunction({
      name: "signEvent",
      data: {
        club_id: app.globalData.currentClub._id,
        event_id: that.data.eventData._id,
        student_id: app.globalData.stuNum,
      },
      success(res) {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '签到成功',
          icon: 'success',
          duration: 1000
        })
        that.getMyEnroll()
      }
    })
  },

  //获取报名信息
  getMyEnroll: function() {
    var that = this

    db.collection('event_member').where({
      club_id: _.eq(that.data.eventData.club_id),
      student_id: _.eq(app.globalData.stuNum),
      event_id: _.eq(that.data.eventData._id)
    }).get({
      success(res) {
        console.log(res.data)
        that.setData({
          myEnrollData: res.data
        })
      }
    })
  },

  //活动结算
  finish: function() {
    var that = this
    wx.showLoading({
      title: '活动结算中',
    })
    wx.cloud.callFunction({
      name: "finishEvent",
      data: {
        event_id: that.data.eventData._id,
        level: that.data.eventData.level,
      },
      success(res) {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '活动结算成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          'eventData.isOver': true
        })
      },
      fail: console.error
    })
  }
})