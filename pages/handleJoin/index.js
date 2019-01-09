// pages/handleJoin/index.js
var app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    applications: [],
    applicants: [],
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '处理申请'//页面标题为社团名
    })

    /*获取申请列表*/
    wx.showLoading({
      title: '加载中',
    })
    db.collection('mem_application').where({
      club_id: _.eq(app.globalData.currentClub._id),
    }).orderBy('_id', 'desc').get({
      success(res){
        console.log(res.data)
        if (res.data.length > 0) {
          that.setData({
            applications: res.data,
            isEmpty: false
          })
          /*获取申请人信息*/
          var stu_id = []
          res.data.forEach(function(index){
            stu_id.push(index.student_id)
          })
          db.collection('student').where({
            number: _.in(stu_id)
          }).get({
            success(res){
              console.log(res.data)
              that.setData({
                applicants: res.data
              })
            },
            fail: console.error
          })
          wx.hideLoading();
          console.log("获取社团列表成功");
        }
        else {
          that.setData({
            isEmpty: true
          });
          wx.hideLoading();
        }
      },
      fail: console.error
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

  /*同意申请*/
  pass: function(e) {
    var that = this

    var id = e.currentTarget.dataset.index;
    id = parseInt(id);
    console.log(that.data.applicants[id])

    wx.cloud.callFunction({
      name: 'processStuApplication',
      data: {
        club_id: app.globalData.currentClub._id,
        student_id: that.data.applicants[id].number,
        method: 'pass'
      },
      success(res){
        console.log(res.result)
        that.setData({
          isEmpty: true
        })
        /*获取申请列表*/
        wx.showLoading({
          title: '加载中',
        })
        db.collection('mem_application').where({
          club_id: _.eq(app.globalData.currentClub._id),
        }).orderBy('_id', 'desc').get({
          success(res) {
            console.log(res.data)
            if (res.data.length > 0) {
              that.setData({
                applications: res.data,
                isEmpty: false
              })
              /*获取申请人信息*/
              var stu_id = []
              res.data.forEach(function (index) {
                stu_id.push(index.student_id)
              })
              db.collection('student').where({
                number: _.in(stu_id)
              }).get({
                success(res) {
                  console.log(res.data)
                  that.setData({
                    applicants: res.data
                  })
                },
                fail: console.error
              })
              wx.hideLoading();
              console.log("获取社团列表成功");
            }
            else {
              that.setData({
                isEmpty: true
              });
              wx.hideLoading();
            }
          },
          fail: console.error
        })
      },
      fail: console.error
    })
  },

  /*拒绝申请*/
  reject: function (e) {
    var that = this

    var id = e.currentTarget.dataset.index;
    id = parseInt(id);
    console.log(that.data.applicants[id])

    wx.cloud.callFunction({
      name: 'processStuApplication',
      data: {
        club_id: app.globalData.currentClub._id,
        student_id: that.data.applicants[id].number,
        method: 'reject'
      },
      success(res) {
        console.log(res.data)
        that.setData({
          isEmpty: true
        })
        /*获取申请列表*/
        wx.showLoading({
          title: '加载中',
        })
        db.collection('mem_application').where({
          club_id: _.eq(app.globalData.currentClub._id),
        }).orderBy('_id', 'desc').get({
          success(res) {
            console.log(res.data)
            if (res.data.length > 0) {
              that.setData({
                applications: res.data,
                isEmpty: false
              })
              /*获取申请人信息*/
              var stu_id = []
              res.data.forEach(function (index) {
                stu_id.push(index.student_id)
              })
              db.collection('student').where({
                number: _.in(stu_id)
              }).get({
                success(res) {
                  console.log(res.data)
                  that.setData({
                    applicants: res.data
                  })
                },
                fail: console.error
              })
              wx.hideLoading();
              console.log("获取社团列表成功");
            }
            else {
              that.setData({
                isEmpty: true
              });
              wx.hideLoading();
            }
          },
          fail: console.error
        })
      },
      fail: console.error
    })
  }
})