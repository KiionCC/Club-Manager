// pages/memberList/index.js
wx.cloud.init()
const db = wx.cloud.database()
const _ = db.command
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   club:"",
   members:[{}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '成员列表'
    })
    console.log(app.globalData.currentClub.name)
    var that=this;
    
    db.collection('club_member').where({
      club_id: _.eq(app.globalData.currentClub._id)
    }).get({
      success(res){
        var objs=[]
        res.data.forEach(function (index){
          db.collection('student').where({
            number: _.eq(index.student_id)
          }).get({
            success(res){
              var obj=index
              obj['name']=res.data[0].name
              obj['avatarurl'] = res.data[0].avatarurl
              objs.push(obj)
              that.setData({
                club: app.globalData.currentClub.name,
                members: objs
              })
            }
          })
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