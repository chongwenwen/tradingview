<template>
    <div class="loginLog_container">
        <div class="top">
            <h1>{{ $t('localization.Message-record') }}：
                <el-button type="danger" v-if="newsList.length>0" class="delete" round plain @click="delAll(2)">{{ $t('localization.Delete-all') }}</el-button>
                <p @click="allRead" v-if="newsList.length>0">{{ $t('localization.All-read') }}</p>
            </h1>
        </div>
        <div class="list">
            <el-table
                :data="newsList"
                tooltip-effect="dark"
                style="width: 100%"
                v-loading="fullscreenLoading">
                <el-table-column
                  :label="$t('localization.Order-number')">
                  <template slot-scope="scope">
                    <el-badge is-dot class="look" v-if="scope.row.status==0"></el-badge>
                    <span class="look" @click="readNews(scope.row.id,scope.row.event_id)">
                      {{ scope.row.event_msg }}
                      <i class="el-icon-right"></i>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('localization.title')">
                  <template slot-scope="scope">
                    <span>{{ scope.row.type }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('localization.content')">
                  <template slot-scope="scope">
                    <span>{{ scope.row.event_content }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('localization.Time')">
                  <template slot-scope="scope">
                    <span>{{ scope.row.time }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  width="150"
                  :label="$t('localization.Operation')">
                  <template slot-scope="scope">
                    <el-button 
                      type="danger" 
                      size="mini" 
                      plain
                      icon="el-icon-delete" 
                      circle 
                      @click="delCurrent(1,scope.row.id)">
                    </el-button>
                  </template>
                </el-table-column>
            </el-table>
            <el-pagination
              v-if="totalPage>1"
              @current-change="currentChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next, jumper"
              :total="totalData"
              :prev-text="$t('localization.Previous-page')"
              :next-text="$t('localization.next-page')">
            </el-pagination>
        </div>
    </div>
</template>

<script>
var token = localStorage.getItem('token');
export default{
    
    data(){
        return{
            currentPage:1,
            totalPage:0,
            pageSize:0,
            newsList:[],
            totalData:0,
            fullscreenLoading:false
        }
    },
    created(){
        this.init()
        //socket返回新消息
        this.$bus.$on('newMessage',(data) => {
          this.newsList.unshift(data)
        });
    },
    methods:{
        /**
        * 获取消息列表
        */
        init(){
          this.fullscreenLoading = true
          var url = this.$urlPrefix+'/messageList'
          var token = localStorage.getItem('token')
          var data={
            _ajax:1,
            toKey:token,
            page:this.currentPage
          }
          this.$http.post(url,data).then(function(response){
             if(response.body.code==1){
                this.fullscreenLoading = false
                var result = response.body.data
                this.newsList = result.data
                this.totalPage = result.last_page
                this.pageSize = result.per_page
                this.totalData = result.total
             }
          })
        },
        /**
        * 阅读消息
        */
        readNews(readId,detailId){
          var url = this.$urlPrefix+'/messageRead'
          var data={
            _ajax:1,
            id:readId
          }
          this.$http.post(url,data).then(function(response){
             var result = response.body
             // 跳转详情页
             if(response.body.code==1){
                this.$router.push({
                  path:'/orderDetail',
                  query:{
                    id:detailId
                  }
                })
                this.$bus.$emit('readNews','');
             }
          })
        },
        //单个删除
        delCurrent(type,id){
            this.$confirm(this.$t('localization.Delete-tips-l'), this.$t('localization.Delete-tips'), {
              confirmButtonText: this.$t('localization.Delete'),
              cancelButtonText: this.$t('localization.Cancle'),
              type: 'warning',
              center: true
            }).then(() => {
              this.deleteNews(type,id)
            })
        },
        //全部删除
        delAll(type){
            this.$confirm(this.$t('localization.Delete-tips-all'), this.$t('localization.Delete-tips'), {
                confirmButtonText: this.$t('localization.Delete'),
                cancelButtonText: this.$t('localization.Cancle'),
                type: 'warning',
                center: true
            }).then(() => {
                var url = this.$urlPrefix+'/messageDel'
                var token = localStorage.getItem('token')
                var data={
                  _ajax:1,
                  toKey:token,
                  type_del:type
                }
                this.$http.post(url,data).then((res)=>{
                  if(res.data.code==1){
                      this.init()
                      this.$bus.$emit('readNews','');
                  }
                })
            })
        },
        deleteNews(type,id){
          var url = this.$urlPrefix+'/messageDel'
          var token = localStorage.getItem('token')
          var data={
            _ajax:1,
            toKey:token,
            type_del:type,
            id:id
          }
          this.$http.post(url,data).then((res)=>{
            if(res.data.code==1){
                this.init()
                this.$bus.$emit('readNews','');
            }
          })
        },
        //全部已读
        allRead(){
            var url = this.$urlPrefix+'/allRead'
            var token = localStorage.getItem('token')
            var data={
              _ajax:1,
              toKey:token
            }
            this.$http.post(url,data).then((res)=>{
              if(res.data.code==1){
                  this.init()
                  this.$bus.$emit('readNews','');
              }
            })
        },
        currentChange(val) {
          this.currentPage = val
          this.init();
        }
    }
}
</script>

<style lang="less">
    .loginLog_container{
        width: 1200px;
        margin:40px auto;
        overflow: hidden;
        .top{
            padding:30px;
            background-color: #fff;
            text-align: left;
            box-shadow: 0 0 20px 0 #ececec;
            overflow: hidden;
            margin-bottom: 10px;
            h1{
               font-size:20px;
               line-height: 28px;
               p{
                  color:#52cbca;
                  font-size:14px;
                  float:right;
                  cursor: pointer;
                  &:hover{
                    text-decoration: underline;
                  }
               }
               .el-button{
                  float:right;
                  padding:6px 10px;
                  margin-left: 20px;
               }
            }
        }
        .list{
            padding:30px;
            min-height: 600px;
            background-color: #fff;
            box-shadow: 0 0 20px 0 #ececec;
            display: flex;
            flex-flow:column;
            overflow: hidden;
            .el-table{
                flex:1;
                display: flex;
                flex-flow:column;
                .el-table__body-wrapper{
                    flex:1;
                    display: flex;
                    flex-flow:column;
                    .el-table__empty-block{
                       flex:1;
                    }
                }
                .cell{
                    padding:0;
                    position:relative;
                   .look{
                      color:#00c1ce;
                      cursor: pointer;
                      &:hover{
                        text-decoration: underline;
                      }
                   }
                   .el-badge{
                     position: absolute;
                     top:0;
                     left:13px;
                   }
                }
                .el-button{
                   padding:5px;
                }
            }
            .el-pagination{
                width: 100%;
                height: 40px;
                margin-top: 30px;
                text-align: right;
            }
        }
    }
</style>