// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

//社团注册确认并添加社长
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    //根据社团申请_id查找信息
    
    var tmp1 = await db.collection('club_application').doc(event.application_id).get({     
    })
    //更新社团申请列表中的申请
    var tmp3 = await db.collection('club_application').doc(event.application_id).update({
      data: {
        state: event.state
      }
    })
    if(event.state == 'pass'){
      //根据信息新建社团
      var tmp2 = await db.collection('club').add({
        data: {
          name: tmp1.data.name,
          introduction: tmp1.data.introduction,
          icon_id: tmp1.data.icon_id,
          point: 0
        }
      })
      //添加社长
      return await db.collection('club_member').add({
        data: {
          club_id: tmp2._id,
          job: "社长",
          point: 0,
          student_id: tmp1.data.student_id
        }
      })
    }
    
    
  } catch (e) {
    console.log(e)
  } 
}