// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const _ =db.command

//添加管理者
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if(event.type=='setTeam'){
    try {
      return await db.collection('club_member').where({
        student_id: _.in(event.members)
      }).update({
        data: {
          job: '代表队',
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
  else if (event.type =='cancelTeam'){
    try {
      return await db.collection('club_member').where({
        student_id: _.in(event.members)
      }).update({
        data: {
          job: '社员',
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
  else if (event.type == 'setManager') {
    try {
      return await db.collection('club_member').where({
        student_id: _.in(event.members)
      }).update({
        data: {
          level: 1,
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
  else if (event.type == 'cancelManager') {
    try {
      return await db.collection('club_member').where({
        student_id: _.in(event.members)
      }).update({
        data: {
          level: 0,
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
  else if (event.type == 'removeMember') {
    try {
      return await db.collection('club_member').where({
        student_id: _.in(event.members)
      }).remove()
    } catch (e) {
      console.log(e)
    }
  }
  
}