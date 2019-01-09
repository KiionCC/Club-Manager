// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => { //event传入vote_id，删除对应vote记录
  const wxContext = cloud.getWXContext()

  const _ = db.command
  try {
    var selects = await db.collection('selections').where({
      vote_id: event.vote_id
    }).get()
    for (let c in selects) {
      db.collection('mem_selection').where({
        selection_id: selects.data[c]._id
      }).remove() //删除成员投票
    }
    await db.collection('selections').where({
      vote_id: event.vote_id
    }).remove() //删除投票选项
    var vote = await db.collection('vote').doc(event.vote_id).get()
    if (vote.image != undefined) {//如果存在投票图片
      file_id = vote.data[0].image
      await cloud.deleteFile({
        fileList: fileIDs
      }) //删除投票图片
    }
    await db.collection('vote').doc(event.vote_id).remove() //删除投票
  } catch (e) {
    console.error(e)
  }

}