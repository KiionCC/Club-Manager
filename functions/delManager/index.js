// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

//去除管理员身份
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('club_member').doc(event.docid).update({
      data: {
        job: "一般学生"
      }
    })
  } catch (e) {
    console.log(e)
  }
}