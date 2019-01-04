wx.cloud.init()
const db = wx.cloud.database()
const _ = db.command
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    applications: [],
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    wx.setNavigationBarTitle({
      title: '处理创建申请'//页面标题为社团名
    })

    /*获取创建列表*/
    wx.showLoading({
      title: '加载中',
    })
    db.collection('club_application').orderBy('_id', 'desc').get().then(res => {
      if (res.data.length > 0) {
        that.setData({
          applications: res.data,
          isEmpty: false
        });
        wx.hideLoading();
        console.log("获取社团列表成功");
      }
      else {
        that.setData({
          isEmpty: true
        });
        wx.hideLoading();
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
    
  },

  /*通过申请*/
  pass: function(e){
    var that = this

    var id = e.currentTarget.dataset.index;
    id = parseInt(id);
    console.log(that.data.applications[id])

    wx.cloud.callFunction({
      name: 'confirmClubAppli',
      data: {
        application_id: that.data.applications[id]._id,
        state: 'pass'
      },
      success(res){
        console.log(res.result)
        /*获取创建列表*/
        that.setData({
          isEmpty: true,
          applications: []
        })
        wx.showLoading({
          title: '加载中',
        })
        db.collection('club_application').orderBy('_id', 'desc').get().then(res => {
          if (res.data.length > 0) {
            that.setData({
              applications: res.data,
              isEmpty: false
            });
            wx.hideLoading();
            console.log("获取社团列表成功");
          }
          else {
            that.setData({
              isEmpty: true
            });
            wx.hideLoading();
          }
        })
      },
      fail: console.error
    })

    
  },

  /*退回申请*/
  cancel: function (e) {
    var that = this

    var id = e.currentTarget.dataset.index;
    id = parseInt(id);
    console.log(that.data.applications[id])

    wx.cloud.callFunction({
      name: 'confirmClubAppli',
      data: {
        application_id: that.data.applications[id]._id,
        state: 'cancel'
      },
      complete: res => {
        console.log(res.result)
        /*获取创建列表*/
        that.setData({
          isEmpty: true,
          applications: []
        })
        wx.showLoading({
          title: '加载中',
        })
        db.collection('club_application').orderBy('_id', 'desc').get().then(res => {
          if (res.data.length > 0) {
            that.setData({
              applications: res.data,
              isEmpty: false
            });
            wx.hideLoading();
            console.log("获取社团列表成功");
          }
          else {
            that.setData({
              isEmpty: true
            });
            wx.hideLoading();
          }
        })
      }
    })

    
  }
})