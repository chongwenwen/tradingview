<template>
    <div v-loading="fullLoading">
        <div class="top">
           <div class="totalAssets">
              <div class="item">
                  <h1>{{ $t("localization.Total-asset") }} <span>{{totalParams.bev}}</span></h1>
                  <p>≈ {{totalParams.cny}}</p>
              </div>
           </div>
           <div class="rate">
              <span>{{ $t("localization.Real-rate") }}：{{totalParams.rate}}</span>
           </div>
        </div>
        <div class="assetsList">
            <div class="option">
              <div class="rateSwitch">
               <el-switch
                 v-model="rateShow"
                 active-color="#409EFF"
                 @change="rateChange"
                 :inactive-text="totalParams.poundage_tm_msg">
               </el-switch>
              </div>
              <div class="assets_search">
                <input v-model="assetsName" @keyup.enter="assetsSearch"
                 :placeholder="$t('localization.asset-name')" />
                <i class="el-icon-search" @click="assetsSearch"></i>
              </div>
            </div>
            <el-table
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                :cell-style="cellStyle"
                :header-cell-style="rowClass"
                v-loading="fullscreenLoading">
                <el-table-column
                  :label="$t('localization.Assets')">
                  <template slot-scope="scope">
                    <div class="logo">
                      <div class="ft">
                        <img :src="scope.row.logo">
                      </div>
                      <div class="name">{{ scope.row.abb }}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="number"
                  :label="$t('localization.Total-amount')">
                </el-table-column>
                <el-table-column
                  prop="frozen"
                  :label="$t('localization.Frozen')">
                </el-table-column>
                <el-table-column
                  prop="usable"
                  :label="$t('localization.Available')">
                </el-table-column>
                <el-table-column
                  :label="$t('localization.Market-value')">
                  <template slot-scope="scope">
                    <span style="color:#00b275;">{{ scope.row.bve_value }} $</span>
                    <p style="font-size:12px;color:#9f9f9f;">≈ {{ scope.row.market_value }} ￥</p>
                  </template>
                </el-table-column>
                <el-table-column
                  width="200"
                  :label="$t('localization.Operation')">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      plain
                      @click="changeInto(scope.row)">{{$t('localization.Change-into')}}
                    </el-button>
                    <el-button
                      size="mini"
                      type="primary"
                      plain
                      @click="turnOut(scope.row)">{{$t('localization.Turn-out')}}
                    </el-button>
                  </template>
                </el-table-column>
            </el-table>
            <!-- <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="10"
              layout="prev, pager, next, jumper"
              :total="30"
              prev-text='上一页'
              next-text='下一页'>
            </el-pagination> -->
        </div>
        <!-- 转入弹窗 -->
        <el-dialog
          :title="$t('localization.Change-into')+' '+ turnOutName"
          :visible.sync="ChangeintoModel"
          width="640px"
          class="assetsChange">
          <div class="title">{{$t('localization.wallet-app-tips')}}</div>
          <img :src="wallet_code" :alt="$t('localization.Wallet-code')">
          <p>{{wallet_address}}（{{$t('localization.Wallet-address')}}）</p>
        </el-dialog>
        <!-- 转出弹窗 -->
        <el-dialog
          :title="turnOutName+' '+$t('localization.Turn-out')"
          :visible.sync="turnOutModel"
          width="640px"
          class="assetsChange">
          <el-form :model="turnOutForm" status-icon :rules="turnOutRule" ref="turnOutForm" label-width="100px" class="demo-ruleForm">
            <el-form-item :label="$t('localization.Number')" prop="num">
              <el-input type="number" v-model="turnOutForm.num" :placeholder="$t('localization.4-bits')" autocomplete="off"></el-input>
              <p>
               {{$t('localization.Available')}} <span>{{totalNum}}</span>
               <a href="javascript:;" @click="turnOutAll">{{$t('localization.Turn-out-all')}}</a>
              </p>
            </el-form-item>
            <el-form-item :label="$t('localization.Wallet-address')">
              <el-input type="input" v-model="turnOutForm.wallet_address"></el-input>
            </el-form-item>
            <el-form-item :label="$t('localization.Remarks')">
              <el-input type="textarea" maxlength="40" v-model="turnOutForm.remark"></el-input>
            </el-form-item>
            <el-button type="primary" @click="confirmTurnOut('turnOutForm')">{{$t('localization.Confirm-turn-out')}}</el-button>
          </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    var regNum4 =/^\d+(\.\d{1,4})?$/;//精确到小数点后4位
    var numCheck = (rule, value, callback) => {
      if(!regNum4.test(Number(value))){
        callback(new Error(this.$t('localization.4-bits')));
      }else if((Number(value) > Number(this.totalNum))){
        callback(new Error(this.$t('localization.credit-low')));
      }else {
        callback();
      }
    };
    return {
       currentPage:1,
       totalParams:{},
       tableData: [],
       assetsName:'',
       totalCount:0,
       pageSize:1,
       totalPage:0,
       rateShow:false,
       turnOutModel:false,
       fullLoading:true,
       fullscreenLoading:false,
       ChangeintoModel:false,
       totalNum:'',
       turnOutName:'',
       wallet_address:'',
       wallet_code:'',
       turnOutForm:{
          asset_id:'',
          num:'',
          remark:'',
          wallet_address:''
       },
       turnOutRule: {
          num: [
            { validator:numCheck, trigger: 'change' }
          ]
        }
    }
  },
  created(){
    this.getTotalData()
  },
  methods: {
    init(){
      var url = this.$urlPrefix+'/myAsset'
      var token = localStorage.getItem('token')
      var data={
        _ajax:1,
        toKey:token,
        abb:this.assetsName
      }
      this.$http.post(url,data).then(function(response){
         var result = response.body.data
         if(response.body.code==1){
           this.tableData = result
           this.fullLoading  = false
         }
      })
    },
    getTotalData(){
      var url = this.$urlPrefix+'/totalAsset'
      var token = localStorage.getItem('token')
      var data={
        _ajax:1,
        toKey:token
      }
      this.$http.post(url,data).then(function(response){
         if(response.body.code==1){
           var result =  response.body.data
           this.totalParams = result
           result.poundage_tm == "1"? this.rateShow=true:this.rateShow=false
           this.init()
         }
      })
    },
    assetsSearch(){
      this.init()
    },
    rowClass({ row, rowIndex}) {
      if(rowIndex == 0){
          return 'background:#fff'
      }
    },
    cellStyle({row, column, rowIndex, columnIndex}){
      if(columnIndex === 2){ //指定坐标
          return 'color:#ef5057'
      }
    },
    // 转入
    changeInto(row){
      this.fullscreenLoading = true
      this.turnOutName = row.abb
      var token = localStorage.getItem('token')
      var url = this.$urlPrefix+'/turnEnter'
      var data={
        _ajax : 1,
        toKey:token
      }
      this.$http.post(url,data).then(function(response){
         if(response.body.code==1){
            this.fullscreenLoading = false
            var result = response.body.data
            this.wallet_address = result.dynamic_code
            this.wallet_code = result.img
            this.ChangeintoModel = true
         }else{
            this.fullscreenLoading = false
            this.$message({
              message: response.body.msg,
              type: 'error'
            });
         }
      })
    },
    // 转出
    turnOut(row){
      this.turnOutModel = true
      this.totalNum = row.usable
      this.turnOutName = row.abb
      this.turnOutForm.asset_id = row.asset_id
    },
    confirmTurnOut(formName){
      if(Number(this.turnOutForm.num) <= 0){
        this.$message({
          message: this.$t('localization.num-than-0'),
          type: 'error'
        });
        return false;
      }else if(this.turnOutForm.wallet_address.trim() == ''){
        this.$message({
          message: this.$t('localization.wallet-address-tips'),
          type: 'error'
        });
        return false;
      }else if(this.turnOutForm.remark.trim() == ''){
        this.$message({
          message: this.$t('localization.require-tips'),
          type: 'error'
        });
        return false;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submit(this.turnOutForm)
          this.$refs[formName].resetFields();//清空表单
        } else {
          return false;
        }
      });
    },
    submit(form){
      var token = localStorage.getItem('token')
      var url = this.$urlPrefix+'/turnOut'
      form.toKey = token
      form._ajax = 1
      this.$http.post(url,form).then(function(response){
         if(response.body.code==1){
            this.$message({
              message: response.body.msg,
              type: 'success'
            });
            this.turnOutModel = false
            this.init()
         }else{
            this.$message({
              message: response.body.msg,
              type: 'error'
            });
         }
         
      })
    },
    turnOutAll(){
      this.turnOutForm.num = this.totalNum
    },
    //设置TM为手续费
    rateChange(val){
      var token = localStorage.getItem('token')
      var url = this.$urlPrefix+'/poundageTm'
      var data={
        _ajax : 1,
        toKey:token,
        type:val?1:0
      }
      this.$http.post(url,data).then(function(response){
         if(response.body.code==1){
            this.rateShow = val
         }else{
            this.$message({
              message: response.body.msg,
              type: 'error'
            });
            this.rateShow = !val
         }
      })
    }
  },
  watch:{
    turnOutModel(val){
      if(!val){
        this.turnOutForm={
          num:'',
          remark:'',
          wallet_address:''
        }
      }
    }
  }
}    
</script>