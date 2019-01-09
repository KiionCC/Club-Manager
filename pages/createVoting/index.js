wx.cloud.init()
var app = getApp()

Page({
  data: {
    name: '',
    introduction: '',

    optionList: [{
        icon: ''
      },
      {
        icon: ''
      }
    ],

    showAddBtn: 1,

    date: "2017-09-01",
    time: "12:01",

    voteType: ['单选', '多选，最多2项'],
    voteTypeIndex: 0,

    cbc: true,
    ivs: true,

    files: []


  },

  onLoad: function() {
    console.log(new Date())
    wx.setNavigationBarTitle({
      title: '发起投票' //页面标题为社团名
    })

    let now = new Date()
    this.setData({
      date: now.toLocaleDateString().replace(/\//g, "-"),
      time: now.toTimeString().substr(0, 8)
    })
  },

  /*输入投票标题*/
  InputName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  /*输入投票介绍*/
  InputIntro: function(e) {
    this.setData({
      introduction: e.detail.value
    })
    console.log(this.data)
  },

  /*更新投票选项多选*/
  updateVoteType: function() {
    let _optionList = this.data.optionList;
    let _voteType = this.data.voteType;

    _voteType = [];

    _optionList.map(function(obj, i) {

      if (i === 0) {
        _voteType.push('单选');
      } else {
        _voteType.push('多选，最多' + (i + 1) + '项');
      }

      console.log(i)
      console.log(_voteType)

    })

    this.setData({
      voteType: _voteType
    });
    console.log(111)
  },


  /*投票类型改变*/
  bindVoteTypeChange: function(e) {
    this.setData({
      voteTypeIndex: e.detail.value
    })
  },

  /*截止时间改变*/
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },

  /*截止日期改变*/
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  /*记录选项*/
  recordValue: function(e) {
    let _optionList = this.data.optionList;
    let _index = e.target.dataset.index;
    let value = e.detail.value;
    _optionList[_index].value = value;

    this.setData({
      optionList: _optionList
    });

  },

  /*增加选项*/
  addOption: function(e) {
    let _optionList = this.data.optionList;

    _optionList.push({
      icon: '/images/common/5.png'
    })
    this.setData({
      optionList: _optionList
    });

    // 选项大于15个后移除添加按钮
    if (_optionList.length >= 15) {
      this.setData({
        showAddBtn: 0
      });
    }

    // 更新投票选项
    this.updateVoteType();

  },

  /*删除选项*/
  delOption: function(e) {
    let _index = e.target.dataset.index;
    let _optionList = this.data.optionList;

    _optionList.splice(_index, 1);

    this.setData({
      optionList: _optionList
    });

    // 更新投票选项
    this.updateVoteType();

  },

  /*能否取消投票*/
  canBeCanceled: function(e) {
    this.setData({
      cbc: e.detail.value
    })
  },

  /*是否匿名*/
  isVoterShow: function(e) {
    this.setData({
      ivs: e.detail.value
    })
  },

  /*选择图片*/
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 1, // 最多可以选择的图片张数
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },

  /*预览图片*/
  previewImage: function(e) {
    var that = this
    /*选择查看或者删除*/
    wx.showActionSheet({
      itemList: ['预览图片', '删除图片'],
      success: function(res) {
        if (res.tapIndex == 0) {
          wx.previewImage({
            current: that.data.files[0].id, // 当前显示图片的http链接
            urls: that.data.files // 需要预览的图片http链接列表
          })
        } else if (res.tapIndex == 1) {
          that.setData({
            files: []
          })
        }
      }
    })
  },


  /*点击提交*/
  showTopTips: function() {
    var that = this
    if (that.data.name && that.data.introduction) {
      var isSelection = true
      for (var index in that.data.optionList) {
        if (!that.data.optionList[index].value) {
          isSelection = false
        }
      }
      var end_date = that.data.date + ' ' + that.data.time + ':00';
      var deadline = new Date(end_date);
      var timestamp = Date.parse(deadline)
      if (deadline < new Date()) {
        isSelection = false
      }
      if (isSelection) {
        /*符合提交要求*/
        wx.showLoading({
          title: '提交中',
        })
        console.log('符合提交要求')
        if (!that.data.files.length) {
          wx.cloud.callFunction({
            name: 'createVote',
            data: {
              can_be_cancelled: that.data.cbc,
              is_multiple: Number(that.data.voteTypeIndex) + 1,
              mem_visible: that.data.ivs,
              name: that.data.name,
              club_id: app.globalData.currentClub._id,
              introduction: that.data.introduction,
              student_id: app.globalData.stuNum,
              timestamp: timestamp,
              select_list: that.data.optionList,
              icon_id: '000',
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
        } else {
          wx.showLoading({
            title: '提交中',
          })
          wx.cloud.uploadFile({
            cloudPath: 'VoteImage/' + String(timestamp) + app.globalData.stuNum + '.jpg', // 上传至云端的路径
            filePath: that.data.files[0], // 小程序临时文件路径
            success: res => {
              // 返回文件 ID
              console.log(res)
              that.setData({
                icon_id: res.fileID
              })
              wx.cloud.callFunction({
                name: 'createVote',
                data: {
                  can_be_cancelled: that.data.cbc,
                  is_multiple: Number(that.data.voteTypeIndex) + 1,
                  mem_visible: that.data.ivs,
                  name: that.data.name,
                  club_id: app.globalData.currentClub._id,
                  introduction: that.data.introduction,
                  student_id: app.globalData.stuNum,
                  timestamp: timestamp,
                  select_list: that.data.optionList,
                  icon_id: that.data.icon_id,
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
          })
        }
      } else {
        this.setData({
          showTopTips: true
        });
        setTimeout(function() {
          that.setData({
            showTopTips: false
          });
        }, 3000);
      }
    } else {
      this.setData({
        showTopTips: true
      });
      setTimeout(function() {
        that.setData({
          showTopTips: false
        });
      }, 3000);
    }

  },
});