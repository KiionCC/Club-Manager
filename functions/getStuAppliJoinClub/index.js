// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => db.collection('club_member').where({ club_id: _.eq(event.club_id), student_id: _.eq(event.student_id) }).get()