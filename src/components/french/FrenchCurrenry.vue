<template>
  <div class="frenchCu_container">
     <div class="layout_content">
        <div class="nav_bar">
          <el-menu :default-active="activeIndex" @select="indexSelect" class="el-menu-demo" mode="horizontal" active-text-color="#ffb900" text-color="#666" menu-trigger=''>
            <!-- 购买 -->
            <div class="item">
              <div class="title">
                <a href="javascript:;" @click="activeIndex='buy_01'">
                   <i class="el-icon-download"></i> 购买
                </a>
              </div>
              <div class="nav_li">
                <el-menu-item index="buy_01">
                   <span>BVE</span>
                </el-menu-item>
              </div>
            </div>
            <div class="item sell">
              <div class="title sellTitle">
                <a href="javascript:;" @click="activeIndex='sell_01'">
                   <i class="el-icon-upload2"></i> 出售
                </a>
              </div>
              <div class="nav_li">
                <el-menu-item index="sell_01">
                 <span>BVE</span>
                </el-menu-item>
              </div>
            </div>
          </el-menu>
        </div>
        <div class="content">
          <div class="title">
             没有合适的？<a href="javascript:;" @click="toAdvert">自己发布广告</a>
             <a  href="javascript:;" @click="toOrderList" class="toList">查看我的订单 >></a>
          </div>
          <el-table
            :data="totalData"
            tooltip-effect="dark"
            style="width: 100%"
            :cell-style="cellStyle"
            :header-cell-style="rowClass"
            v-loading="fullscreenLoading">
            <el-table-column
              label="昵称">
              <template slot-scope="scope">
                <span style="margin-left: 4px;">{{ scope.row.nickname }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="成单数">
              <template slot-scope="scope">
                <span style="margin-left: 4px;">{{ scope.row.total_order }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="数量">
              <template slot-scope="scope">
                <span style="margin-left: 4px;">{{ scope.row.nodeal_number }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="单价">
              <template slot-scope="scope">
                <span style="margin-left: 4px;">{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="支付方式">
              <template slot-scope="scope">
                <span v-for="(item,index) in scope.row.pay_type">
                  <img src="../../assets/weixin_01.png" v-if="item=='1'">
                  <img src="../../assets/zhifubao_01.png" v-if="item=='2'">
                  <img src="../../assets/card_01.png" v-if="item=='3'">
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="备注">
              <template slot-scope="scope">
                <span style="margin-left: 4px;">{{ scope.row.remark }}</span>
              </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <button @click="buyFrenchCury(scope.row.price,scope.row.id,scope.row.nodeal_number)" v-if="showType==1 && scope.row.own=='0'">
                     购买
                  </button>
                  <button @click="sellFrenchCury(scope.row.price,scope.row.id,scope.row.nodeal_number)" v-if="showType==2 && scope.row.own=='0'" class="sell">
                     出售
                  </button>
                  <button @click="toAdvertConfig(scope.row.id)" v-if="scope.row.own=='1'" class="admin">
                     管理
                  </button>
                </template>
              </el-table-column>
          </el-table>
          <!-- 分页 -->
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
     </div>
     <el-dialog
        title="实名认证"
        :visible.sync="certificationModal"
        width="540px"
        class="advertModal">
        <span style="text-align: center;">您尚未完成实名认证，请先实名认证</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="certificationModal = false">取 消</el-button>
          <el-button type="primary" @click="certification">去认证</el-button>
        </span>
      </el-dialog>
      <!-- 购买弹窗 -->
      <el-dialog
        title="购买"
        :visible.sync="buyFrenchModel"
        width="640px"
        class="buyModal">
        <el-form :model="buyForm" status-icon :rules="buyRule" ref="buyForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="单价" prop="price">
            <el-input type="text" v-model="buyForm.price" placeholder="请输入" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="number">
            <el-input type="number" v-model="buyForm.number" placeholder="请输入" autocomplete="off"></el-input>
          </el-form-item>
          <el-button type="primary" class="buyBtn" @click="confirmBuy('buyForm')">确认购买</el-button>
        </el-form>
      </el-dialog>
      <!-- 出售弹窗 -->
      <el-dialog
        title="出售"
        :visible.sync="sellFrenchModel"
        width="640px"
        class="buyModal">
        <el-form :model="sellForm" status-icon :rules="sellRule" ref="sellForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="单价" prop="price">
            <el-input type="text" v-model="sellForm.price" placeholder="请输入" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="number">
            <el-input type="number" v-model="sellForm.number" placeholder="请输入" autocomplete="off"></el-input>
          </el-form-item>
          <el-button type="primary" class="sellBtn" @click="confirmSell('sellForm')">确认出售</el-button>
        </el-form>
      </el-dialog>  
      <!-- 收付款弹窗 -->
      <el-dialog
        title="交易提示"
        :visible.sync="payModal"
        width="540px"
        class="advertModal">
        <span style="text-align: center;">您尚未设置收付款方式</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="payModal = false">取 消</el-button>
          <el-button type="primary" @click="paySet">去设置</el-button>
        </span>
      </el-dialog>
      <!-- 交易密码弹窗 -->
      <el-dialog
        title="密码提示"
        :visible.sync="payPassModal"
        width="540px"
        class="advertModal">
        <span style="text-align: center;">您尚未设置交易密码</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="payPassModal = false">取 消</el-button>
          <el-button type="primary" @click="paySet">去设置</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import callback from "../../utile/callback.js"
// import socket from '../../../static/datafeeds/socket.js'
export default {
  name: 'FrenchCurrenry',
  data() {
      var regNum2 =/^\d+(\.\d{1,2})?$/;//精确到小数点后2位
      var regNum4 =/^\d+(\.\d{1,4})?$/;//精确到小数点后4位
      var buyNumCheck = (rule, value, callback) => {
        if (Number(value) <= 0) {
          callback(new Error('数量必须大于0'));
        }else if(!regNum4.test(Number(value))){
          callback(new Error('数量最多支持小数点后4位'));
        }else if(Number(value) > Number(this.buyNumber)){
          callback(new Error('购买数量不能大于出售总量'));
        }else {
          callback();
        }
      };
      var sellNumCheck = (rule, value, callback) => {
        if (Number(value) <= 0) {
          callback(new Error('数量必须大于0'));
        }else if(!regNum4.test(Number(value))){
          callback(new Error('数量最多支持小数点后4位'));
        }else if(Number(value) > Number(this.sellNumber)){
          callback(new Error('出售数量不能大于购买总量'));
        }else {
          callback();
        }
      };
      var priceCheck = (rule, value, callback) => {
        if (value.trim() == '') {
          callback(new Error('请输入价格'));
        }else if (value <= 0) {
          callback(new Error('价格必须大于0'));
        }else if(!regNum2.test(Number(value))){
          callback(new Error('金额最多支持小数点后2位'));
        }else{
          callback();
        }
      };
      return {
        socket:null,
        payModal:false,
        activeIndex:'',
        fullscreenLoading:false,
        certificationModal:false,
        payPassModal:false,
        buyFrenchModel:false,
        sellFrenchModel:false,
        showType:1,
        totalPage:'',
        totalData: [],
        currentPage:1,
        pageSize:'',
        totalCount:'',
        buyNumber:'',
        sellNumber:'',
        buyForm: {
          price:'',
          number:'',
          release_id:''
        },
        sellForm: {
          price:'',
          number:'',
          release_id:''
        },
        buyRule: {
          number: [
            { validator: buyNumCheck, trigger: 'change' }
          ],
          price: [
            { validator: priceCheck, trigger: 'change' }
          ]
        },
        sellRule:{
          number: [
            { validator: sellNumCheck, trigger: 'change' }
          ],
          price: [
            { validator: priceCheck, trigger: 'change' }
          ]
        }
      };
    },
    created(){
      var advertType = this.$route.query.type
      if(advertType){
        if(advertType=="sell"){
           this.showType = 2
           this.activeIndex = 'sell_01'
        }else if(advertType=="buy"){
           this.showType = 1
           this.activeIndex = 'buy_01'
        }
      }else{
        this.activeIndex =  localStorage.getItem('frenchIndex')?localStorage.getItem('frenchIndex'):'buy_01'
        this.activeIndex.split('_')[0] == "sell"?this.showType = 2:this.showType = 1
      }
      this.init()
      // this.initSocket()
    },
    methods: {
       // initSocket(){
       //   this.socket = new socket(this.$urlWebsoket)
       //   this.socket.doOpen()
       //   this.socket.on('open', () => {
       //     this.socket.send({"cmd":"open"})//首次握手
       //   })
       // },
       init(){
        var url = this.$urlPrefix+'/frenchReleaseList'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token,
          type:this.showType,
          page:this.currentPage
        }
        this.$http.post(url,data).then(function(response){
           var result = response.body.data
           if(response.body.code==1){
              this.fullscreenLoading = false
              this.totalData = result.data
              this.totalCount = result.total
              this.pageSize = result.per_page
              this.totalPage = result.last_page
           }else{
              callback.callback(this,response.body)
              this.fullscreenLoading = false
           }
        })
      },
      /*
        给websoket发送数据
      */
      // sendMessage(data) {
      //   if (this.socket.checkOpen()) {
      //     this.socket.send(data)
      //   } else {
      //     this.socket.on('open', () => {
      //       this.socket.send(data)
      //     })
      //   }
      // },
      indexSelect(key,value){
        this.checkActiveIndex(key)
      },
      rowClass({ row, rowIndex}) {
        if(rowIndex == 0){
            return 'background:#f9f9f9'
        }
      },
      cellStyle({row, column, rowIndex, columnIndex}){
        if(columnIndex == 3){
          return {
             "color":"#ffb900",
             "font-size":"18px",
             'font-weight':500
          }
        }
        if(columnIndex == 0){
          return {
             'font-size':'16px',
             'font-family':'微软雅黑',
             'padding':'0 10px'
          }
        }
      },
      buyFrenchCury(price,id,number){
        this.buyForm.price = price
        this.buyForm.release_id = id
        this.buyNumber = number
        var url = this.$urlPrefix+'/frenchPage'
        var token = localStorage.getItem('token')
        if(token){
          var data={
            _ajax:1,
            toKey:token
          }
          this.$http.post(url,data).then(function(response){
             if(response.body.code==1){
                this.buyFrenchModel = true
             }else{
                callback.callback(this,response.body)
             }
          })
        }else{
          this.$router.push({
             path:'/login'
          })
        }
      },
      sellFrenchCury(price,id,number){
        this.sellForm.price = price
        this.sellForm.release_id = id
        this.sellNumber = number
        var url = this.$urlPrefix+'/frenchPage'
        var token = localStorage.getItem('token')
        if(token){
          var data={
            _ajax:1,
            toKey:token
          }
          this.$http.post(url,data).then(function(response){
             if(response.body.code==1){
                this.sellFrenchModel = true
             }else{
                callback.callback(this,response.body)
             }
          })
        }else{
          this.$router.push({
             path:'/login'
          })
        }
      },
      certification(){
          this.$router.push({
            path: '/my/certification'
          });
      },
      confirmBuy(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.frenchOrder(this.buyForm)
            } else {
              return false;
            }
          });
      },
      confirmSell(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.frenchOrder(this.sellForm)
            } else {
              return false;
            }
          });
      },
      frenchOrder(data){
        var url = this.$urlPrefix+'/frenchOrder'
        var token = localStorage.getItem('token')
        data.toKey=token
        data._ajax=1
        this.$http.post(url,data).then(function(response){
           if(response.body.code==1){
              // this.sendMessage({"cmd":"message","mobile":response.body.data.mobile})
              this.$message({
                message: response.body.msg,
                type: 'success'
              });
              this.$router.push({
                path:'/orderDetail',
                query:{
                  id:response.body.data.id
                }
              })
           }else{
              this.$message({
                message: response.body.msg,
                type: 'error'
              });
           }
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.fullscreenLoading = true
        this.init()
      },
      paySet(){
        this.$router.push({
           path:'/my/personal',
           query:{
              type:'pay'
           }
        })
      },
      toAdvert(){
        this.checkCertify('/advert');
      },
      toAdvertConfig(id){
         this.$router.push({
            path:'/advertDetail',
            query:{
              id:id
            }
         })
      },
      toOrderList(){
        this.checkCertify('/orderList');
      },
      checkCertify(path){
        var url = this.$urlPrefix+'/frenchPage'
        var token = localStorage.getItem('token')
        if(token){
          var data={
            _ajax:1,
            toKey:token
          }
          this.$http.post(url,data).then(function(response){
             if(response.body.code==1){
                if(path=="/advert"){
                  this.$router.push({
                     path:path,
                     query:{
                       params:'1'
                     }
                  })
                }else{
                  this.$router.push({
                    path:path
                  })
                }
                
             }else{
                callback.callback(this,response.body)
             }
          })
        }else{
          this.$router.push({
             path:'/login'
          })
        }
      },
      checkActiveIndex(val){
        if(val.split('_')[0] == "sell"){
           this.currentPage = 1
           this.showType = 2
           this.init()
        }else{
           this.currentPage = 1
           this.showType = 1
           this.init()
        }
        localStorage.setItem('frenchIndex',val)
      }
    },
    watch:{
      sellFrenchModel:function(val){
        if(!val){
          this.buyForm.number=''
        }
      },
      buyFrenchModel:function(val){
        if(!val){
          this.sellForm.number =''
          this.sellForm.pay_type=[]
        }
      },
      activeIndex:function(val){
        this.checkActiveIndex(val)
      }
    },
    destroyed(){
      //关闭socket
      // this.socket.destroy()
    }
}
</script>

<style lang="less">
    .frenchCu_container{
       width: 100%;
       overflow: hidden;
       .layout_content{
          width: 1200px;
          margin:40px auto;
          .nav_bar{
             width: 100%;
             height: 50px;
             display: flex;
             margin-bottom: 10px;
             .el-menu-demo{
               width: 100%;
               display: flex;
               .item{
                  flex:1;
                  outline:none;
                  display: flex;
                  .title{
                      width: 120px;
                      height: 100%;
                      float:left;
                      outline:none;
                      line-height: 50px;
                      font-size:22px;
                      background-image: linear-gradient(270deg,#ffe170,#ffb900);
                      a{
                        display: block;
                        width: 100%;
                        height: 100%;
                        color:#fff;
                        i{
                          font-size:24px;
                        }
                      }
                   }
                   .nav_li{
                     flex:1;
                     // overflow-x: auto;
                     .el-menu-item{
                       float:left;
                       padding:0 30px;
                       font-size:16px;
                     }
                   }
                   .sellTitle{
                      background-image: linear-gradient(270deg,#22e6b8,#00c1ce);
                   }
               } 
             }
          }
          .content{
             width: 100%;
             background-color: #fff;
             overflow: hidden;
             .title{
                width: 100%;
                height: 60px;
                line-height: 60px;
                text-align: right;
                padding:0 30px;
                font-size:14px;
                a{
                   color:#52cbca;
                   &:hover{
                     text-decoration: underline;
                   }
                }
                .toList{
                   margin-left: 20px;
                   color:#e45555;
                }
             }
             .el-table{
                .cell{
                   overflow: hidden;
                   white-space: nowrap;
                   text-overflow: ellipsis;
                   button{
                      width: 80px;
                      height: 30px;
                      background-color: transparent;
                      border:2px solid #ffbc32;
                      color: #ffbc32;
                      border-radius: 15px;
                      font-size: 14px;
                      line-height: 22px;
                      &:hover{
                         background-image: linear-gradient(270deg,#ffe170,#ffb900);
                         color:#fff;
                         border:none;
                      }
                   }
                   .sell{
                      border: 2px solid #52cbca;
                      color: #52cbca;
                      &:hover{
                         background-image: linear-gradient(270deg,#22e6b8,#00c1ce);
                      }
                   }
                   .admin{
                      border: 2px solid #f70;
                      color: #f70;
                      &:hover{
                         background-image:linear-gradient(270deg,orange,#f40);
                      }
                   }
                   p{
                      font-size:12px;
                      color:#999;
                      margin-top: 4px;
                   }
                   img{
                      width: 18px;
                      height: 18px;
                      margin-top: 9px;
                   }
                }
                .el-table__body{
                   td{
                     padding:8px 0;
                   }
                }
                .el-table__body-wrapper{
                   min-height: 560px;
                   .el-table__empty-block{
                      min-height: 590px;
                   }
                }
             }
             .el-pagination{
               float: right;
               padding:16px 20px;
             }
          }
       }
       .certifyModal {
         height: 210px;
       }
       .advertModal{
         .el-button--primary{
            border:0;
            background-color: rgb(247, 186, 42);
         }
       }
       .buyModal{
          overflow: hidden;
          margin-top:9%;
          .el-dialog__body{
             overflow: hidden;
             .el-form {
              width: 100%;
              padding:0 80px 30px;
              overflow: hidden;
              float:left;
              p{
                text-align: left;
                padding-left:10px;
                line-height: 20px;
                .sell{
                   color:#e45555;
                }
                .buy{
                   color:#00b275;
                }
              }
              .el-form-item{
                background-color: #f9f9f9;
                margin:22px 0;
                border:1px solid #eee;
                &:hover{
                   border-color:#22e6b8;
                }
                .el-form-item__label{
                   text-align: center;
                }
                .el-input__inner{
                  border:none;
                  background-color: transparent;
                }
                .el-form-item__error{
                  left:-80px;
                }
                .el-input.is-disabled {
                  .el-input__inner{
                     color:#333;
                  }
                }
              }

              .payType{
                 border:0;
                 background-color: #fff;
                 .el-form-item__label{
                    text-align: left;
                    padding-left:6px;
                 }
                 .el-checkbox__label{
                    img{
                      width: 25px;
                      height: 25px;
                      vertical-align: middle;
                      margin-bottom: 4px;
                    }
                 }
                 .el-checkbox-group{
                    text-align: left;
                    .el-checkbox{
                       margin-left: 0;
                       margin-right: 20px;
                    }
                 }
              }
              .tip{
                 text-align: left;
                 font-size:14px;
              }
              .buyBtn,.sellBtn{
                  border:0;
                  outline:0;
                  width: 100%;
                  font-size:20px;
                  font-weight: 700;
                  height: 40px;
                  background-color: #00b275;
                  border-radius: 48px;
                  margin-top: 18px;
                  span{
                     color:#fff;
                  }
               }
               .sellBtn{
                 background-color: #e45555;
               }
            }
          }
       }
    }
</style>
