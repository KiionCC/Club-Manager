// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {  //event传入vote_id，修改对应vote记录
  const wxContext = cloud.getWXContext()

  const _ = db.command
  try {
    await db.collection('vote').doc(event.vote_id).update({// data 字段表示需修改的 JSON 数据
      data: {
        state: false,
      }
    })
    }catch (e) {
    console.error(e)
  }

}