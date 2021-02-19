<template>
  <div class="advert_container">
    <div class="container">
      <el-tabs v-model="activeTab" type="card" @tab-click="">
        <!-- 发布广告 -->
        <el-tab-pane name="1" class="tabs">
          <span slot="label">发布广告</span>
          <div class="item">
              <el-form :model="advertForm" status-icon :rules="advertRule" ref="advertForm" label-width="90px" class="demo-ruleForm advertForm">
                <div class="input_item payType">
                  <el-form-item label="发布类型" prop="type">
                    <el-radio-group v-model="advertForm.type">
                      <el-radio :label="1">购买</el-radio>
                      <el-radio :label="2">出售</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <div class="input_item">
                  <el-form-item label="单价￥" prop="price">
                    <el-input type="number" v-model="advertForm.price" autocomplete="off" placeholder="人民币单价"></el-input>
                  </el-form-item>
                  <p>≈ <span>$ {{bvePrice}}</span> ( {{COIN1}}单价，根据当前汇率计算 )</p>
                </div>
                <div class="input_item">
                  <el-form-item label="数量" prop="number">
                    <el-input type="number" placeholder="限整数" v-model="advertForm.number"></el-input>
                  </el-form-item>
                  <p v-if="advertForm.type=='2'">
                     剩余 <span>{{totalCoin1}}</span> ( {{COIN1}} ) 
                     <a href="javascript:;" @click="sellAllCoin1">出售全部</a>
                  </p>
                </div>
                <div class="input_item">
                  <div class="totalPrice">
                    预计交易总额：<span>￥ {{totalPrice}}</span>
                  </div>
                </div>
                <!-- <div class="input_item payType">
                    <el-form-item label="交易方式" prop="pay_type">
                      <el-checkbox-group v-model="advertForm.pay_type">
                        <el-checkbox v-for='(item,index) in payType'  name="pay_type"  :label="item" :key="index">
                          <img src="../../assets/weixin_01.png" v-if="item=='1'">
                          <img src="../../assets/zhifubao_01.png" v-if="item=='2'">
                          <img src="../../assets/card_01.png" v-if="item=='3'">
                        </el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                </div> -->
                <div class="input_item">
                  <el-form-item label="备注 (需求)" prop="remark">
                    <el-input type="textarea" maxlength="20" v-model="advertForm.remark"></el-input>
                  </el-form-item>
                </div>
                <p class="tip">比如：“ 在线等 ”，限20个字符以内</p>
                <el-button type="primary" v-if="advertForm.type=='1'" @click="advertBuySubmit('advertForm')" class="advertBtn">发布购买</el-button>
                <el-button type="primary" v-if="advertForm.type=='2'" @click="advertSellSubmit('advertForm')" class="advertBtn">发布出售</el-button>
              </el-form>
          </div>
        </el-tab-pane>
        <!-- 广告管理 -->
        <el-tab-pane class="tabs" name="2">
          <span slot="label">广告管理</span>
          <div class="item advertConfig" v-loading="fullscreenLoading">
              <div class="search">
                  <div class="item_list">
                    <span>发布类型：</span> 
                    <el-radio-group v-model="advertType">
                      <el-radio :label="0">全部</el-radio>
                      <el-radio :label="1">购买</el-radio>
                      <el-radio :label="2">出售</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="item_list">
                    <span>订单状态：</span> 
                    <el-radio-group v-model="advertStatus">
                      <el-radio :label="99">全部</el-radio>
                      <el-radio :label="0">进行中</el-radio>
                      <el-radio :label="1">已完成</el-radio>
                      <el-radio :label="2">已撤销</el-radio>
                    </el-radio-group>
                  </div>
              </div>
              <div class="advertList">
                 <div class="advert_item" v-for="(item,index) in advertListData" :key="index">
                   <h1>
                     <span>订单状态： {{item.status}}</span>
                     <div class="option">
                        <span href="javascript:;" v-if="item.type==1" class="type buy">购买</span>
                        <span href="javascript:;" v-if="item.type==2" class="type sell">出售</span>
                     </div>
                   </h1>
                   <div class="content">
                     <div class="info">
                       <p>
                         总量：<i>{{item.number}}</i>
                         <span class="tip">已成交：<i class="deal">{{item.deal_number}}</i></span>
                         <span class="tip">剩余：<i class="overplus">{{item.nodeal_number}}</i></span>
                       </p>
                       <p class="single">单价：￥ {{item.price}} 
                         <a href="javascript:;" @click="advertDetail(item.id)">详情</a>
                       </p>
                     </div>
                   </div>
                   <div class="time">{{item.time}}</div>
                 </div>
              </div>
              <p class="noData" v-if="advertListData.length==0">暂无数据</p>
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Advert',
  data() {
      var regNum =/^\+?[1-9][0-9]*$/;//正整数
      var regNum2 =/^\d+(\.\d{1,2})?$/;//精确到小数点后2位
      var priceCheck = (rule, value, callback) => {
        if (value.trim() == '') {
          callback(new Error('请输入价格'));
        }else if (value <= 0) {
          callback(new Error('价格必须大于0'));
        }else if(!regNum2.test(Number(value))){
          callback(new Error('单价最多支持小数点后2位'));
        }else{
          callback();
        }
      };
      var numCheck = (rule, value, callback) => {
        if (Number(value) <= 0) {
          callback(new Error('数量必须大于0'));
        }else if(!regNum.test(Number(value))){
          callback(new Error('数量只支持整数'));
        }else if(this.advertForm.type == 2 && (Number(value) > Number(this.totalCoin1))){
          callback(new Error('资产余额不足'));
        }else {
          callback();
        }
      };
      var requireDesc = (rule, value, callback) => {
        if (value.trim() == '') {
          callback(new Error('务必备注购买需求'));
        }else {
          callback();
        }
      };
      return {
        // payType:[],
        fullscreenLoading:false,
        advertListData:[],
        COIN1:'',
        exchangeRate:'',
        totalPrice:'0.00',
        bvePrice:'0.0000',
        activeTab:'1',
        currentPage:1,
        advertStatus:99,
        advertType:0,
        totalCount:0,
        pageSize:0,
        totalPage:0,
        totalCoin1:'0.0000',
        advertForm: {
           price:'',
           number:'',
           remark:'',
           // pay_type:[],
           type:1,
           _ajax:1
        },
        advertRule: {
          price: [
            { validator:priceCheck , trigger: 'change' }
          ],
          number: [
            { validator:numCheck, trigger: 'change' }
          ],
          remark:[
            { required: true, validator:requireDesc, trigger: 'change' }
          ],
          pay_type: [
            { type: 'array', required: true, message: '请至少选择一种支付方式', trigger: 'change' }
          ]
        }
      };
    },
    created(){
      this.getParams()
      this.getBaseInfo()
    },
    methods: {
      getParams(){
        var params = this.$route.query.params
        if(params){
          this.activeTab = params
        }else{
          this.activeTab = localStorage.getItem('advertActive')?localStorage.getItem('advertActive'):'1'
        }
      },
      getBaseInfo(){
        var url = this.$urlPrefix+'/frenchConfig'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token
        }
        this.$http.post(url,data).then(function(response){
           var result = response.body.data
           if(response.body.code==1){
              // this.payType = result.pay_type
              this.exchangeRate = result.ZTU
              this.COIN1 = result.coin1
              this.totalCoin1 = result.number
           }
        })
      },
      getAdvertList(){
        var url = this.$urlPrefix+'/myFrenchRelease'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token,
          type:this.advertType,
          status:this.advertStatus,
          page:this.currentPage
        }
        this.$http.post(url,data).then(function(response){
           var result = response.body.data
           if(response.body.code==1){
              this.fullscreenLoading = false
              this.advertListData =  result.data
              this.totalCount = result.total
              this.pageSize = result.per_page
              this.totalPage = result.last_page
           }
        })
      },
      advertBuySubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.frenchSubmit(this.advertForm,'sell')
            this.$refs[formName].resetFields();//清空表单
          } else {
            return false;
          }
        });
      },
      advertSellSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.frenchSubmit(this.advertForm,'buy')
            this.$refs[formName].resetFields();//清空表单
          } else {
            return false;
          }
        });
      },
      frenchSubmit(data,type){
        var token = localStorage.getItem('token')
        var url = this.$urlPrefix+'/frenchReleaseAdd'
        data.toKey = token
        this.$http.post(url,data).then(function(response){
           var _this = this
           if(response.body.code==1){
              this.$message({
                message: response.body.msg,
                type: 'success'
              });
              this.$router.push({
                path:'/frenchCurrenry',
                query:{
                   type:type
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
        this.getAdvertList()
      },
      advertDetail(id){
        this.$router.push({
          path:'/advertDetail',
          query:{
            id:id
          }
        })
      },
      sellAllCoin1(){
        this.advertForm.number = this.totalCoin1
      }
    },
    watch:{
      'advertForm.price':function(val){
        this.bvePrice = (val*(this.exchangeRate)).toFixed(4)
        this.totalPrice = (val*(this.advertForm.number)).toFixed(2)
      },
      'advertForm.number':function(val){
        this.totalPrice = (val*(this.advertForm.price)).toFixed(2)
      },
      //进行中/已完成
      advertStatus:function(val){
        this.advertStatus = val
        this.fullscreenLoading = true
        this.getAdvertList()
      },
      //购买/出售
      advertType:function(val){
        this.advertType = val
        this.fullscreenLoading = true
        this.getAdvertList()
      },
      activeTab:function(val){
        if(val=='2'){
          this.getAdvertList()
        }
        localStorage.setItem('advertActive',val)
      }
    }
}
</script>

<style lang="less">
   .advert_container{
      width: 100%;
      background-color: #fff;
      padding:40px 0;
      .container{
        width: 1200px;
        margin:0 auto;
        .el-tabs{
           .el-tabs__header{
              margin-bottom: 0;
              border-bottom: 2px solid #52cbca;
              padding-left: 20px;
           }
           .item{
               padding:30px 50px;
               min-height: 750px;
               overflow: hidden;
               .el-pagination{
                 float:right;
                 margin-right: 10px;
                 button,.el-pager li{
                   background-color: transparent;
                 }
               }
               .el-form {
                  margin-left: 50px;
                 >.tip{
                   text-align: left;
                   padding-left:90px;
                   font-size:14px;
                   margin-bottom: 20px;
                   span{
                     color:#00c1ce;
                   }
                 }
                 .el-button--primary{
                    border: 0;
                    outline: 0;
                    width: 200px;
                    height: 38px;
                    font-size: 16px;
                    font-weight: 700;
                    background-color: #00b275;
                    margin-top: 18px;
                    float:left;
                 }
                 .input_item{
                    width: 100%;
                    overflow: hidden;
                    .totalPrice{
                      text-align: left;
                      font-size:14px;
                      margin:20px 0;
                      color:#606266;
                      span{
                        font-size:15px;
                        color:#00b275;

                      } 
                    }
                    .el-button{
                      padding:12px 20px;
                    }
                    .el-form-item{
                      width: 400px;
                      float:left;
                      border:1px solid #ccc;
                      font-size:15px;
                      &:hover{
                         border-color:#22e6b8;
                      }
                      .el-checkbox__label{
                         img{
                           width: 22px;
                           height: 22px;
                           vertical-align: middle;
                           margin-bottom: 3px;
                         }
                      }
                      .el-form-item__content{
                          text-align: left;
                      }
                      .el-form-item__label{
                         text-align: center;
                         padding:0;
                      }
                      .el-select{
                         width: 100%;
                      }
                      .el-input__inner{
                        padding: 0 0 0 30px;
                        border:none;
                        border-radius: 0;
                        padding-left: 16px;
                      }
                      .el-form-item__error{
                        left:-80px;
                      }
                    }
                    p{
                       float:left;
                       margin-left: 20px;
                       line-height: 42px;
                       font-size:15px;
                       span{
                         color:#f40;
                       }
                       a{
                          color:orange;
                          font-weight: 700;
                          margin-left: 10px;
                          &:hover{
                            text-decoration: underline;
                          }
                       }
                    }
                    .el-button{
                       float:left;
                       margin-left: 10px;
                    }
                    &:last-of-type{
                      .el-form-item{
                        border:0;
                        .el-form-item__label{
                           text-align: left;
                        }
                        .el-textarea__inner{
                          resize:none;
                          border-radius: 0;
                        }
                        .el-form-item__error {
                          left:0px;
                        }
                      }
                    }
                 }
                 .payType{
                    .el-form-item{
                       border:0;
                       .el-form-item__label{
                          text-align: left;
                       }
                       .el-checkbox-group{
                          text-align: left;
                          .el-checkbox{
                             margin-left: 0;
                             margin-right: 20px;
                          }
                       }
                    }
                 }
               }
               .search{
                 height: 50px;
                 line-height: 50px;
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
               .advertList{
                 width: 100%;
                 overflow: hidden;
                 >.advert_item{
                    width: 49%;
                    padding:10px 20px;
                    float:left;
                    height: 120px;
                    display: flex;
                    flex-flow:column;
                    border:1px solid rgba(0,178,117,.5);
                    margin:4px 0;
                    &:nth-of-type(odd){
                      margin-right: 2%;
                    }
                    h1{
                      width: 100%;
                      height:20px;
                      line-height:20px;
                      overflow: hidden;
                      font-size:14px;
                      >span{
                        font-weight: 700;
                      }
                      .option{
                        float:right;
                        .type{
                           color:#333;
                           font-weight: 700;
                        }
                        .buy{
                          color:#e45555;
                        }
                        .sell{
                          color:#00b275;
                        }
                      }
                      span{
                        float:left;
                      }
                    }
                    .content{
                      flex:1;
                      display: flex;
                      margin:10px 0;
                      .info{
                         flex:9;
                         padding:4px 0;
                         p{
                           font-size:14px;
                           line-height: 26px;
                           text-align: left;
                           i{
                            font-style: normal;
                            font-weight: 700;
                           }
                           .tip{
                             margin-left: 20px;
                           }
                         }
                         .single{
                           a{
                             color:#00c1ce;
                             margin-left: 10px;
                             &:hover{
                               text-decoration: underline;
                             }
                           }
                         }
                      }
                    }
                    .time{
                       text-align: right;
                       font-size:14px;
                    }
                 }
               }
               .noData{
                 margin-top: 100px;
                 color:#606266;
                 font-size:14px;
               }
               .el-pagination{
                 margin-top: 20px;
               }
           }
        }
      }
   }
</style>