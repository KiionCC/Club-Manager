wx.cloud.init()
var app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    introduction: "",
    icon_id: "",

    files: [],

    showBadTips1: false,
    showBadTips2: false,
    showTopTips: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  /*输入社团名*/
  InputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  /*输入社团简介*/
  InputIntro: function (e) {
    this.setData({
      introduction: e.detail.value
    })
    console.log(this.data)
  },

  /*选择图片*/
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },

  /*点击图片*/
  previewImage: function (e) {
    var that = this
    /*选择查看或者删除*/
    wx.showActionSheet({
      itemList: ['预览图片', '删除图片'],
      success: function (res) {
        if(res.tapIndex == 0){
          wx.previewImage({
            current: that.data.files[0].id, // 当前显示图片的http链接
            urls: that.data.files // 需要预览的图片http链接列表
          })
        }
        else if(res.tapIndex == 1){
          that.setData({
            files: []
          })
        }
      }
    })
  },

  /*提交申请*/
  upload: function(){
    var that = this
    /*若有未填项，返回错误信息*/
    if (!that.data.files.length || !that.data.name || !that.data.introduction) {
      this.setData({
        showTopTips: true
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
    }
    else{
      /*若有同名社团或申请*/
      db.collection('club').where({ name: _.eq(that.data.name) }).get({
        success(res){
          console.log(res)
          if (res.data.length) {
            that.setData({
              showBadTips1: true
            });
            setTimeout(function () {
              that.setData({
                showBadTips1: false
              });
            }, 3000);
          }
          else{
            db.collection('club_application').where({ name: _.eq(that.data.name) }).get({
              success(res2){
                console.log(res2)
                if(res2.data.length){
                  that.setData({
                    showBadTips2: true
                  });
                  setTimeout(function () {
                    that.setData({
                      showBadTips2: false
                    });
                  }, 3000)
                }
                else{
                  wx.showLoading({
                    title: '提交中',
                  })
                  wx.cloud.uploadFile({
                    cloudPath: 'ClubIcon/' + that.data.name + '.jpg', // 上传至云端的路径
                    filePath: that.data.files[0], // 小程序临时文件路径
                    success: res => {
                      // 返回文件 ID
                      console.log(res)
                      that.setData({
                        icon_id: res.fileID
                      })
                      db.collection('club_application').add({
                        data: {
                          name: that.data.name,
                          introduction: that.data.introduction,
                          student_id: app.globalData.stuNum,
                          icon_id: that.data.icon_id,
                          state: 'waiting'
                        }
                      })
                      // wx.cloud.callFunction({
                      //   name: 'appliCreateClub',
                      //   data: {
                      //     club_name: that.data.name,
                      //     introduction: that.data.introduction,
                      //     icon_id: that.data.icon_id,
                      //     student_id: app.globalData.stuNum
                      //   },
                      //   complete: res => {
                      //     console.log(res)
                      //   }
                      // })
                    },
                    fail: console.error
                  })
                  wx.hideLoading()
                  wx.showToast({
                    icon: 'success',
                    title: '提交成功',
                    duration: 1000
                  })
                  setTimeout(function () {
                    wx.navigateBack({

                    })
                  }, 1000);
                }
              }
            })
          }
        }
      })
    }
  }, 
})