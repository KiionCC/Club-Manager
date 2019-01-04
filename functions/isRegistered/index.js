// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const _ = db.command
  //检查是否通过认证
  var res = await db.collection('student').where({ openid: _.eq(wxContext.OPENID) }).get()
  return res.data
}