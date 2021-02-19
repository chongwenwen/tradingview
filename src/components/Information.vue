<template>
    <div class="information_con">
        <div class="banner"></div>
        <ul class="content" v-loading="fullscreenLoading">
            <li v-for="(item,index) in noticeList" :key="index">
              <router-link :to="{path:'/infoDetail',query:{id:item.id}}" class="ft">{{item.title}}</router-link>
              <div class="gt">{{item.create_time}}</div>
            </li>
        </ul>
        <el-pagination
          v-if="totalPage>1"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="totalCount"
          prev-text='上一页'
          next-text='下一页'>
        </el-pagination>
    </div>
</template>

<script>
export default{
    name:'Information',
    data(){
        return{
           totalPage:0,
           currentPage:1,
           pageSize:0,
           totalCount:0,
           fullscreenLoading:false,
           noticeList:[]
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
            this.fullscreenLoading = true
            var url = this.$urlPrefix+'/noticeList'
            var data={
              _ajax:1
            }
            this.$http.post(url,data).then(function(response){
               var result = response.body.data
               if(response.body.code==1){
                  this.fullscreenLoading = false
                  this.noticeList = result.data
                  this.totalCount = result.total
                  this.totalPage = result.last_page
                  this.pageSize = result.per_page
               }
            })
        },
        handleCurrentChange(val) {
          this.currentPage = val
          this.init()
        }
    }
}
</script>

<style lang="less">
    .information_con{
       width: 100%;
       position:relative;
       margin-bottom: 20px;
       .banner{
         font-size:42px;
         width: 100%;
         height: 300px;
         color:#fff;
         line-height: 220px;
         background-image: url('../assets/index/zixun.jpg');
         background-position: bottom center;
       }
       .content{
          width: 1200px;
          margin:-120px auto 0;
          padding:45px 130px;
          min-height: 650px;
          background-color: #fff;
          box-shadow: 0 4px 6px 0 #eee;
          li{
            font-size:14px;
            height: 50px;
            line-height: 50px;
            border-bottom: 1px solid #ddd;
            .gt{
               color:#6f6f6f;
               font-size:12px;
            }
            a{
              color:#192330;
              &:hover{
                 color:#00c1ce;
              }
            }
          }
       }
       .el-pagination{
          position:absolute;
          left:50%;
          transform:translateX(-50%);
          bottom:20px;
       }
    }
</style>