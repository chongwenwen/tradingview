function callback(obj,body){
  //obj指的当前页面的vue实例
  //未登录或登录失效
  if(body.code==101 || body.code==100){
    obj.$router.push({
       path:'/login'
    })
  }else if(body.code==102){//未实名认证
    obj.certificationModal = true
  }else if(body.code==103){//未设置付款方式
    obj.payModal = true
  }else if(body.code==104){//未设置交易密码
    obj.payPassModal = true
  }else{
    obj.$message({
      message: body.msg,
      type: 'error'
    });
  }
}

//导出
module.exports = {
  callback: callback
}