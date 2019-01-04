// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

//转让社长
// 云函数入口函数
exports.main = async (event, context) => {
  await cloud.callFunction({
    name: 'delManager',
    data: {
      docid: event.old_id
    }, success: function (res) {
      console.log(res.result)
    }, fail: function (res) {
      console.log(res)
    }
  })
  await cloud.callFunction({
    name: 'addManager',
    data: {
      docid: event.new_id,
      job:"社长"
    }, success: function (res) {
      console.log(res.result)
    }, fail: function (res) {
      console.log(res)
    }
  })
}