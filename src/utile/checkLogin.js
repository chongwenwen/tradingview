const checkToken = function (flag,obj){
   //obj指当前vue对象,flag是页面变量
   var token = localStorage.getItem('token')
   if(token){
     isOverdue(token)//检查token是否过期
   }else{
     flag = false
   }
}
function isOverdue(token){
   var url = obj.$urlPrefix+'/vLogin'
   var data={
     _ajax:1,
     toKey:token
   }
   obj.$http.post(url,data).then(function(response){
      var result = response.body
      if(response.body.code==1){
         //没过期
         flag = true
      }else{
         //过期
         flag = false
      }
   })
}

export default checkToken;