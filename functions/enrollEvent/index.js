// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  const _ = db.command
  await db.collection('event_member').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      club_id: event.club_id,
      event_id: event.event_id,
      isSign: false,
      student_id: event.student_id,
    }
  })
}