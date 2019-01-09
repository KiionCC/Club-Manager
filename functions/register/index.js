// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const _ = db.command
  //检查是否已经存在该学生
  var res=await db.collection('student').where({ number: _.eq(event.number) }).get()
  var count=res.data.length
  if (count!==0){
    return 'already exist'
  }

  //学生认证（模拟）
  if(event.password==null){
    return 'wrong password'
  }
  try {
    await db.collection('student').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        major: event.major,
        name: event.name,
        number: event.number,
        phone_number: event.phone_number,
        sex: event.sex,
        openid: wxContext.OPENID,
        avatarurl: event.avatarurl,
        birthday: event.birthday,
        hometown: event.hometown
      }
    })
    return 'ok'
  } catch(e){console.log(e);return e}
}