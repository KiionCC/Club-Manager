// pages/createEvent/index.js 
wx.cloud.init()
var app = getApp()

Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    beginDate: "",
    beginTime: "",
    location: "",
    level: [1,2,3],
    levelIndex: 0,

    isEnroll: false,
    enrollDate: "2017-09-01",
    enrollTime: "12:01",

    isPublic: true,

    files: []
  },

  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    var nowTime = new Date()
    this.setData({
      beginDate: nowTime.toDateString(),
      beginTime: nowTime.toLocaleTimeString()
    })

    wx.setNavigationBarTitle({
      title: '发起活动'//页面标题为社团名
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
})