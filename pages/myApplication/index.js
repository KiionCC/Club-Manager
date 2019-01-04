var sliderWidth = 90
wx.cloud.init()
const db = wx.cloud.database()
const _ = db.command
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["加入社团", "创建社团"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    isEmpty: true,
    isMyEmpty: true,

    appliId: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.setNavigationBarTitle({
      title: '我的申请'//页面标题为社团名
    })

    /*初始化TAB导航栏信息*/
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    /*获取加入社团的申请列表*/
    if (app.globalData.isRegistered) {
      wx.showLoading({
        title: '加载中',
      })
      db.collection('mem_application').where({ student_id: _.eq(app.globalData.stuNum) }).orderBy('_id','desc').get({
        success(res) {
          console.log(res.data)
          if(res.data.length > 0){
          var clubs = []
          that.setData({ appliId: []})
          res.data.forEach(function(index){
            clubs.push(index.club_id)
            that.data.appliId.push(index._id)
          })
          that.data.appliId.reverse()
          db.collection('club').where({ _id: _.in(clubs) }).get({
            success(res) {
              if (res.data.length > 0) {
                that.setData({
                  myClubs: res.data,
                  isMyEmpty: false,

                })
                console.log("我的申请列表获取完毕")
                wx.hideLoading();
              }
              else {
                that.setData({
                  isMyEmpty: true
                })
                wx.hideLoading()
              }
            },
            fail: console.error
          })
          wx.hideLoading()
          }
          else {
            wx.hideLoading()
          }
        },
        fail: console.error
      })
    }
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

  tabClick: function (e) {
    var that = this;
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      isEmpty: true,
      isMyEmpty: true,
    });

    if (that.data.activeIndex == 1) {
      //获取创建社团的申请列表
      wx.showLoading({
        title: '加载中',
      })
      db.collection('club_application').where({
        student_id: _.eq(app.globalData.stuNum)
        }).orderBy('_id', 'desc').get().then(res => {
        if (res.data.length > 0) {
          that.setData({
            allClubs: res.data,
            isEmpty: false
          });
          wx.hideLoading();
          console.log("获取社团申请创建列表成功");
        }
        else {
          that.setData({
            isEmpty: true
          });
          wx.hideLoading();
        }
      })
    }
    else {
      /*获取加入社团的申请列表*/
      if (app.globalData.isRegistered) {
        wx.showLoading({
          title: '加载中',
        })
        db.collection('mem_application').where({ student_id: _.eq(app.globalData.stuNum) }).orderBy('_id', 'desc').get({
          success(res) {
            console.log(res.data)
            if (res.data.length > 0) {
              var clubs = []
              that.setData({ appliId: [] })
              res.data.forEach(function (index) {
                clubs.push(index.club_id)
                that.data.appliId.push(index._id)
              })
              that.data.appliId.reverse()
              db.collection('club').where({ _id: _.in(clubs) }).get({
                success(res) {
                  if (res.data.length > 0) {
                    that.setData({
                      myClubs: res.data,
                      isMyEmpty: false,
                    })
                    console.log("我的申请列表获取完毕")
                    wx.hideLoading();
                  }
                  else {
                    that.setData({
                      isMyEmpty: true
                    })
                    wx.hideLoading()
                  }
                },
                fail: console.error
              })
              wx.hideLoading()
            }
            else{
              wx.hideLoading()
            }
          },
          fail: console.error
        })
      }
    }
  },

  /*撤销创建申请*/
  cancel: function(e){
    var that = this

    var id = e.currentTarget.dataset.index;
    id = parseInt(id);
    console.log(that.data.allClubs[id])
    wx.showModal({
      content: '确认要撤销' + that.data.allClubs[id].name + '的创建申请吗',
      showCancel: true,
      confirmColor: 'red',
      confirmText: '撤销',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          db.collection('club_application').doc(that.data.allClubs[id]._id).remove({
            success(res) {
              console.log(res.data)
              wx.cloud.deleteFile({
                fileList: [that.data.allClubs[id].icon_id],
                success: res => {
                  // handle success
                  console.log(res.fileList)
                  //获取创建社团的申请列表
                  wx.showLoading({
                    title: '加载中',
                  })
                  db.collection('club_application').where({
                    student_id: _.eq(app.globalData.stuNum)
                  }).orderBy('_id', 'desc').get().then(res => {
                    if (res.data.length > 0) {
                      that.setData({
                        allClubs: res.data,
                        isEmpty: false
                      });
                      wx.hideLoading();
                      console.log("获取社团申请创建列表成功");
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
            fail: console.error
          })
        }
      }
    });
  },

  /*撤销加入申请*/
  cancelJoin: function(e) {
    var that = this

    var id = e.currentTarget.dataset.index;
    id = parseInt(id);
    console.log(that.data.myClubs[id])

    wx.showModal({
      content: '确认要撤销' + that.data.myClubs[id].name + '的加入申请吗',
      showCancel: true,
      confirmColor: 'red',
      confirmText: '撤销',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          db.collection('mem_application').where({
              student_id: _.eq(app.globalData.stuNum),
              club_id: _.eq(that.data.myClubs[id]._id)
            }).get({
              success(res) {
                console.log(res.data)
                db.collection('mem_application').doc(res.data[0]._id).remove({
                  success(res){
                    console.log(res)
                    /*获取加入社团的申请列表*/
                    if (app.globalData.isRegistered) {
                      that.setData({ isMyEmpty: true})
                      wx.showLoading({
                        title: '加载中',
                      })
                      db.collection('mem_application').where({ student_id: _.eq(app.globalData.stuNum) }).orderBy('_id', 'desc').get({
                        success(res) {
                          console.log(res.data)
                          if (res.data.length > 0) {
                            var clubs = []
                            that.setData({ appliId: [] })
                            res.data.forEach(function (index) {
                              clubs.push(index.club_id)
                              that.data.appliId.push(index._id)
                            })
                            that.data.appliId.reverse()
                            db.collection('club').where({ _id: _.in(clubs) }).get({
                              success(res) {
                                if (res.data.length > 0) {
                                  that.setData({
                                    myClubs: res.data,
                                    isMyEmpty: false,
                                  })
                                  console.log("我的申请列表获取完毕")
                                  wx.hideLoading();
                                }
                                else {
                                  that.setData({
                                    isMyEmpty: true
                                  })
                                  wx.hideLoading()
                                }
                              },
                              fail: console.error
                            })
                            wx.hideLoading()
                          }
                          else {
                            wx.hideLoading()
                          }
                        },
                        fail: console.error
                      })
                    }
                  },
                  fail: console.error
                })
              },
              fail: console.error
          })
        }
      }
    });
  }
})