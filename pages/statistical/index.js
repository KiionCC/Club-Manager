var wxCharts = require('../../utils/wxcharts.js');

var app = getApp();
var ringChart = null;
var lineChart = null;
var pieChart = null;
Page({
  data: {
    male: "",
    female: "",
    ages: [],
    categories: [],
    club_id: "",
    hometown:[]
  },
  touchHandler: function (e) {
    var that = this
    console.log(ringChart.getCurrentDataIndex(e));
  },
  onLoad: function (e) {
    wx.setNavigationBarTitle({
      title: "成员统计"
    })

    var that = this
    that.setData({
      club_id: app.globalData.currentClub._id
    })
    var windowWidth=0
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      console.log(windowWidth)
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    const db = wx.cloud.database()
    const _ = db.command
    //找到club中所有的stu
    db.collection('club_member').where({ club_id: _.eq(that.data.club_id) }).get({
      success(res) {
        var mem = []
        res.data.forEach(function (index) {
          mem.push(index.student_id)
        })
        //查找stu信息
        db.collection('student').where({ number: _.in(mem) }).get({
          success(res) {
            var timestamp = Date.parse(new Date());
            var DATE = new Date(timestamp);
            var Y = DATE.getFullYear();//年
            var M = (DATE.getMonth() + 1 < 10 ? '0' + (DATE.getMonth() + 1) : DATE.getMonth() + 1);//月
            var D = DATE.getDate() < 10 ? '0' + DATE.getDate() : DATE.getDate();//日
            //console.log("当前时间：" + Y + M + D);

            var male = 0
            var female = 0
            var ages = []
            var hometown = []
            for (var i = 0; i < app.globalData.province.length; i++) {
              hometown.push({ name: app.globalData.province[i], data: 0 })
            }
            res.data.forEach(function (index) {
              //性别统计
              if (index.sex === "男") {
                male++
              }
              else {
                female++
              }
              //年龄分布统计
              var times = Date.parse(index.birthday);
              var date = new Date(times);
              var y = date.getFullYear();//年  
              var m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);//月
              var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();//日
              var yy = Y - y
              if (m > M) {
                yy--
              }
              else if (m === M & d > D) {
                yy--
              }
              if (ages[yy] === undefined) {
                ages[yy] = 0
              }
              ages[yy]++
              //籍贯分布统计
              for (var i = 0; i < app.globalData.province.length; i++) {
                if(index.hometown===hometown[i].name){
                  hometown[i].data++
                }
              }

            })
            //console.log(hometown)
            //年龄统计处理
            var length = ages.length
            var categories = new Array(length)
            for (var i = 0; i < length; i++) {
              categories[i] = i
              if (ages[i] === undefined) {
                ages[i] = 0
              }
            }
            var minlen=length
            for (var i = length-1; i >= 0; i--) {
              if (ages[i] != 0) {
                minlen = i
              }
            }
            var cate_tmp=[]
            var age_tmp=[]
            for (var i = minlen; i < length; i++) {
              cate_tmp[i-minlen] = categories[i]
              age_tmp[i-minlen] = ages[i]
            }
            //籍贯统计处理
            var home_tmp=[]
            for (var i = 0; i < hometown.length; i++) {
              if(hometown[i].data>0){
                home_tmp.push(hometown[i])
              }
            }
            console.log(home_tmp)

            //赋值
            that.setData({
              male: male,
              female: female,
              ages: age_tmp,
              categories: cate_tmp,
              hometown: home_tmp
            })
            console.log("male:"+that.data.male+" female:" + that.data.female)
            console.log("ages:" + that.data.ages)

            //性别比例
            ringChart = new wxCharts({
              animation: true,
              canvasId: 'ringCanvas',
              type: 'ring',
              subtitle: {
                name: '男女比例',
                fontSize: 15
              },
              series: [{
                name: '男',
                data: that.data.male,
                color: '#7cb5ec'
              }, {
                name: '女',
                data: that.data.female,
                color: '#f7a35c'
              }],
              width: windowWidth,
              height: 300,
              dataLabel: true,
            });

            //籍贯分布
            pieChart = new wxCharts({
              animation: true,
              canvasId: 'pieCanvas',
              type: 'pie',
              series: that.data.hometown,
              width: windowWidth,
              height: 300,
              dataLabel: true,
            });

            //年龄分布
            columnChart = new wxCharts({
              canvasId: 'columnCanvas',
              type: 'column',
              animation: true,
              categories: that.data.categories,
              series: [{
                name: '年龄',
                data: that.data.ages, 
                color: "#f15c80",
                format: function (val, name) {
                  return val;
                }
              }],
              yAxis: {
                format: function (val) {
                  return val;
                },
                title: '人数',
                min: 0
              },
              xAxis: {
                disableGrid: false,
                type: 'calibration'
              },
              extra: {
                column: {
                  width: 15
                }
              },
              width: windowWidth,
              height: 200,
            });


          }
        })
      }
    })


  }
});