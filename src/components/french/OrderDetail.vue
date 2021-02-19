<template>
    <div class="orderDetail_contain">
        <div class="content">
            <h1>{{totalData.content}}</h1>
            <p class="price"><span>单价：</span>{{totalData.price}}</p>
            <p class="price"><span>总价：</span><span class="rmb">{{totalData.total_price}}</span></p>
            <div class="title">
                <span class="el-icon-caret-right"></span>交易信息
                <span class="line"></span>
            </div>
            <div class="payType">
               <div class="item" v-if="totalData.order_time">
                 状态：
                 <span class="payStatus wait" v-if="totalData.status==0">待支付</span>
                 <span class="payStatus payDone" v-if="totalData.status==1">已支付
                 </span>
                 <a href="javascript:;" v-if="totalData.status==1 && totalData.own_pay==0" @click="confirmOrder(totalData.id)">确认收款</a>
                 <span class="payStatus cancle" v-if="totalData.status==2">已取消</span>
                 <span class="payStatus complete" v-if="totalData.status==3">已收款</span>
               </div>
               <div class="item" v-if="totalData.order_time">
                 下单时间：{{totalData.order_time}}
               </div>
               <div class="item" v-if="totalData.pay_time">
                 支付时间：{{totalData.pay_time}}
               </div>
               <div class="item" v-if="totalData.cancel_time">
                 取消时间：{{totalData.cancel_time}}
               </div>
               <div class="item" v-if="totalData.collect_time">
                 收款时间：{{totalData.collect_time}}
               </div>
            </div>
            <div class="title" v-if="totalData.own_pay==1 && totalData.status==0">
                <span class="el-icon-caret-right"></span>卖方收款方式
                <span class="line"></span>
            </div>
            <div class="payType" v-if="totalData.own_pay==1 && totalData.status==0" v-for="item in totalData.pay">
                <div class="item" v-if="item.type==1">
                    <img src="../../assets/weixin.png" class="img">微信
                    <img src="../../assets/code.png" class="img code" @click="showCode(1)">
                    <el-tooltip effect="dark" content="点击二维码向卖家付款" placement="top">
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                </div>
                <div class="item" v-if="item.type==2">
                    <img src="../../assets/zhifubao.png" class="img">支付宝
                    <span>{{JSON.parse(item.content).name}}</span>
                    <span>{{JSON.parse(item.content).code}}</span>
                    <img src="../../assets/code.png" class="img code" @click="showCode(2)">
                    <el-tooltip effect="dark" content="点击二维码向卖家付款" placement="top">
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                </div>
                <div class="item" v-if="item.type==3">
                    <img src="../../assets/card.png" class="img">银行卡
                    <span>{{JSON.parse(item.content).name}}</span>
                    <span>{{JSON.parse(item.content).code}}</span>
                    <span>{{JSON.parse(item.content).bank}}</span>
                </div>
            </div>
            <div class="status" v-if="totalData.status==0">
                待支付，订单将于 <span class="time">{{timer}}</span> 后失效
            </div>
            <button class="payBtn" @click="payCredence" v-if="totalData.own_pay==1 && totalData.status ==0">点击支付</button>
            <div class="cancleDeal" @click="cancleOrder(totalData.id)" v-if="totalData.own==1 && totalData.status==0">取消订单</div>
            <div class="title" v-if="totalData.status==1 || totalData.status==3">
                <span class="el-icon-caret-right"></span>支付凭证
                <span class="line"></span>
            </div>
            <div class="payVoucher" v-if="totalData.status==1 || totalData.status==3">
              <img :src="payUrl" preview="0" id="payUrl">
            </div>
        </div>
        <el-dialog title="向卖家扫码付款" class="code" :visible.sync="codeShow">
            <img :src="codeUrl">
        </el-dialog>
        <el-dialog title="上传支付凭证" class="code" :visible.sync="dealCredence">
            <el-upload
              class="avatar-uploader"
              :action="$urlPrefix+'/picturePay'"
              accept="image/png, image/jpeg, image/jpg"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :before-upload="beforeImgUpload">
              <img v-if="payUrl" :src="payUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary"  style="width:240px;margin-bottom:20px;" @click="payCredenceSubmit(totalData.id)">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import callback from "../../utile/callback.js"
export default {
  data() {
    return {
        codeShow:false,
        orderId:'',
        totalData:{},
        dealCredence:false,
        callbackUrl:'',
        payUrl:'',
        codeUrl:'',
        weiImg:'',
        aliImg:'',
        timer:null,
        orderId:'',
        timers:null,
        confirmId:''
    }
  },
  created(){
      this.orderId = this.$route.query.id
      if(this.orderId){
        this.init()
      }  
  },
  // mounted(){
  //   layui.use('layim', function(layim){
  //      layim.config({
  //       //获取主面板列表信息
  //       init: {
  //         // url: '',//接口地址（返回的数据格式见下文）
  //         // type: 'get', //默认get，一般可不填
  //         // data: {} //额外参数
  //         //好友列表
  //         "friend": [{
  //           "groupname": "前端码屌" //好友分组名
  //           ,"id": 1 //分组ID
  //           ,"list": [{ //分组下的好友列表
  //             "username": "贤心" //好友昵称
  //             ,"id": "100001" //好友ID
  //             ,"avatar": "a.jpg" //好友头像
  //             ,"sign": "这些都是测试数据，实际使用请严格按照该格式返回" //好友签名
  //             ,"status": "online" //若值为offline代表离线，online或者不填为在线
  //           } ]
  //         }]
  //       }, 
  //       //获取群员接口（返回的数据格式见下文）
  //       members: { 
  //         url: '', //接口地址（返回的数据格式见下文）
  //         type: 'get', //默认get，一般可不填
  //         data: {} //额外参数
  //       },
  //       title:'与买方在线沟通',
  //       voice:true,//设定消息提醒
  //       notice:true,//  是否开启桌面消息提醒，即在浏览器之外的提醒
  //       //上传图片接口（返回的数据格式见下文），若不开启图片上传，剔除该项即可
  //       uploadImage: {
  //         url: '', //接口地址
  //         type: 'post' //默认post
  //       },
  //       //上传文件接口（返回的数据格式见下文），若不开启文件上传，剔除该项即可
  //       uploadFile: {
  //         url: '' //接口地址
  //         ,type: 'post' //默认post
  //       },
  //       // msgbox: layui.cache.dir + 'css/modules/layim/html/msgbox.html', 
  //       //消息盒子页面地址，若不开启，剔除该项即可
  //       chatLog: layui.cache.dir + 'css/modules/layim/html/chatlog.html' 
  //       //聊天记录页面地址，若不开启，剔除该项即可
  //     });
  //     layim.msgbox(5);
  //     //ready，用于监听LayIM初始化就绪。由于主面板的渲染，需建立在init接口请求完毕的基础上.其回调接受一个object类型的参数，携带一些基础配置信息、我的用户信息、好友/群列表信息、本地数据库信息等
  //     layim.on('ready', function(options){
  //      // console.log(options);
  //       //do something
  //       var res={
  //         type: 'group' //列表类型，只支持friend和group两种
  //         ,avatar: "a.jpg" //群组头像
  //         ,groupname: '前端码屌' //群组名称
  //         ,id: "12333333" //群组id
  //       }
  //       layim.addList(res.data);
  //     });
  //     //监听在线状态切换
  //     layim.on('online', function(status){
  //       console.log(status); //获得online或者hide
        
  //       //此时，你就可以通过Ajax将这个状态值记录到数据库中了,接口自己写
  //     });
  //     //监听修改签名 
  //     layim.on('sign', function(value){
  //       console.log(value); //获得新的签名
        
  //       //此时，你就可以通过Ajax将新的签名同步到数据库中了。
  //     }); 
  //     //监听发送消息
  //     layim.on('sendMessage', function(res){
  //       //我发送的消息及我的信息
  //       // var mine = res.mine; 
  //       //mine的结构如下：
  //       // {
  //       //   avatar: "avatar.jpg" //我的头像
  //       //   ,content: "你好吗" //消息内容
  //       //   ,id: "100000" //我的id
  //       //   ,mine: true //是否我发送的消息
  //       //   ,username: "纸飞机" //我的昵称
  //       // }
        
  //       // var to = res.to; //对方的信息
  //       //to的结构如下：
  //       // {
  //       //   avatar: "avatar.jpg"
  //       //   ,id: "100001"
  //       //   ,name: "贤心"
  //       //   ,sign: "这些都是测试数据，实际使用请严格按照该格式返回"
  //       //   ,type: "friend" //聊天类型，一般分friend和group两种，group即群聊
  //       //   ,username: "贤心"
  //       // }
  //         //监听到上述消息后，就可以轻松地发送socket了，如：
  //         socket.send(JSON.stringify({
  //           type: 'chatMessage' //随便定义，用于在服务端区分消息类型
  //           ,data: res
  //         })); 
  //     });
  //     //接收服务器消息
  //     socket.onmessage = function(res){
  //       res = JSON.parse(res);
  //       if(res.emit === 'chatMessage'){
  //         layim.getMessage(res.data); //res.data即你发送消息传递的数据（阅读：监听发送的消息）
  //         //接收的数据必须包含:
  //         // {
  //         //   username: "纸飞机" //消息来源用户名
  //         //   ,avatar: "http://tp1.sinaimg.cn/1571889140/180/40030060651/1" //消息来源用户头像
  //         //   ,id: "100000" //消息的来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
  //         //   ,type: "friend" //聊天窗口来源类型，从发送消息传递的to里面获取
  //         //   ,content: "嗨，你好！本消息系离线消息。" //消息内容
  //         //   ,cid: 0 //消息id，可不传。除非你要对消息进行一些操作（如撤回）
  //         //   ,mine: false //是否我发送的消息，如果为true，则会显示在右方
  //         //   ,fromid: "100000" //消息的发送者id（比如群组中的某个消息发送者），可用于自动解决浏览器多窗口时的一些问题
  //         //   ,timestamp: 1467475443306 //服务端时间戳毫秒数。注意：如果你返回的是标准的 unix 时间戳，记得要 *1000
  //         // }
  //       }
  //     };
  //   });
  // },
  methods: {
     init(){
        var url = this.$urlPrefix+'/orderDetail'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token,
          id:this.orderId
        }
        this.$http.post(url,data).then(function(response){
            var result = response.body.data
            if(response.body.code==1){
               this.totalData = result
               if(result.status==0){
                  this.getOrderTime()
               }
               if(result.pay_prove){
                  this.payUrl = result.url+result.pay_prove
                  this.$previewRefresh()
               }
               var payArr = result.pay
               var _this = this
               if(payArr){
                  payArr.forEach(function(val,index){
                     if(val.type==1){
                        _this.weiImg = result.url+JSON.parse(val.content).url
                     }else if(val.type==2){
                        _this.aliImg = result.url+JSON.parse(val.content).url
                     }
                  })
               }
            }
        })
     },
     getOrderTime(){
        var url = this.$urlPrefix+'/getOrderTime'
        var data={
          _ajax:1,
          id:this.orderId
        }
        this.$http.post(url,data).then(function(response){
          var _this = this
          if(response.body.code==1){
            var result = response.body.data
            this.timers = window.setInterval(()=>{
                if(result>0){
                  _this.timer = _this.timeFilter(result)
                  result--;
                }else{
                  _this.cancle(_this.orderId)
                  window.clearInterval(_this.timers);
                }
            },1000)
          }
        })
     },
     timeFilter(secondTime){
        var minuteTime = 0;// 分
        var hourTime = 0;// 小时
        var result;
        if(secondTime > 60) {
          //分钟
          minuteTime = parseInt(secondTime / 60);
          //秒
          secondTime = parseInt(secondTime % 60);
        }
        if(minuteTime>0){
          result = minuteTime +"分" + secondTime + "秒";
        }else{
          result = secondTime + "秒";
        }
        return result;
     },
     showCode(val){
        this.codeShow = true
        if(val==1){
            this.codeUrl = this.weiImg
        }else{
            this.codeUrl = this.aliImg
        }
     },
     payCredence(){
        this.dealCredence=true
     },
     uploadSuccess(res, file){
       this.payUrl = URL.createObjectURL(file.raw);
       this.callbackUrl = res
       this.$message({
         message: '上传成功',
         type: 'success'
       });
     },
     beforeImgUpload(file) {
       const isLt2M = file.size / 1024 / 1024 < 2;
       if (!isLt2M) {
         this.$message.error('上传头像图片大小不能超过 2MB!');
       }
       return isLt2M;
     },
     payCredenceSubmit(id){
       if(this.callbackUrl==''){
           this.$message({
             message: '请上传支付凭证',
             type: 'error'
           });
           return false;
        }
        var url = this.$urlPrefix+'/frenchPay'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token,
          id:id,
          pay_prove:this.callbackUrl
        }
        this.$http.post(url,data).then(function(response){
            var _this = this
            if(response.body.code==1){
               this.$message({
                 message: response.body.msg,
                 type: 'success',
                 onClose:function(){
                    _this.dealCredence=false
                    _this.init()
                 }
               });
            }else{
               callback.callback(this,response.body)
            }
        })
     },
     cancleOrder(id){
        this.$confirm('确认要取消该订单吗?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          center: true
        }).then(() => {
          this.cancle(id);
        })
     },
     cancle(id){
        var url = this.$urlPrefix+'/frenchCancel'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token,
          id:id
        }
        this.$http.post(url,data).then(function(response){
            if(response.body.code==1){
               this.$message({
                 message: response.body.msg,
                 type: 'success'
               });
               this.init()
            }else{
               callback.callback(this,response.body)
            }
        })
     },
     confirmOrder(id){
        this.$prompt('请输入交易密码', '收款确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputType:'password',
          inputErrorMessage: '密码不能为空'
        }).then(({ value }) => {
          this.confirmGetMoney(value)
        }).catch(() => {
                 
        });
        this.confirmId = id 
     },
     confirmGetMoney(value){
        var url = this.$urlPrefix+'/frenchCollect'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token,
          id:this.confirmId,
          pay_pwd:value
        }
        this.$http.post(url,data).then(function(response){
            if(response.body.code==1){
               this.$message({
                 message: response.body.msg,
                 type: 'success'
               });
               this.init()
            }else{
              callback.callback(this,response.body)
            }
        })
     }
  },
  watch:{
     dealCredence(val){
        if(!val){
           this.payUrl = ''
        }
     }
  },
  destroyed(){
    window.clearInterval(this.timers);
  }
}
</script>

<style lang="less">
    .orderDetail_contain{
        width: 100%;
        min-height: 870px;
        background-color: #fbfbfb;
        overflow: hidden;
        .el-dialog{
            width: 600px;
            .el-dialog__body{
              .pass{
                 margin:30px 0;
                 height: 30px;
                 line-height: 30px;
                 span{
                   font-size:15px;
                   font-weight: 700;
                 }
                 input{
                   width: 250px;
                   height: 100%;
                   padding-left:10px;
                   border:1px solid #ccc;
                 }
              }
              >.btn{
                border: 0;
                outline: 0;
                width: 50%;
                font-size: 16px;
                font-weight: 700;
                height: 36px;
                background-color: #00b275;
                margin: 26px 0 26px 20px;
              }
            }
        }
        .content{
            width:900px;
            height: 100%;
            margin:0 auto;
            padding-top:70px;
            text-align: left;
            h1{
                font-size:28px;
                line-height: 70px;
            }
            .price{
                font-size:16px;
                color:#333;
                font-weight: 700;
                line-height: 30px;
                span{
                    font-size:16px;
                    color:#333;
                    font-weight: 700;
                    margin-right: 20px;
                }
                .rmb{
                    color:#00b275;
                }
            }
            .title{
                margin:30px 0 20px;
                display: flex;
                font-size:14px;
                .el-icon-caret-right{
                    color:#EB6424;
                    margin-right: 4px;
                }
                .line{
                    flex:1;
                    height: 1px;
                    background-color: #ccc;
                    margin: 8px 0 0 6px;
                }
            }
            .payType{
                .item{
                    line-height: 30px;
                    font-size:15px;
                    padding-left:30px;
                    i{
                      color:#ffb900;
                      font-size:16px;
                    }
                    span{
                      margin-left:20px;
                    }
                    .img{
                        width: 20px;
                        height: 20px;
                        margin:0 10px;
                        vertical-align: middle;
                        margin-bottom: 3px;
                        padding:1px;
                        border-radius: 4px;
                        &:last-of-type{
                          margin:0 0 0 10px;
                        }
                    }
                    .code{
                        cursor: pointer;
                    }
                    .payStatus{
                        padding:2px 4px;
                        color:#fff;
                        font-size:14px;
                    }
                    .payDone{
                        background-color: #1FB028;
                    }
                    .complete{
                        background-color: #EB6424;
                    }
                    .cancle{
                        background-color: #e45555;
                    }
                    .wait{
                        background-color: orange;
                    }
                    a{
                       margin-left:10px;
                       color:#2693FF;
                       &:hover{
                          text-decoration: underline;
                       }
                    }
                }
            }
            .status{
                margin-top: 40px;
                font-size:18px;
                font-weight: 700;
                color:#555;
                span{
                    font-weight: 700;
                }
                .time{
                    color:#f40;
                }
            }
            .payBtn{
                width: 200px;
                height: 60px;
                background-color: #00b275;
                margin-top: 40px;
                border-radius: 2px;
                color:#fff;
                font-size:18px;
                &:hover{
                    opacity:0.7;
                }
            }
            .cancleDeal{
                color:#2693FF;
                margin-top: 30px;
                &:hover{
                    text-decoration: underline;
                }
            }
            .payVoucher{
               padding: 20px 0 0 30px;
               #payUrl{
                 width: 178px;
                 // height: 238px;
                 margin:0 auto;
                 border-radius: 5px;
               }
            }
        }
        .code{
            img{
                width: 300px;
                height: 300px;
                margin:30px 0 50px;
            }
        }
        .avatar-uploader{
            width: 180px;
            height: 240px;
            text-align: center;
            line-height: 240px;
            margin:0 auto;
            border:1px dashed #ccc;
            border-radius: 4px;
            &:hover{
                border-color:#2693FF;
            }
            .el-upload{
                width: 100%;
                height: 100%;
                img{
                    width: 100%;
                    height: 100%;
                    margin:0;
                }
                i{
                    font-size:20px;
                }
            }
        }
    }
</style>