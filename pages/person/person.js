//获取应用实例
const app = getApp()
wx.cloud.init()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isRegistered: app.globalData.isRegistered,
    isAdmin: false,
    stuNum: app.globalData.stuNum,
    name: app.globalData.name
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this


    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    that.setData({
      isRegistered: app.globalData.isRegistered,
      stuNum: app.globalData.stuNum,
      name: app.globalData.name
    })

    wx.cloud.callFunction({
      name: 'isAdmin',
      complete: res => {
        if (res.result.length > 0) {
          that.setData({
            isAdmin: true
          })
        }
      }
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
    var that = this
    //获取注册状态
    wx.cloud.callFunction({
      name: 'isRegistered',
      complete: res => {
        console.log(res)
        app.globalData.isRegistered = res.result.length
        if (app.globalData.isRegistered) {
          app.globalData.stuNum = res.result[0].number //如果已注册，获取学号
          app.globalData.name = res.result[0].name
          that.setData({
            isRegistered: app.globalData.isRegistered,
            stuNum: app.globalData.stuNum,
            name: app.globalData.name
          })
        }
      }
    })

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

  /*修改信息*/
  myInfo: function() {
    var that = this
    wx.navigateTo({
      url: '../modifyInfo/index',
    })
  },

  /*学生认证*/
  wantRegister: function() {
    var that = this
    if (that.data.isRegistered) {
      wx.showToast({
        title: '您已认证',
        icon: 'success',
        duration: 1000
      });
    } else {
      wx.navigateTo({
        url: '../register/index',
      })
    }
  },

  /*创建社团*/
  createClub: function() {
    var that = this
    wx.navigateTo({
      url: '../createClub/index',
    })
  },

  /*我的申请*/
  myApplication: function() {
    var that = this
    wx.navigateTo({
      url: '../myApplication/index',
    })
  },

  /*管理员入口*/
  handle: function() {
    wx.navigateTo({
      url: '../handleCreate/index',
    })
  }
})