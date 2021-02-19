<template>
    <div class="order_container">
        <div class="title">订单列表</div>
        <div class="search">
            <div class="item_list">
              <span>发布类型：</span> 
              <el-radio-group v-model="orderType">
                <el-radio :label="0">全部</el-radio>
                <el-radio :label="2">购买</el-radio>
                <el-radio :label="1">出售</el-radio>
              </el-radio-group>
            </div>
            <div class="item_list">
              <span>订单状态：</span> 
              <el-radio-group v-model="orderStatus">
                <el-radio :label="99">全部</el-radio>
                <el-radio :label="0">待支付</el-radio>
                <el-radio :label="1">已支付</el-radio>
                <el-radio :label="2">已取消</el-radio>
                <el-radio :label="3">已收款</el-radio>
              </el-radio-group>
            </div>
        </div>
        <el-table
          :data="totalData"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="fullscreenLoading">
          <el-table-column
            label="下单时间">
            <template slot-scope="scope">
              <span>{{scope.row.order_time}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="数量">
            <template slot-scope="scope">
              <span>{{ scope.row.number }}</span>
              <!-- <p>BTC</p> -->
            </template>
          </el-table-column>
          <el-table-column
            label="单价">
            <template slot-scope="scope">
              <span>{{ scope.row.price }}</span>
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
            label="类型">
            <template slot-scope="scope">
              <span style="color:#f4b126;" v-if="scope.row.type=='1'">购买</span>
              <span style="color:#00b275;" v-if="scope.row.type=='2'">出售</span>
            </template>
          </el-table-column>
          <el-table-column
              label="操作"
              width="200">
              <template slot-scope="scope">
                <a href="javascript:;" @click="toOrderDetail(scope.row.id)">详情</a>
              </template>
            </el-table-column>
        </el-table>
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
    data(){
        return{
          fullscreenLoading:false,
          totalData:[],
          orderType:0,
          pageSize:0,
          totalCount:0,
          orderStatus:99,
          currentPage:1,
          totalPage:0
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
            var url = this.$urlPrefix+'/myFrenchOrder'
            var token = localStorage.getItem('token')
            var data={
              _ajax:1,
              toKey:token,
              type:this.orderType,
              status:this.orderStatus,
              page:this.currentPage
            }
            this.$http.post(url,data).then(function(response){
               var result = response.body.data
               if(response.body.code==1){
                  this.fullscreenLoading = false
                  this.totalPage = result.last_page
                  this.totalData = result.data
                  this.totalCount = result.total
                  this.pageSize = result.per_page
               }else{
                  this.$message({
                    message: response.body.msg,
                    type: 'error'
                  });
                  this.fullscreenLoading = false;
               }
            })
        },
        handleCurrentChange(val) {
          this.currentPage = val
          this.fullscreenLoading = true
          this.init()
        },
        toOrderDetail(id){
          this.$router.push({
            path:'/orderDetail',
            query:{id:id}
          })
        }
    },
    watch:{
        orderType:function(val){
          this.orderType = val
          this.fullscreenLoading = true
          this.init()
        },
        orderStatus:function(val){
          this.orderStatus = val
          this.fullscreenLoading = true
          this.init()
        }
    }
}
</script>
<style lang='less'>
    .order_container{
        max-width:1200px;
        min-height: 800px;
        margin:30px auto;
        display: flex;
        flex-flow:column;
        .title{
            width: 100%;
            height: 50px;
            text-align: center;
            font-size:20px;
            background-color: #fff;
            line-height: 50px;
            background-image: linear-gradient(270deg, #ffc21e, #00c1ce);
            color:#fff;
        }
        .search{
          height: 50px;
          line-height: 50px;
          padding-left:30px;
          .item_list{
             float:left;
             margin-right: 80px;
             span{
                font-size:14px;
             }
             .el-radio+.el-radio{
                margin-left: 10px;
             }
          }
        }
        .el-table{
           flex:1;
           display: flex;
           flex-flow:column;
           td{
             padding:15px 0;
           }
           .cell{
             a{
                color:#07A6E7;
                &:hover{
                  text-decoration: underline;
                }
             }
             img{
               width: 16px;
               height: 16px;
               vertical-align: middle;
               margin-right: 6px;
               margin-bottom: 2px;
             }
           }
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
          padding:42px 0;
          background-color: #fff;
          .el-pagination__jump{
            color:#333;
          }
        }
    }
</style>