// pages/enrollList/index.js
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: app.globalData.currentEvent.name + "已报名" //页面标题为社团名
    })

    db.collection('event_member').where({
      event_id: _.eq(app.globalData.currentEvent._id)
    }).get({
      success(res){
        console.log(res)
        var stu_id = []
        res.data.forEach(function(index){
          stu_id.push(index.student_id)
        })
        db.collection('student').where({
          number: _.in(stu_id)
        }).get({
          success(res){
            that.setData({
              member: res.data
            })
            
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})