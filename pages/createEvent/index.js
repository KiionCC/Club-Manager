// pages/createEvent/index.js 
wx.cloud.init()
var app = getApp()

Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    name: "",
    content: "",

    beginDate: "2017-09-01",
    beginTime: "12:01",
    location: "",
    level: [1,2,3],
    levelIndex: 0,

    isEnroll: false,
    isSign: false,
    isPublic: true,
    enrollDate: "2017-09-01",
    enrollTime: "12:01",

    image:"",
    files: []
  },

  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    let now = new Date()
    this.setData({
      beginDate: now.toLocaleDateString().replace(/\//g, "-"),
      beginTime: now.toTimeString().substr(0, 8)
    })

    wx.setNavigationBarTitle({
      title: '发起活动'//页面标题为社团名
    })
  },




  /*输入活动名*/
  InputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  /*输入活动简介*/
  InputIntro: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  /*开始时间改变*/
  bindBeginTimeChange: function (e) {
    this.setData({
      beginTime: e.detail.value
    })
  },

  /*开始日期改变*/
  bindBeginDateChange: function (e) {
    this.setData({
      beginDate: e.detail.value
    })
  },

  /*输入地点*/
  InputLocation: function (e) {
    this.setData({
      location: e.detail.value
    })
  },

  /*改变积分*/
  bindCountryChange: function (e) {
    console.log('picker level发生选择改变，携带值为', e.detail.value);

    this.setData({
      levelIndex: e.detail.value
    })
  },

  /*开启报名*/
  isEnroll: function (e) {
    this.setData({
      isEnroll: e.detail.value
    })
  },

  /*报名截止时间改变*/
  bindEnrollTimeChange: function (e) {
    this.setData({
      enrollTime: e.detail.value
    })
  },

  /*报名截止日期改变*/
  bindEnrollDateChange: function (e) {
    this.setData({
      enrollDate: e.detail.value
    })
  },

  /*开启签到*/
  isSign: function (e) {
    this.setData({
      isSign: e.detail.value
    })
  },

  /*公开*/
  isPublic: function (e) {
    this.setData({
      isPublic: e.detail.value
    })
  },

  /*选择图片*/
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      count: 1, // 最多可以选择的图片张数 
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },

  /*预览图片*/
  previewImage: function (e) {
    var that = this
    /*选择查看或者删除*/
    wx.showActionSheet({
      itemList: ['预览图片', '删除图片'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.previewImage({
            current: that.data.files[0].id, // 当前显示图片的http链接 
            urls: that.data.files // 需要预览的图片http链接列表 
          })
        }
        else if (res.tapIndex == 1) {
          that.setData({
            files: []
          })
        }
      }
    })
  },

  /*点击提交*/
  showTopTips: function () {
    var that = this
    if (that.data.name && that.data.content && that.data.location) {
      var isSelection = true
      var begin_date = that.data.beginDate + ' ' + that.data.beginTime + ':00';
      var deadline = new Date(begin_date);
      var timestamp = Date.parse(deadline)
      if (deadline < new Date()) {
        isSelection = false
      }
      if (isSelection) {
        /*符合提交要求*/
        console.log('符合提交要求')
        wx.showLoading({
          title: '提交中',
        })
        if (!that.data.files.length) {
          wx.cloud.callFunction({
            name: 'createEvent',
            data: {
              club_id: app.globalData.currentClub._id,
              club_name: app.globalData.currentClub.name,
              name: that.data.name,
              content: that.data.content,
              level: that.data.levelIndex+1,
              location: that.data.location,
              timestamp: timestamp,
              isPublic: that.data.isPublic,
              isSign: that.data.isSign,
              isEnroll: that.data.isEnroll,
            },
            complete: res => {
              console.log(res)
              wx.hideLoading()
              wx.showToast({
                title: '发布成功',
                icon: "success",
                duration: 1000
              })
              setTimeout(function () {
                wx.navigateBack({

                })
              }, 1000
              )
            }
          })
        }
        else {
          wx.cloud.uploadFile({
            cloudPath: 'EventImage/' + that.data.name + "_" +timestamp + '.jpg', // 上传至云端的路径
            filePath: that.data.files[0], // 小程序临时文件路径
            success: res => {
              // 返回文件 ID
              //console.log(res)
              that.setData({
                image: res.fileID
              })
              wx.cloud.callFunction({
                name: 'createEvent',
                data: {
                  club_id: app.globalData.currentClub._id,
                  club_name: app.globalData.currentClub.name,
                  name: that.data.name,
                  content: that.data.content,
                  level: that.data.levelIndex + 1,
                  location: that.data.location,
                  timestamp: timestamp,
                  isPublic: that.data.isPublic,
                  isSign: that.data.isSign,
                  isEnroll: that.data.isEnroll,
                  image: that.data.image
                },
                complete: res => {
                  console.log(res)
                  wx.hideLoading()
                  wx.showToast({
                    title: '发布成功',
                    icon: "success",
                    duration: 1000
                  })
                  setTimeout(function(){
                    wx.navigateBack({

                    })
                  }, 1000
                  )

                }
              })
            },
            fail: console.error
          })
        }
      }
      else {
        this.setData({
          showTopTips: true
        });
        setTimeout(function () {
          that.setData({
            showTopTips: false
          });
        }, 3000);
      }
    }
    else {
      this.setData({
        showTopTips: true
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
    }

  },
})