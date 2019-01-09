// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

//转让社长
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    await db.collection('club_member').doc(event.old).update({
      data: {
        job: "社员",
        level: 1
      }
    })
  } catch (e) {
    console.log(e)
  }
  
  try {
    await db.collection('club_member').doc(event.new).update({
      data: {
        job: "社长",
        level: 2
      }
    })
  } catch (e) {
    console.log(e)
  } 
  return 'ok'
}