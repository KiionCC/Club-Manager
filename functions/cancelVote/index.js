// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => { //event传入student_id，vote_id,删除对应selection记录
  const wxContext = cloud.getWXContext()

  const _ = db.command
  try {
    await db.collection('selections').where({
      vote_id = event.vote_id
    }).update({ // data 字段表示需修改的 JSON 数据
      data: {
        num: _.inc(-1),
      }
    })
    selects = await db.collection('selections').where({
      vote_id = event.vote_id
    }).get()
    for (let i = 0; i < selects.data.length; i++) {
      await db.collection('mem_selection').where({
        student_id: event.student_id,
        selection_id: selects.data[i]._id
      }).remove() //取消投票
    }
  } catch (e) {
    console.error(e)
  }

}