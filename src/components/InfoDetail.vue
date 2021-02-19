<template>
    <div class="inforDetail_con">
        <div class="banner"></div>
        <div class="content" v-loading="fullscreenLoading">
            <router-link class="back" to="/information"><< 资讯列表</router-link>
            <div class="title">
              <h1>{{detailInfo.title}}</h1>
              <p class="time">{{detailInfo.create_time}}</p>
            </div>
            <div class="detail" v-html='detailInfo.content'>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    name:'Information',
    data(){
        return{
           infoId:'',
           fullscreenLoading:false,
           detailInfo:{}
        }
    },
    created(){
        this.infoId = this.$route.query.id
        this.init()
    },
    methods:{
        init(){
            this.fullscreenLoading = true
            var url = this.$urlPrefix+'/noticeInfo'
            var data={
              _ajax:1,
              id:this.infoId
            }
            this.$http.post(url,data).then(function(response){
               var result = response.body.data
               if(response.body.code==1){
                  this.fullscreenLoading = false
                  this.detailInfo = result
               }
            })
        }
    }
}
</script>

<style lang="less">
    .inforDetail_con{
       width: 100%;
       position:relative;
       margin-bottom: 20px;
       .banner{
         font-size:42px;
         width: 100%;
         height: 200px;
         color:#fff;
         line-height: 220px;
         background-image: linear-gradient(270deg,#22e6b8,#00c1ce);
       }
       .content{
          width: 1200px;
          margin:-120px auto 0;
          padding:45px 130px;
          min-height: 750px;
          background-color: #fff;
          box-shadow: 0 4px 6px 0 #eee;
          overflow: hidden;
          .back{
             float:left;
             font-size:14px;
             color:rgb(82, 203, 202);
             &:hover{
               text-decoration: underline;
             }
          }
          .title{
              padding:30px 0 15px;
              h1{
                 font-size:24px;
                 color:#666;
              }
              .time{
                 padding-top:15px;
                 color:#6f6f6f;
                 font-size:12px;
                 text-align: right;
              }
          }
          .detail{
             text-align: left;
             font-size:14px;
             padding:30px 0 45px;
             border-top: 1px solid #ddd;
             .sayHello,.tip{
                line-height: 40px;
             }
             .item{
                margin-top: 16px;
                h3{
                   font-weight: 700;
                   line-height: 18px;
                   padding:2px 0;
                }
                p{
                  line-height: 19px;
                }
             }
          }
       }
    }
</style>