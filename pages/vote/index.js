// pages/vote/index.js
var app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    voteData: {},
    creator: {},
    options: [],
    maxOption: 0,
    isVoted: false,
    checkboxMax: 2,

    showVoteTips: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.setNavigationBarTitle({
      title: app.globalData.currentVote.name //页面标题为社团名
    })

    /*获取投票信息*/
    that.setData({
      voteData: app.globalData.currentVote
    })

    /*获取创建人信息*/
    db.collection('student').where({
      number: _.eq(that.data.voteData.student_id)
    }).get({
      success(res) {
        that.setData({
          creator: res.data[0]
        })
      },
      fail: console.error
    })

    /*获取选项信息*/
    db.collection('selections').where({
      vote_id: _.eq(that.data.voteData._id)
    }).get({
      success(res) {
        that.setData({
          options: res.data
        })
        /*判断是否已经投过票了 */
        for (let i = 0; i < that.data.options.length; i++) {   //对vote中的每个选项查找
          db.collection('mem_selection').where({
            selection_id: that.data.options[i]._id,
            student_id: app.globalData.stuNum,
          }).get({
            success(res1) {
              db.collection('selections').doc(that.data.options[i]._id).get({
                success(res2) {
                  console.log(res2.data)
                  if (res2.data.vote_id == that.data.voteData._id) {
                    that.setData({
                      isVoted: true
                    })
                  }
                }
              })
            }
          })
        }
        /*获取选项最大值与百分比*/
        var temp = that.data.options[0].num
        for (var index in that.data.options) {
          if (index.num > temp) {
            temp = index.num
          }
        }
        that.setData({
          maxOption: temp
        })
        for (var i = 0; i < that.data.options.length; i++) {
          var percent = 'options[' + i + '].percent'
          var value = 'options[' + i + '].value'
          that.setData({
            [percent]: that.data.options[i].num / that.data.maxOption * 100,
            [value]: i
          })
        }
      }
    })


    /*判断投票是否过期 */
    db.collection('vote').doc(that.data.voteData._id).get({
      success(res) {
        console.log(res)
        if (res.data.state == true) {
          if (res.data.deadline < new Date()) {
            wx.cloud.callFunction({
              name: 'closeVote',
              data: {
                vote_id: that.data.voteData._id,
              },
            })
          }
        }
      }
    })
  },

  /*单选change*/
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.options;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = i == e.detail.value;
    }

    this.setData({
      options: radioItems
    });
  },

  /*多选*/
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);



    let checkboxItems = this.data.options;
    let checkboxMax = this.data.checkboxMax;

    let values = e.detail.value;

    if (checkboxMax < values.length) {
      values = values.splice(0, checkboxMax);


      console.log(values)

      for (let j = 0; j < checkboxItems.length; j++) {
        checkboxItems[j].checked = false;

        for (let i = 0; i < values.length; i++) {
          if (checkboxItems[j].value == values[i]) {
            checkboxItems[j].checked = true;
          }
        }
      }

      console.log(checkboxItems)

    } else {
      for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
        checkboxItems[i].checked = false;

        for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (checkboxItems[i].value == values[j]) {

            checkboxItems[i].checked = true;
            break;
          }
        }
      }
    }

    this.setData({
      options: checkboxItems
    });

  },

  /*点击提交*/
  showTopTips: function() {
    var that = this
    var isSelection = false
    for (var index in that.data.options) {
      if (that.data.options[index].checked != undefined && that.data.options[index].checked) {
        isSelection = true
        break
      }
    }
    if (!isSelection) {
      this.setData({
        showVoteTips: true
      });
      setTimeout(function() {
        that.setData({
          showVoteTips: false
        });
      }, 3000);
    } else if (isSelection) {
      /*符合提交要求*/
      console.log('符合提交要求')
      wx.showLoading({
        title: '提交中',
      })
      for (let c in that.data.options) {
        if (that.data.options[c].checked == true) {
          wx.cloud.callFunction({
            name: 'vote',
            data: {
              selection_id: that.data.options[c]._id,
              student_id: app.globalData.stuNum,
            },
            complete: res => {
              console.log(res)
              this.setData({
                isVoted: true,
              })
              wx.hideLoading()
              wx.showToast({
                title: '投票成功',
                icon: 'success',
                duration: 1000
              })
              db.collection('selections').where({
                vote_id: _.eq(that.data.voteData._id)
              }).get({
                success(res) {
                  that.setData({
                    options: res.data
                  })
                  /*获取选项最大值与百分比*/
                  var temp = that.data.options[0].num
                  for (var index in that.data.options) {
                    if (index.num > temp) {
                      temp = index.num
                    }
                  }
                  that.setData({
                    maxOption: temp
                  })
                  for (var i = 0; i < that.data.options.length; i++) {
                    var percent = 'options[' + i + '].percent'
                    var value = 'options[' + i + '].value'
                    that.setData({
                      [percent]: that.data.options[i].num / that.data.maxOption * 100,
                      [value]: i
                    })
                  }
                }
              })
            }
          })
        }
      }
    }

  },

  cancelVote: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'cancelVote',
      data: {
        student_id: app.globalData.stuNum,
        vote_id: that.data.voteData._id,
      },
      complete: res => {
        console.log(res)
      }
    })
    db.collection('selections').where({
      vote_id: _.eq(that.data.voteData._id)
    }).get({
      success(res) {
        that.setData({
          options: res.data
        })
        /*获取选项最大值与百分比*/
        var temp = that.data.options[0].num
        for (var index in that.data.options) {
          if (index.num > temp) {
            temp = index.num
          }
        }
        that.setData({
          maxOption: temp
        })
        for (var i = 0; i < that.data.options.length; i++) {
          var percent = 'options[' + i + '].percent'
          var value = 'options[' + i + '].value'
          that.setData({
            [percent]: that.data.options[i].num / that.data.maxOption * 100,
            [value]: i
          })
        }
      }
    })
  }

})

