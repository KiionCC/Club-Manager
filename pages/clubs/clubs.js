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
    tabs: ["我的社团","所有社团"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    isEmpty: true,
    isMyEmpty: true,
    allClubs: [{}],
    myClubs: [{}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    /*初始化TAB导航栏信息*/
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    /*获取社团列表*/
    // wx.cloud.callFunction({
    //   name: 'getAllClub',
    //   complete: res => {
    //     if (res.result.data.length > 0){
    //       that.setData({
    //         allClubs: res.result.data,
    //         isEmpty: false
    //       });
    //       console.log('callFunction test result: ', that.data.allClubs);
    //     }
    //     else{
    //       that.setData({
    //         isEmpty: true
    //       });
    //     }
    //   }
    // })


    /*获取我的社团列表*/
    if (app.globalData.isRegistered) {
      wx.showLoading({
        title: '加载中',
      })
      db.collection('club_member').where({ student_id: _.eq(app.globalData.stuNum) }).get({
        success(res) {
          var club_id = []
          res.data.forEach(function (index) {
            club_id.push(index.club_id)
          })
          db.collection('club').where({ _id: _.in(club_id) }).get({
            success(res) {
              if (res.data.length > 0) {
                that.setData({
                  myClubs: res.data,
                  isMyEmpty: false,
                })
                console.log("我的社团列表获取完毕")
                wx.hideLoading();
              }
              else {
                that.setData({
                  isMyEmpty: true
                })
                wx.hideLoading()
              }
            }
          })
        }
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

    if(that.data.activeIndex == 1){
      //获取全部社团列表
      wx.showLoading({
        title: '加载中',
      })
      db.collection('club').get().then(res=>{
        if (res.data.length > 0) {
          that.setData({
            allClubs: res.data,
            isIn: res.data,
            isApplied: res.data,
            isEmpty: false
          });
          // /*获取是否已加入*/
          // for(var i = 0; i < that.data.isIn.length; i++){
          //   db.collection('club_member').where({
          //     club_id: _.eq(that.data.allClubs[i]._id),
          //     student_id: _.eq(app.globalData.stuNum)
          //   }).get({
          //     success(res){
          //       var up = "isIn[" + i + "]";//先用一个变量，把(isIn[i])用字符串拼接起来
          //       if(res.data.length > 0){ 
          //         that.setData({
          //           [up]: true
          //         })
          //       }
          //       else{
          //         that.setData({
          //           [up]: false
          //         })
          //       }
          //     },
          //     fail: console.error
          //   })
          // }
          // /*获取是否已申请*/
          // for (var i = 0; i < that.data.isApplied.length; i++) {
          //   db.collection('mem_application').where({
          //     club_id: _.eq(that.data.allClubs[i]._id),
          //     student_id: _.eq(app.globalData.stuNum)
          //   }).get({
          //     success(res) {
          //       var up = "isApplied[" + i + "]";//先用一个变量，把(isIn[i])用字符串拼接起来
          //       if (res.data.length > 0) {
          //         that.setData({
          //           [up]: true
          //         })
          //       }
          //       else {
          //         that.setData({
          //           [up]: false
          //         })
          //       }
          //     },
          //     fail: console.error
          //   })
          // }
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
    else{
      /*获取我的社团列表*/
      if (app.globalData.isRegistered) {
        wx.showLoading({
          title: '加载中',
        })
        db.collection('club_member').where({ student_id: _.eq(app.globalData.stuNum) }).get({
          success(res){
            var club_id = []
            res.data.forEach(function (index) {
              club_id.push(index.club_id)
            })
            db.collection('club').where({ _id: _.in(club_id) }).get({
              success(res){
                if (res.data.length > 0) {
                  that.setData({
                    myClubs: res.data,
                    isMyEmpty: false,
                  })
                  console.log("我的社团列表获取完毕")
                  wx.hideLoading();
                }
                else {
                that.setData({
                  isMyEmpty: true
                })
                wx.hideLoading()
                }
              }
            })
          }
        })
      }

      
    }
  },

  //跳转到社团主页
  jump: function(e){
    var that = this

    /*获取点击社团*/
    var id = e.currentTarget.dataset.index;
    id = parseInt(id);
    app.globalData.currentClub = that.data.myClubs[id];

    wx.navigateTo({
      url: '../innerClub/index',
    })
  },

  /*申请加入*/
  apply: function(e) {
    var that = this

    /*获取点击社团*/
    var id = e.currentTarget.dataset.index;
    id = parseInt(id);
    
          /*获取是否已加入*/
            db.collection('club_member').where({
              club_id: _.eq(that.data.allClubs[id]._id),
              student_id: _.eq(app.globalData.stuNum)
            }).get({
              success(res){
                if(res.data.length > 0){ 
                  wx.showModal({
                    content: '您已加入该社团，是否跳转到社团页面？',
                    showCancel: true,
                    cancelColor: '',
                    confirmText: '跳转',
                    confirmColor: 'green',
                    success: function (res) {
                      if (res.confirm) {
                        console.log(that.data.allClubs[id])
                        app.globalData.currentClub = that.data.allClubs[id]
                        wx.navigateTo({
                          url: '../innerClub/index',
                        })
                      }
                    },
                    fail: console.error
                  })
                }
                else{
                  /*获取是否已申请*/
                  
                    db.collection('mem_application').where({
                      club_id: _.eq(that.data.allClubs[id]._id),
                      student_id: _.eq(app.globalData.stuNum)
                    }).get({
                      success(res) {
                        if (res.data.length > 0) {
                          wx.showModal({
                            content: '您已申请加入该社团，是否跳转到我的申请页面？',
                            showCancel: true,
                            cancelColor: '',
                            confirmText: '跳转',
                            confirmColor: 'green',
                            success: function(res) {
                              if(res.confirm){
                                wx.navigateTo({
                                  url: '../myApplication/index',
                                })
                              }
                            },
                            fail: console.error
                          })
                        }
                        else {
                          /*提交申请*/
                          wx.showLoading({
                            title: '处理中',
                          })
                          db.collection('mem_application').add({
                            data: {
                              student_id: app.globalData.stuNum,
                              club_id: that.data.allClubs[id]._id
                            },
                            success(res){
                              console.log(res.result)
                              wx.hideLoading()
                              wx.showToast({
                                title: '申请成功',
                                icon: 'success',
                                duration: 1000
                              })
                            },
                            fail: console.error
                          })
                        }
                      },
                      fail: console.error
                    })
                  
                }
              },
              fail: console.error
            })
          
  }
})