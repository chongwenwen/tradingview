<template>
    <div class="loginLog_container">
        <div class="top">
            <h1>{{$t('localization.login-log')}}：
                <router-link to="/my/personal">
                  <i class="el-icon-back"></i> {{$t('localization.back')}}
                </router-link>
            </h1>
        </div>
        <div class="list">
            <el-table
                :data="loginLogData"
                tooltip-effect="dark"
                style="width: 100%"
                v-loading="fullscreenLoading">
                <el-table-column
                  :label="$t('localization.login-time')">
                  <template slot-scope="scope">
                    <span style="margin-left: 4px;">{{ scope.row.login_time }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('localization.login-ip')">
                  <template slot-scope="scope">
                    <span style="margin-left: 4px;">{{ scope.row.ip }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('localization.equipment')">
                  <template slot-scope="scope">
                    <span style="margin-left: 4px;">{{ scope.row.equipment }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('localization.Location-ip')">
                  <template slot-scope="scope">
                    <span style="margin-left: 4px;">{{ scope.row.address }}</span>
                  </template>
                </el-table-column>
            </el-table>
            <el-pagination
              v-if="totalPage>1"
              @current-change="logCurrentChange"
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
            loginLogData:[],
            totalData:0,
            fullscreenLoading:false
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
          var url = this.$urlPrefix+'/loginLog'
          var token = localStorage.getItem('token')
          var data={
            _ajax:1,
            toKey:token,
            page:this.currentPage
          }
          this.$http.post(url,data).then(function(response){
             if(response.body.code==1){
                this.fullscreenLoading = false
                this.loginLogData = response.body.data.data
                this.totalPage = response.body.data.last_page
                this.pageSize = response.body.data.per_page
                this.totalData = response.body.data.total
             }
          })
       },
       logCurrentChange(val) {
         this.currentPage = val
         this.fullscreenLoading = true
         this.init();
       },
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
               a{
                  color:#52cbca;
                  font-size:16px;
                  float:right;
                  &:hover{
                    text-decoration: underline;
                  }
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