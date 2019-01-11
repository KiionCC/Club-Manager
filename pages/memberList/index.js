// pages/memberList/index.js
wx.cloud.init()
const db = wx.cloud.database()
const _ = db.command
var app=getApp()
Page({

  /**
   * 页面的初始数据
   * 
   */
  data: {
   club:"",
   members:[],
   selected:[],
   rank:["社员","管理员","社长"],
   isSelecting: false,
   selectList:[],
    buttonText:"选择",
    btnHide:false
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
          
          //level为0的是普通成员，为1的是管理员。社长权限最大
          if (index.student_id == app.globalData.stuNum && index.level==2){
            that.setData({
              selectList: ['设为代表队', '取消代表队','转移社长','设为管理员', '取消管理员','删除成员']
            })
          }
          else if (index.student_id == app.globalData.stuNum && index.level==1){
            that.setData({
              selectList: ['设为代表队','取消代表队']
            })
          }
          else if(index.student_id == app.globalData.stuNum && index.level == 0){
            that.setData({
              btnHide: true
            })
          }
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
                members: objs,
              })
              wx.showLoading({
                title: '加载中',
                duration: 500
              })
              
            }
          })
        })
        
      }
    })
    
  },


  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var members = this.data.members, values = e.detail.value;
    for(var i=0;i<values.length;i++){
      values[i]=Number(values[i])
    }

    for (var i = 0, lenI = members.length; i < lenI; ++i) {
      members[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (members[i].student_id == values[j]) {
          members[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      members: members,
      selected:values
    });
    console.log(values)
  },

  select: function (e) {
    var that=this
    if (!this.data.isSelecting){
      this.setData({
        isSelecting: true,
        buttonText:"操作"
      });
    }
    else if (that.data.selected.length==0){
      this.setData({
        isSelecting: false,
        buttonText: "选择"
      })
    }
    else{
      wx.showActionSheet({
        itemList: this.data.selectList,
        success: function (res) {
          console.log(res)
          if (!res.cancel) {
            console.log(res.tapIndex)
            if (res.tapIndex==0){//设为代表队

              wx.cloud.callFunction({
                // 云函数名称
                name: 'manageMembers',
                // 传给云函数的参数
                data: {
                  type: 'setTeam',
                  members: that.data.selected,
                },
                success(res) {
                  console.log('成功：', that.data.selected)
                  db.collection('club_member').where({
                    club_id: _.eq(app.globalData.currentClub._id)
                  }).get({
                    success(res) {
                      var objs = []
                      res.data.forEach(function (index) {
                        db.collection('student').where({
                          number: _.eq(index.student_id)
                        }).get({
                          success(res) {
                            var obj = index
                            obj['name'] = res.data[0].name
                            obj['avatarurl'] = res.data[0].avatarurl
                            objs.push(obj)
                            that.setData({
                              club: app.globalData.currentClub.name,
                              members: objs,
                            })
                            wx.showLoading({
                              title: '刷新中',
                              duration: 500
                            })
                          }
                        })
                      })
                      wx.showToast({
                        title: '设置成功',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  })
                },
                fail: console.error
              })
              that.setData({
                isSelecting: false,
                buttonText: "选择",
                selected:[]
              })
              
            }
            else if (res.tapIndex == 1){//取消代表队
              
              wx.cloud.callFunction({
                // 云函数名称
                name: 'manageMembers',
                // 传给云函数的参数
                data: {
                  type: 'cancelTeam',
                  members: that.data.selected,
                },
                success(res) {
                  console.log('成功：', that.data.selected)
                  db.collection('club_member').where({
                    club_id: _.eq(app.globalData.currentClub._id)
                  }).get({
                    success(res) {
                      var objs = []
                      res.data.forEach(function (index) {
                        db.collection('student').where({
                          number: _.eq(index.student_id)
                        }).get({
                          success(res) {
                            var obj = index
                            obj['name'] = res.data[0].name
                            obj['avatarurl'] = res.data[0].avatarurl
                            objs.push(obj)
                            that.setData({
                              club: app.globalData.currentClub.name,
                              members: objs,
                            })
                            wx.showLoading({
                              title: '刷新中',
                              duration: 500
                            })
                          }
                        })
                      })
                      
                      wx.showToast({
                        title: '设置成功',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  })
                },
                fail: console.error
              })
              that.setData({
                isSelecting: false,
                buttonText: "选择",
                selected: []
              })
            }
            else if (res.tapIndex == 2) {//转移社长
              if (that.data.selected.length > 1){
                wx.showModal({
                  content: '你只能把社长转移给一个人哦~',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                      that.setData({
                        isSelecting: false,
                        buttonText: "选择"
                      })
                    }
                  }
                });
              }
              else{
                wx.showModal({
                  title: '确定移交社长权限吗',
                  content: '长江后浪推前浪啊',
                  confirmText: "确定",
                  cancelText: "取消",
                  success: function (res) {
                    console.log(res);
                    if (res.confirm) {
                      console.log('用户点击主操作')
                      wx.cloud.callFunction({
                        // 云函数名称
                        name: 'transferPersident',
                        // 传给云函数的参数
                        data: {
                          old: app.globalData.stuNum + app.globalData.currentClub._id,
                          new: that.data.selected[0] + app.globalData.currentClub._id,
                        },
                        success(res) {
                          console.log('成功：', that.data.selected)
                          db.collection('club_member').where({
                            club_id: _.eq(app.globalData.currentClub._id)
                          }).get({
                            success(res) {
                              var objs = []
                              res.data.forEach(function (index) {
                                db.collection('student').where({
                                  number: _.eq(index.student_id)
                                }).get({
                                  success(res) {
                                    var obj = index
                                    obj['name'] = res.data[0].name
                                    obj['avatarurl'] = res.data[0].avatarurl
                                    objs.push(obj)
                                    that.setData({
                                      club: app.globalData.currentClub.name,
                                      members: objs,
                                    })
                                    wx.showLoading({
                                      title: '刷新中',
                                      duration: 500
                                    })
                                  }
                                })
                              })

                              wx.showToast({
                                title: '设置成功',
                                icon: 'success',
                                duration: 1000
                              })
                            }
                          })
                        },
                        fail: console.error
                      })
                      that.setData({
                        isSelecting: false,
                        buttonText: "选择",
                        selected: []
                      })
                    } else {
                      console.log('用户点击辅助操作')
                      that.setData({
                        isSelecting: false,
                        buttonText: "选择"
                      })
                      that.checkboxChange
                    }
                  }
                });
              }

              
              

            }
            else if (res.tapIndex == 3) {//设为管理员
              
              wx.cloud.callFunction({
                // 云函数名称
                name: 'manageMembers',
                // 传给云函数的参数
                data: {
                  type: 'setManager',
                  members: that.data.selected,
                },
                success(res) {
                  console.log('成功：', that.data.selected)
                  db.collection('club_member').where({
                    club_id: _.eq(app.globalData.currentClub._id)
                  }).get({
                    success(res) {
                      var objs = []
                      res.data.forEach(function (index) {
                        db.collection('student').where({
                          number: _.eq(index.student_id)
                        }).get({
                          success(res) {
                            var obj = index
                            obj['name'] = res.data[0].name
                            obj['avatarurl'] = res.data[0].avatarurl
                            objs.push(obj)
                            that.setData({
                              club: app.globalData.currentClub.name,
                              members: objs,
                            })
                            wx.showLoading({
                              title: '刷新中',
                              duration: 500
                            })
                          }
                        })
                      })
                      
                      wx.showToast({
                        title: '设置成功',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  })
                },
                fail: console.error
              })
              that.setData({
                isSelecting: false,
                buttonText: "选择",
                selected: []
              })
            }
            else if (res.tapIndex == 4) {//取消管理员
              
              wx.cloud.callFunction({
                // 云函数名称
                name: 'cancelManager',
                // 传给云函数的参数
                data: {
                  type: 'setTeam',
                  members: that.data.selected,
                },
                success(res) {
                  console.log('成功：', that.data.selected)
                  db.collection('club_member').where({
                    club_id: _.eq(app.globalData.currentClub._id)
                  }).get({
                    success(res) {
                      var objs = []
                      res.data.forEach(function (index) {
                        db.collection('student').where({
                          number: _.eq(index.student_id)
                        }).get({
                          success(res) {
                            var obj = index
                            obj['name'] = res.data[0].name
                            obj['avatarurl'] = res.data[0].avatarurl
                            objs.push(obj)
                            that.setData({
                              club: app.globalData.currentClub.name,
                              members: objs,
                            })
                            wx.showLoading({
                              title: '刷新中',
                              duration: 500
                            })
                          }
                        })
                      })
                      
                      wx.showToast({
                        title: '设置成功',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  })
                },
                fail: console.error
              })
              that.setData({
                isSelecting: false,
                buttonText: "选择",
                selected: []
              })
            }
            else if (res.tapIndex == 5) {//删除成员

              wx.showModal({
                title: '确定删除成员吗',
                content: '注意删除操作不可逆！',
                confirmText: "确定",
                cancelText: "取消",
                success: function (res) {
                  console.log(res);
                  if (res.confirm) {
                    console.log('用户点击主操作')
                    wx.cloud.callFunction({
                      // 云函数名称
                      name: 'removeMember',
                      // 传给云函数的参数
                      data: {
                        type: 'setTeam',
                        members: that.data.selected,
                      },
                      success(res) {
                        console.log('成功：', that.data.selected)
                        db.collection('club_member').where({
                          club_id: _.eq(app.globalData.currentClub._id)
                        }).get({
                          success(res) {
                            var objs = []
                            res.data.forEach(function (index) {
                              db.collection('student').where({
                                number: _.eq(index.student_id)
                              }).get({
                                success(res) {
                                  var obj = index
                                  obj['name'] = res.data[0].name
                                  obj['avatarurl'] = res.data[0].avatarurl
                                  objs.push(obj)
                                  that.setData({
                                    club: app.globalData.currentClub.name,
                                    members: objs,
                                  })
                                  wx.showLoading({
                                    title: '刷新中',
                                    duration: 500
                                  })
                                }
                              })
                            })

                            wx.showToast({
                              title: '设置成功',
                              icon: 'success',
                              duration: 1000
                            })
                          }
                        })
                      },
                      fail: console.error
                    })
                    that.setData({
                      isSelecting: false,
                      buttonText: "选择",
                      selected: []
                    })
                  } else {
                    console.log('用户点击辅助操作')
                    that.setData({
                      isSelecting: false,
                      buttonText: "选择"
                    })
                  }
                }
              });
              

            }
          }
          },
        fail: function (res) {
          console.log(res)
          that.setData({
            isSelecting: false,
            buttonText: "选择"
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

  }
})