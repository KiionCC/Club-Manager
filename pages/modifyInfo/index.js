wx.cloud.init()
const db = wx.cloud.database()
const _ = db.command
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    showBadTips: false,

    student: {
      stuNum: 0,
      name: "",
      major: "",
      phoneNum: 0,
    },

    sex: ["男", "女"],
    sexIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '修改信息'//页面标题为社团名
    })

    db.collection('student').where({
      number: _.eq(app.globalData.stuNum)
    }).get({
      success(res){
        console.log(res)
        that.setData({
          student: {
            stuNum: res.data[0].number,
            name: res.data[0].name,
            major: res.data[0].major,
            phoneNum: res.data[0].phone_number
          }  
        })
        if(res.data.sex == '女'){
          that.setData({
            sexIndex: 1
          })
        }
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

  /*输入学号*/
  InputStuNum: function (e) {
    this.setData({
      'student.stuNum': Number(e.detail.value)
    })
  },

  /*输入姓名*/
  InputName: function (e) {
    this.setData({
      'student.name': e.detail.value
    })
  },

  /*输入学院*/
  InputMajor: function (e) {
    this.setData({
      'student.major': e.detail.value
    })
  },

  /*输入手机*/
  InputPhone: function (e) {
    this.setData({
      'student.phoneNum': Number(e.detail.value)
    })
    console.log(this.data.student)
  },

  /*改变性别*/
  bindCountryChange: function (e) {
    console.log('picker sex发生选择改变，携带值为', e.detail.value);

    this.setData({
      sexIndex: e.detail.value
    })
  },

  /*确认提交*/
  showTopTips: function (e) {
    var that = this;

    /*若有未填项，返回错误信息*/
    if (!that.data.student.stuNum || !that.data.student.name || !that.data.student.major || !that.data.student.phoneNum) {
      this.setData({
        showTopTips: true
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
    }
    /*符合认证标准*/
    else {
      wx.showLoading({
        title: '修改中',
      });
      wx.cloud.callFunction({
        name: 'changePersonalInfo',
        data: {
          number: that.data.student.stuNum,
          major: that.data.student.major,
          phone_number: that.data.student.phoneNum,
          sex: that.data.sex[that.data.sexIndex],
        },
        complete: res => {
          console.log(res)
          /*认证成功*/
          if (res.result == "ok") {
            wx.hideLoading();
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1000
            });
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 1000);
          }
        }
      })
    }
  },
})