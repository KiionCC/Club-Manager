// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

//获取社团注册申请列表
// 云函数入口函数
exports.main = async (event, context) => db.collection('club_application').get()