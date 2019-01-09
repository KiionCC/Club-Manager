// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext();

  const _ = db.command;
  var deadline = new Date(event.timestamp)

    if (event.icon_id == '000') { //未选择投票图片
      await db.collection('vote').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          can_be_cancelled: event.can_be_cancelled,
          is_multiple: event.is_multiple,
          mem_visible: event.mem_visible,
          name: event.name,
          club_id:event.club_id,
          introduction: event.introduction,
          student_id: event.student_id,
          deadline: deadline,
          state: true,
        },
      })
      var vote=await db.collection('vote').where({ 
        name: _.eq(event.name), 
        club_id: _.eq(event.club_id),
        introduction: _.eq(event.introduction),
        student_id: _.eq(event.student_id), 
        deadline: _.eq(deadline), 
        }).get()
      var vote_id = vote.data[vote.data.length-1]._id

      for (let c in event.select_list) {
        await db.collection('selections').add({ //依次插入每个选项
          data: {
            num: 0,
            selection_name: event.select_list[c].value,
            vote_id: vote_id,
          }
        })
      }
    } 
    else{ //选择了投票图片
      await db.collection('vote').add({  // data 字段表示需新增的 JSON 数据
        data: {
          can_be_cancelled: event.can_be_cancelled,
          is_multiple: event.is_multiple,
          mem_visible: event.mem_visible,
          name: event.name,
          club_id: event.club_id,
          introduction: event.introduction,
          student_id: event.student_id,
          deadline: deadline,
          image: event.icon_id,
          state:true,
          },
        })

      var vote = await db.collection('vote').where({
        name: _.eq(event.name),
        club_id: _.eq(event.club_id),
        introduction: _.eq(event.introduction),
        student_id: _.eq(event.student_id),
        deadline: _.eq(deadline),
      }).get()

      var vote_id = vote.data[vote.data.length - 1]._id

      for(let c in event.select_list) {
        await db.collection('selections').add({ //依次插入每个选项
          data: {
            num: 0,
            selection_name: event.select_list[c].value,
            vote_id: vote_id,
          }
        })
      }
    }
  return 'ok'
}