<template>
  <div id="app"  v-cloak>
    <!-- 公共头部 -->
    <commonHead :isLogin="islogin" :languageShow="languageShow"></commonHead>
    <div class="common_content">
      <router-view/>
    </div>
    <!-- 公共底部 -->
    <div class="common_footer">
       <div class="content">
          <router-link to="/" class="logo">
             <img src="./assets/logo.jpg">
          </router-link>
          <p>{{$t('localization.Australian-text')}}</p>
       </div>
    </div>
  </div>
</template>

<script>
import socket from '../static/datafeeds/socket.js'
import commonHead from './components/commonHead.vue';
export default {
  components:{
    commonHead
  },
  name: 'App',
  data() {
    return {
      islogin:false,
      token:'',
      languageShow:true,
      socket:null
    }
  },
  created(){
    this.checkEquipment()
    this.checkToken();
    this.initSocket()
  },
  mounted(){
    this.init()
    this.change(this.$route.path)
    if(this.$route.path!='/login' 
      && this.$route.path!='/register' 
      &&this.$route.path!='/forgetPass'){
       localStorage.setItem('router',this.$route.path)
    }
    //用户登录
    this.$bus.$on('socketLogin',() => {
      var data={
        cmd:'login',
        mobile:localStorage.getItem('userPhone')
      }
      this.sendMessage(data)
    });
    //发送k线数据
    this.$bus.$on('klineData',(data) => {
      this.sendMessage(data)
    });
  },
  updated(){ 
    $(window).scrollTop(0);
    this.checkToken();
    //监听页面向上滚动
    $(window).scroll(function(event){
       var winPos = $(window).scrollTop();
       if(winPos>140){
         $('.common_head').addClass('scroll')
       }else{
         $('.common_head').removeClass('scroll')
       }
    });
    // this.$nextTick(function () {
      
    // })
  },
  methods:{
      /*
       初始化websoket
      */ 
      initSocket(){
        var _this = this
        this.socket = new socket(this.$urlWebsoket)
        this.socket.doOpen()
        this.socket.on('open', () => {
          
        })
        this.socket.on('message', this.onMessage)
      },
      /*
        初始化高度
      */
      init(){
        var bodyHeight = $(window).height();
        $('body').css('min-height',bodyHeight)
        $('#app').css('min-height',bodyHeight)
        $('.common_content').css('min-height',bodyHeight)
      },
      /*
        给websoket发送数据
      */
      sendMessage(data) {
        if (this.socket.checkOpen()) {
          this.socket.send(data)
        } else {
          this.socket.on('open', () => {
            this.socket.send(data)
          })
        }
      },
      /**
      * socket接收实时数据
      */
      onMessage(data){
        // console.log(data)
        if(data.type=='messageCount'){
          //新消息
          this.$bus.$emit('messageCount',data.message);
          this.$notify.info({
            title: '您有一条新订单，请在消息中心查看！',
            duration: 2000
          });
        }else if(data.type=='newMessage'){
          this.$bus.$emit('newMessage',data.list);
        }else{
          //给其他页面发送socket数据
          this.$bus.$emit('soketData',data);
        }
      },
      /*
       判断设备
      */ 
      checkEquipment(){
        var theUA = window.navigator.userAgent.toLowerCase();
        if ((theUA.match(/msie\s\d+/) && theUA.match(/msie\s\d+/)[0]) || (theUA.match(/trident\s?\d+/) && theUA.match(/trident\s?\d+/)[0])) {
            var ieVersion = theUA.match(/msie\s\d+/)[0].match(/\d+/)[0] || theUA.match(/trident\s?\d+/)[0];
            if (ieVersion < 10) {
                this.$router.push('/version')
            };
        }
      },
      /*
       检查登录态
      */
      checkToken(){
         this.token = localStorage.getItem('token')
         if(this.token){
           this.isOverdue(this.token)//检查token是否过期
         }else{
           this.islogin = false
         }
      },
      change(router){
        if(router=='/'
          ||router=='/login'
          ||router=='/register'
          ||router=='/forgetPass'
        ){
           $('.common_head').addClass('active')
           $('#app').removeClass('active')
           this.init()
        }else{
           $('.common_head').removeClass('active')
           $('#app').addClass('active')
        }
        
        if(router=='/login'
          || router=='/register' 
          || router=='/forgetPass'
        ){
          $('.common_footer').hide();
        }else{
          $('.common_footer').show();
        }

        if(router=='/my/personal'
          ||router=='/login'
          ||router=='/register'
          ||router=='/forgetPass'
          ||router=='/news'
        ){
          $('.common_head .el-menu-item').css({'border-bottom-color':'transparent','color':'rgb(102, 102, 102)'})
        }

        if(router=='/frenchCurrenry'
          ||router=='/advertDetail'
          ||router=='/orderList'
          ||router=='/orderDetail'
          ||router=='/advert'
        ){
          this.languageShow=false
        }else{
          this.languageShow=true
        }
      },
      isOverdue(token){
        var url = this.$urlPrefix+'/vLogin'
        var data={
          _ajax:1,
          toKey:token
        }
        this.$http.post(url,data).then(function(response){
           var result = response.body
           if(response.body.code==1){
              //没过期
              this.islogin = true
              var data={
                cmd:'login',
                mobile:localStorage.getItem('userPhone')
              }
              this.sendMessage(data)
           }else{
              //过期
              this.islogin = false
              if(this.$route.path=='/my/personal'){
                this.$router.push('/login')
              }
              if(this.socket){
                this.socket.destroy()
              }
           }
        })
      }
  },
  watch:{
     '$route.path':function(newRouter,oldRouter){
        this.change(newRouter)
        this.checkEquipment()
        if(oldRouter!='/login' && oldRouter!='/register' && oldRouter!='/forgetPass'){
           localStorage.setItem('router',oldRouter)
        }
     }
  },
  destroyed(){
    //关闭socket
    this.socket.destroy()
  }
}
</script>

<style lang="less">
@green1:#00c1ce;
@green2:#52cbca;
[v-cloak]{  
    display: none;  
} 
body{
  background-color: #f5f5f5;
}
#app {
  height: 100%;
  overflow: hidden;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #eee;
  &.active{
    padding-top:60px;
  }
  .common_head{
      z-index:10000;
      width: 100%;
      height: 60px;
      color:#fff;
      background-color: #fff;
      box-shadow: 0 0 10px 0 #dbd9dc;
      z-index:999;
      padding:0 30px;
      position:fixed;
      top:0;
      left:0;
      &.active{
        background-color: rgba(255,255,255,0.05);
        box-shadow: none;
        .container{
          .ft{
            .logo{
              color:#fff;
            }
            .el-menu{
               li{
                 a{
                   color:#fff;
                   &:hover{
                     background-color: transparent;
                   }
                 }
               }
            }
          }
          .el-dropdown{
             span{
               color:#fff;
               i{
                 color:#fff;
               }
             }
          }
        }
      }
      &.scroll{
        background-color: #fff;
        border-bottom:2px solid #00c1ce;
        .container{
          .logo{
            span{
              color:#333;
            }
          }
          .ft{
            .el-menu{
               li{
                 a{
                   color:#333;
                 }
               }
            }
          }
          .el-dropdown{
             span{
               color:#333;
               i{
                 color:#333;
               }
             }
          }
        }
      }
     .container{
        max-width: 1800px;
        min-width: 1200px;
        margin: 0 auto;
        height: 100%;
        justify-content: space-between;
        .ft{
          height: 100%;
          .logo{
             padding:0 40px 0 0;
             color:#000;
             font-weight: 700;
             line-height: 60px;
             img{
                 width: 40px;
                 height: 40px;
                 border-radius: 50%;
                 vertical-align: middle;
                 margin-right: 6px;
             }
          }
          .el-menu{
             background-color: transparent;
          }
          .el-menu--horizontal{
             height: 100%;
             &.is-active{
                border-bottom: 2px solid @green2;
             }
             .el-menu-item{
                height: 100%;
                line-height: 60px;
                a{
                  display:block;
                  height: 100%;
                  &:hover{
                     color:@green2;
                  }
                }

             }
             .el-submenu{
                height: 100%;
                line-height: 60px;
                .el-submenu__title{
                  height: 100%;
                  line-height: 60px;
                  a{
                     color:#666;
                  }
                }
                a{
                   text-align: center;
                }
             }
             .el-submenu.is-active {
                .el-submenu__title{
                  border-bottom: 0;
                }
             }
          }
        }
        .gt{
          height: 100%;
          .user{
            width: 20px;
            height: 20px;
            margin-top: 20px;
            margin-right: 10px;
          }
          .el-row{
            padding-top:15px;
            a{
              display: inline-block;
              width: 90px;
              height: 30px;
              &:first-of-type{
                margin-right: 10px;
              }
              .el-button--primary{
                width: 100%;
                height: 100%;
                padding:0;
                background: transparent;
                border:1px solid @green1;
                color:@green1;
                &:hover{
                  border:none;
                  color:#fff;
                  background-image: linear-gradient(270deg, #22e6b8, @green1);
                }
              }
              .el-button--warning{
                width: 100%;
                height: 100%;
                padding:0;
                background: transparent;
                border:1px solid #ffc21e;
                color:#ffc21e;
                &:hover{
                  border:none;
                  color:#fff;
                  background-image: linear-gradient(270deg, #ffe170, #ffb900);
                }
              }
            }
          }
          .language{
             float:right;
             height: 100%;
             line-height: 60px;
             img{
              width: 20px;
              height: 20px;
              vertical-align: middle;
              margin-bottom: 6px;
             }
             >i{
               color:#333;
             }
             .el-dropdown{
               border:0;
               outline:none;
               span{
                 font-size:16px;
                 font-weight: 700;
                 border:0;
                 outline:none;
                 cursor: pointer;
               }
               
             }
             .el-select{
                width: 105px;
                margin-top: 15px;
                margin-left: 20px;
                .el-input{
                   height: 26px;
                   line-height: 26px;
                   .el-input__inner,
                   .el-input__suffix,
                   .el-select__caret{
                      height: 100%;
                      line-height: 26px;
                      color:#fff;
                   }
                   .el-input__inner{
                      border-radius: 13px;
                      background: linear-gradient(270deg,#22e6b8,#00c1ce);
                      color:#fff;
                      fonr-size:12px;
                      border:0;
                   }
                   .el-input__suffix-inner{
                      display: inline-block;
                      height: 100%;
                      line-height: 30px;
                      .is-reverse{
                        border-color:@green1;
                      }
                   }
                   &.is-focus{
                     .el-input__inner{
                        border-color:@green1;
                     } 
                   }
                   .el-input__inner:focus{
                      border-color:@green1;
                   }
                }
             }
          }
        }
     }
  }
  .common_content{
    width: 100%;
    overflow: hidden;
  }
  .common_footer{
    width: 100%;
    height: 200px;
    background-color: #212a35;
    display: flex;
    flex-flow:column;
    border-top:3px solid #00b275;
    .content{
      width: 100%;
      min-width: 1200px;
      height: 194px;
      margin:0 auto;
      padding:22px 70px 12px;
      color:#9b9b9b;
      .logo{ 
        display: block;
        overflow: hidden;
        padding-top:30px;
        img{
          width: 50px;
          height: 50px;
        }
      }
      p{
        font-size:16px;
        margin-top: 20px;
      }
      .coin{
        height: 100%;
        max-width: 60%;
        display: flex;
        flex-flow:column;
      }
    }
  }
}
</style>
