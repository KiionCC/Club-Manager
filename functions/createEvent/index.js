// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const _ = db.command
  try {
    await db.collection('event').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        content: event.content,
        level: event.level,
        locacion: event.locacion,
        name: event.name,
        time: event.time
      }
    })
    return 'ok'
  } catch (e) { console.log(e); return e }
}