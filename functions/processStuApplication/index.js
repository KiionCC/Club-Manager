// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const _ = db.command
  //检查是否存在该申请并删除
  var res = await db.collection('mem_application').where({
    club_id: _.eq(event.club_id),
    student_id: _.eq(event.student_id)
  }).remove()
  var count = res.stats.removed
  if (count === 0) {
    return 'application not exist'
  }
  if(event.agree===0)
  {return 'denied'}
    if(event.method == 'pass'){
      
      await db.collection('club_member').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        _id: String(event.student_id) + event.club_id,
        club_id: event.club_id,
        job: '社员',
        point: 0,
        level: 0,
        student_id: event.student_id,
      },
    })
    }
    else if(event.method == 'reject'){

    }
    return 'ok'
}