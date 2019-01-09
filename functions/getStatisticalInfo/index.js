//本函数接受如下参数：
//{club_id: string}
//返回人数
 
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const _ = db.command
  //找到club中所有的stu
  var res = await db.collection('club_member').where({ club_id: _.eq(event.club_id) }).get()
  var student_id = []
  res.data.forEach(function (index) {
    student_id.push(index.student_id)
  })

  //计算学生信息
  var res1 = await db.collection('student').where({ number: _.in(student_id) }).get()
  var male=0
  var female=0
  res1.data.forEach(function (index) {
    if (index.sex==="男"){
      male++
    }
    else{
      female++
    }
  })

  return {
    male,
    female
  }
}