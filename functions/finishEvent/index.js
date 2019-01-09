// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => { //event传入event_id，level修改对应记录
  const wxContext = cloud.getWXContext()

  const _ = db.command
  await db.collection('event').where({
    _id: event.event_id,
  }).update({ // data 字段表示需修改的 JSON 数据
    data: {
      isOver: true,
    }
  })

  var member = await db.collection('event_member').where({
    event_id: event.event_id,
  }).get()
  for (let i in member.data) {
    await db.collection('club_member').where({
      student_id: member.data[i].student_id,
      club_id:member.data[i].club_id,
    }).update({ // data 字段表示需修改的 JSON 数据
      data: {
        point: _.inc(event.level),
      }
    })
  }
}