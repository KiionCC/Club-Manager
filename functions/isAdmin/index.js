// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //检查是否为管理员
  var res = await db.collection('admin').where({ openid: _.eq(wxContext.OPENID) }).get()
  return res.data
}