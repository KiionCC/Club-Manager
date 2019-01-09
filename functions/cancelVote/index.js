// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => { //event传入hadChosen,删除对应selection记录
  const wxContext = cloud.getWXContext()

  const _ = db.command
  try {
    for (let i = 0; i < event.hadChosen.length; i++) {
      await db.collection('selections').where({
        _id: event.hadChosen[i].selection_id
      }).update({ // data 字段表示需修改的 JSON 数据
        data: {
          num: _.inc(-1),
        }
      })
    }
    await db.collection('mem_selection').where({
      student_id: event.hadChosen[0].student_id,
      vote_id: event.hadChosen[0].vote_id
    }).remove() //取消投票
  } catch (e) {
    console.error(e)
  }
  return 'ok'
}