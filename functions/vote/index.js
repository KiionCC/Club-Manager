// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const _ = db.command
  try {
    await db.collection('mem_selection').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        selection_id: event.selection_id,
        student_id: event.student_id,
        vote_id: event.vote_id
      }
    })
    await db.collection('selections').doc(event.selection_id).update({// data 字段表示需修改的 JSON 数据
      data: {
        num: _.inc(1),
      }
    })
    return 'ok'
  } catch (e) { return e }
}