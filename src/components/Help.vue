<template>
    <div class="help_container" v-loading.fullscreen.lock="fullscreenLoading">
        <div class="banner">
            <div class="search">
                <i class="el-icon el-icon-search"></i>
                <input type="text" placeholder="搜索" />
            </div>
        </div>
        <div class="content">
            <div class="section">
                <div class="title">法币交易</div>
                <ul class="item_con">
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    data(){
        return{
           fullscreenLoading:false
        }
    },
    created(){
        // this.init()
    },
    methods:{
        init(){
            // var url = this.$urlPrefix+'/frenchConfig'
            // var token = localStorage.getItem('token')
            // var data={
            //   _ajax:1,
            //   toKey:token
            // }
            // this.$http.post(url,data).then(function(response){
            //    var result = response.body.data
            //    if(response.body.code==1){
            //       this.payType = result.pay_type
            //       this.exchangeRate = result.ZTU
            //       this.COIN1 = result.coin1
            //       this.totalCoin1 = result.number
            //    }
            // })
        },
    }
}
</script>

<style lang="less">
    .help_container{
       width: 100%;
       position:relative;
       background-color: #fff;
       .banner{
         font-size:42px;
         width: 100%;
         height: 300px;
         color:#fff;
         line-height: 220px;
         background-image: linear-gradient(270deg,#22e6b8,#00c1ce);
         position:relative;
         .search{
            width: 610px;
            height: 40px;
            border-radius: 30px;
            color: #999;
            background-color: #fff;
            display: flex;
            position:absolute;
            left:50%;
            top:50%;
            transform:translate(-50%,-50%);
            i{
              flex:1;
              font-size:22px;
              margin:9px 0;
            }
            input{
               flex:9;
               height: 100%;
               float:right; 
               padding: 0 20px 0 0;
               font-size:16px;
               background-color: transparent;
            }
         }
       }
       .content{
          width: 1200px;
          margin:0 auto;
          min-height: 750px;
          .section{
             margin-top: 20px;
             .title{
                  padding:10px 0;
                  font-size:32px;
                  color:#333;
                  font-weight: bold;
              }
              .item_con{
                  display: flex;
                  li{
                    flex:1;
                    height:200px;
                    background-color: pink;
                    margin-right: 40px;
                    &:last-of-type{
                      margin-right: 0;
                    }
                  }
              }
          }
       }
    }
</style>