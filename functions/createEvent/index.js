// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const _ = db.command
  var beginTime = new Date(event.timestamp)
  try {
    if (event.image===undefined) { //未选择投票图片
      await db.collection('event').add({
      // data 字段表示需新增的 JSON 数据
        data: {
          club_id: event.club_id,
          club_name: event.club_name,
          content: event.content,
          level: event.level,
          location: event.location,
          name: event.name,
          beginTime: beginTime,
          isPublic: event.isPublic,
          isSign: event.isSign,
          isEnroll: event.isEnroll
        }
      })
    }
    else {
      await db.collection('event').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          club_id: event.club_id,
          club_name: event.club_name,
          content: event.content,
          level: event.level,
          location: event.location,
          name: event.name,
          beginTime: beginTime,
          image: event.image,
          isPublic: event.isPublic,
          isSign: event.isSign,
          isEnroll: event.isEnroll
        }
      })
    }
    return 'ok'
  } catch (e) { console.log(e); return e }
}