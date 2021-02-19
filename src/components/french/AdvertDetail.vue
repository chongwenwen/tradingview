<template>
    <div class="advertDetail" style="padding:10px 10px 0;">
      <div class="top">
         <div class="ft">
           <p>
              <span class="title">状态：</span>
              {{detailData.status}}
           </p>
           <p>
              <span class="title">广告类型：</span>
              {{detailData.type}}
           </p>
           <p>
            <span class="title">
              成交数量：
              </span>{{detailData.deal_number}}
           </p>
           <p>
              <span class="title">
                退回数量：
              </span>{{detailData.revoke_number}}
           </p>
         </div>
         <div class="ft">
           <p>
             <span class="title">
                单价：
             </span>{{detailData.price}}
           </p>
           <p>
              <span class="title">
                挂单总数量：
              </span>{{detailData.number}}
           </p>
           <p>
              <span class="title">
                剩余数量：
              </span>{{detailData.nodeal_number}}
           </p>
           <p v-if="detailData.status=='进行中'">
              <a href="javascript:;" @click="revokeAdvert">撤销广告</a>
           </p>
         </div>
      </div>
      <div class="dealLog">
        <div class="title">
          <span></span>交易日志
        </div>
        <div class="content" v-loading="fullscreenLoading">
          <el-table
            :data="dealLogData"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              label="子订单号">
              <template slot-scope="scope">
                <router-link :to="{path: '/orderDetail', query: {id:scope.row.id}}">{{ scope.row.order_number }}</router-link>
              </template>
            </el-table-column>
            <el-table-column
              label="昵称">
              <template slot-scope="scope">
                <span style="margin-left: 4px;">{{ scope.row.nickname }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="成交量">
              <template slot-scope="scope">
                <span style="margin-left: 4px;">{{ scope.row.number }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="成交单价">
              <template slot-scope="scope">
                <span style="margin-left: 4px;">{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="成交金额">
              <template slot-scope="scope">
                <span style="margin-left: 4px;">{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status==0">
                  <img src="../../assets/timer.png">待支付
                </span>
                <span v-if="scope.row.status==1">
                  <img src="../../assets/complete.png">已支付
                </span>
                <span v-if="scope.row.status==2">
                  <img src="../../assets/cancle.png">已取消
                </span>
                <span v-if="scope.row.status==3">
                  <img src="../../assets/money.png">已收款
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="时间">
              <template slot-scope="scope">
                <span>{{ scope.row.order_time }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="dealLogPage>1"
            @current-change="dealLogCurrentChange"
            :current-page.sync="dealLogCurrentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="dealLogTotalCount"
            prev-text='上一页'
            next-text='下一页'>
          </el-pagination>
        </div>
      </div>
    </div>
</template>
<script type="text/javascript">
export default{
    data(){
        return{
          detailId:'',
          dealLogCurrentPage:1,
          dealLogPage:0,
          pageSize:0,
          detailData:{},
          dealLogData:[],
          fullscreenLoading:false,
          dealLogTotalCount:0,
        }
    },
    created(){
        if(this.$route.query.id){
           this.detailId = this.$route.query.id
           this.advertDetailInfo()
           this.advertDetailList()
        } 
    },
    methods:{
        advertDetailInfo(){
          var url = this.$urlPrefix+'/getReleaseDetail'
          var token = localStorage.getItem('token')
          var data={
            _ajax:1,
            toKey:token,
            id:this.detailId
          }
          this.$http.post(url,data).then(function(response){
             var result = response.body.data
             if(response.body.code==1){
              this.detailData = result
             }
          })
        },
        advertDetailList(){
          var url = this.$urlPrefix+'/myReleaseOrder'
          var token = localStorage.getItem('token')
          var data={
            _ajax:1,
            toKey:token,
            id:this.detailId,
            page:this.dealLogCurrentPage
          }
          this.$http.post(url,data).then(function(response){
             var result = response.body.data
             if(response.body.code==1){
              this.fullscreenLoading = false
              this.dealLogData = result.data
              this.dealLogPage = result.last_page
              this.pageSize = result.per_page
              this.dealLogTotalCount = result.total
             }
          })
        },
        revokeAdvert(){
          this.$confirm('确认要撤销该条广告吗?', '撤销提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.cancle()
          }).catch(() => {
            
          });
        },
        cancle(){
          var url = this.$urlPrefix+'/frenchRevoke'
          var token = localStorage.getItem('token')
          var data={
            _ajax:1,
            toKey:token,
            id:this.detailId
          }
          this.$http.post(url,data).then(function(response){
             if(response.body.code==1){
                this.$message({
                  message: response.body.msg,
                  type: 'success'
                });
                this.advertDetailInfo()
                this.advertDetailList()
             }else{
                this.$message({
                  message: response.body.msg,
                  type: 'error'
                });
             }
          })
        },
        dealLogCurrentChange(val) {
          this.dealLogCurrentPage = val
          this.fullscreenLoading = true
          this.advertDetailList()
        }
    }
}
</script>
<style lang='less'>
.advertDetail{
    max-width:1400px;
    min-width: 1200px;
    height: 100%;
    margin:30px auto;
    background-color: #fff;
    .top{
      width: 100%;
      padding: 0 10px 10px;
      text-align: left;
      font-size:15px;
      border-bottom: 1px solid #52cbca;
      overflow: hidden;
      p{
         line-height: 38px;
         .title{
            font-weight: 700;
         }
         a{
           color:#e45555;
           &:hover{
             text-decoration: underline;
           }
         }
         img{
           width: 16px;
           height: 16px;
           vertical-align: middle;
           margin-bottom: 3px;
         }
      }
      .ft{
         width: 300px;
      }
    }
    .dealLog{
       text-align: left;
      .title{
        height: 50px;
        line-height: 50px;
        padding:0 10px;
        font-size:15px;
        overflow: hidden;
        span{
           display: inline-block;
           width: 4px;
           height: 16px;
           background-color: #00c1ce;
           margin:0 8px -3px 0;
        }
      }
      .content{
        overflow: hidden;
        padding:10px 0 20px;
        .el-table{
           .el-table__body-wrapper,.el-table__empty-block{
              min-height: 420px;
           }
           td{
             padding:11px 0;
             img{
               width: 16px;
               height: 16px;
               vertical-align: middle;
               margin-right: 6px;
               margin-bottom: 2px;
             }
             a{
               &:hover{
                  text-decoration: underline;
               }
             }
           }
        }
        .el-pagination{
            float:right;
            margin-top: 10px;
        } 
      }

    }
}
</style>