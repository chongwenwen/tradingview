<template>
  <div class="quotation_container">
      <div class="main_container">
        <!-- 左侧数据 -->
        <div class="left">
           <!-- 行情列表 -->
           <div class="quotation_list">
              <div class="search_box">
                <input :placeholder="$t('localization.coin')" @keyup.enter="quotationsSearch" v-model="searchName"/>
                <i class="el-icon-search" @click="quotationsSearch"></i>
                <p class="switch">
                  <el-radio-group v-model="beanType">
                    <el-radio label="1">{{$t('localization.Turnover')}}</el-radio>
                    <el-radio label="2" style="margin-left: 10px;">{{$t('localization.change')}}</el-radio>
                  </el-radio-group>
                  <el-checkbox-group v-model="showChecked">
                    <el-checkbox label="" name="type">{{$t('localization.Only-show')}}</el-checkbox>
                  </el-checkbox-group>
                  <i class="el-icon-star-on" style="color:#ffc21e;font-size:14px;"></i>
                </p>
              </div>
              <el-table
                :data="quotationData"
                tooltip-effect="dark"
                style="width: 100%"
                :cell-style="quotationCellStyle"
                @row-click="selectRow"
                @sort-change="sortChange"
                :default-sort = "{prop: 'increase', order: 'descending'}">
                <el-table-column
                width="50">
                  <template slot-scope="scope">
                    <span style="color:#FFBC32;font-size:14px;" v-if="!showChecked">
                      <i class="el-icon-star-off" style="z-index:999;" v-if="!scope.row.collect" @click="confirmSelect(scope.row)"></i>
                      <i class="el-icon-star-on" style="z-index:999;" v-if="scope.row.collect==1" @click="giveupSelect(scope.row)"></i>
                    </span>
                    <span style="color:#FFBC32;font-size:14px;" v-if="showChecked">
                      <i class="el-icon-star-on" style="z-index:999;" @click="giveUpCollection(scope.row)"></i>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="abb"
                  sortable="custom"
                  :label="$t('localization.Coin')">
                </el-table-column>
                <el-table-column
                  prop="price"
                  sortable="custom"
                  :label="$t('localization.Latest-price')">
                  <template slot-scope="scope">
                    <span style="color:#e45555;" v-if="scope.row.rise_fall==1">{{scope.row.price == null? '0':scope.row.price}}</span>
                    <span style="color:rgb(0, 178, 117);" v-else>{{scope.row.price == null? '0':scope.row.price}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sumMoney"
                  sortable="custom"
                  :label="$t('localization.Turnover')"
                  v-if="beanType=='1'">
                  <template slot-scope="scope">
                    <span>{{scope.row.sumMoney == null?'0':Number(scope.row.sumMoney).toFixed(4)}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="increase"
                  sortable="custom"
                  :label="$t('localization.change')"
                  v-if="beanType=='2'">
                  <template slot-scope="scope">
                    <span style="color:#e45555;" v-if="scope.row.rise_fall==1">{{scope.row.increase == null?'0.00%':Number(scope.row.increase).toFixed(2)+'%'}}</span>
                    <span style="color:rgb(0, 178, 117);" v-else>{{scope.row.increase == null?'0.00%':Number(scope.row.increase).toFixed(2)+'%'}}</span>
                  </template>
                </el-table-column>
              </el-table>
           </div>
           <!-- 最新成交 -->
           <newDeal ref='nerDeal'></newDeal>
        </div>
        <div class="right">
          <!-- 总数据 -->
          <div class="totalData">
             <div class="price_section">
               <h1>{{totalParams.asset_name}} / {{totalParams.bev_name}}</h1>
               <span style="color:#e45555;" v-if="topBeanData.rise_fall=='1'">{{topBeanData.price}}</span>
               <span style="color:#00b275;" v-if="topBeanData.rise_fall=='0'">{{topBeanData.price}}</span>
               <span>{{topBeanData.rate}} CNY</span>
             </div>
             <ul class="ticker_section">
               <li>
                  <div class="item">
                    <span>{{$t('localization.24H-change')}}</span>
                    <p style="color:#e45555;" v-if="topBeanData.rise_fall=='1'">{{topBeanData.increase}}%</p>
                    <p style="color:#00b275;" v-if="topBeanData.rise_fall=='0'">{{topBeanData.increase}}%</p>
                  </div>
               </li>
               <li>
                  <div class="item">
                    <span>{{$t('localization.24H-Highest')}}</span>
                    <p>{{topBeanData.maxPrice}} {{totalParams.bev_name}}</p>
                  </div>
               </li>
               <li>
                  <div class="item">
                    <span>{{$t('localization.24H-Lowest')}}</span>
                    <p>{{topBeanData.minPrice}} {{totalParams.bev_name}}</p>
                  </div>
               </li>
               <li>
                  <div class="item">
                    <span>{{$t('localization.24H-Volume')}} / {{$t('localization.Turnover')}}</span>
                    <p>{{topBeanData.sumNumber}} {{totalParams.asset_name}} / {{topBeanData.sumMoney}} {{totalParams.bev_name}}</p>
                  </div>
               </li>  
             </ul>
          </div>
          <div class="content">
             <!-- k线图和委托 -->
             <div class="middle">
                <!-- k线图 -->
                <div class="kline">
                  <kline ref="kline" />
                </div>
                <!-- 委托 -->
                <div class="trade_section" v-loading="fullscreenLoading">
                  <div class="title">
                    <img src="../../assets/fire.png"> {{$t('localization.use')}} {{totalParams.poundage_name}} {{$t('localization.as-Fees')}}（{{totalParams.poundage_number}} {{totalParams.poundage_name}} / {{$t('localization.each-shipment')}}）
                  </div>
                  <div class="entrust_content">
                    <div class="tab">
                      <span>{{$t('localization.Limit')}}</span>
                    </div>
                    <div class="recharge">
                       <div class="ft">
                         {{$t('localization.Available')}}：{{totalParams.bev_number}}{{totalParams.bev_name}}
                       </div>
                       <div class="gt">
                         {{$t('localization.Available')}}：{{totalParams.asset_number}}{{totalParams.asset_name}}
                       </div>
                    </div>
                    <!-- 购买 -->
                    <el-form :model="limitBuy" :rules="limitBuyrule" ref="limitBuy" label-width="80px" class="demo-ruleForm">
                      <el-form-item :label="$t('localization.buyPrice')" prop="price">
                        <span>{{totalParams.bev_name}}</span>
                        <el-input type="number" v-model="limitBuy.price" autocomplete="off"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('localization.buyAmount')" prop="number">
                        <span>{{totalParams.asset_name}}</span>
                        <el-input type="number" v-model="limitBuy.number" @keyup.enter.native="limitBuySubmit('limitBuy')" autocomplete="off"></el-input>
                      </el-form-item>
                      <div class="tip">
                        {{$t('localization.EST-Value')}}：{{limitBuyTotalPrice}}{{totalParams.bev_name}}
                        <!-- 是否登录 是否开启手续费 手续费是否为0 -->
                        <span v-if="isLogin">{{$t('localization.Service-charge')}}：
                           <s v-if="totalParams.poundage_tm==1">
                              <!-- 开启手续费 -->
                              <i v-if="Number(totalParams.poundage_number)>0">{{limitBuyCharge}} {{totalParams.poundage_name}}</i>
                              <i v-else style="color:#e45555;">{{$t('localization.Limited-free')}}</i>
                           </s>
                           <s v-else>
                              <i>{{limitBuyCharge}} {{totalParams.asset_name}}</i>
                           </s>
                        </span>
                        <span v-else>{{$t('localization.Service-charge')}}：
                          <s>
                             <i>{{limitBuyCharge}} {{totalParams.asset_name}}</i>
                          </s>
                        </span>
                      </div>
                      <el-button type="primary" @click="limitBuySubmit('limitBuy')" class="buyBtn">{{$t('localization.Buy')}} {{totalParams.asset_name}}</el-button>
                    </el-form>
                    <!-- 出售 -->
                    <el-form :model="limitSell" :rules="limitSellrule" ref="limitSell" label-width="80px" class="demo-ruleForm sell">
                      <el-form-item :label="$t('localization.sellPrice')" prop="price">
                        <span>{{totalParams.bev_name}}</span>
                        <el-input type="number" v-model="limitSell.price" autocomplete="off"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('localization.sellAmount')" prop="number">
                        <span>{{totalParams.asset_name}}</span>
                        <el-input type="number" v-model="limitSell.number" @keyup.enter.native="limitSellSubmit('limitSell')" autocomplete="off"></el-input>
                      </el-form-item>
                      <div class="tip">
                        {{$t('localization.EST-Value')}}：{{limitSellTotalPrice}} {{totalParams.bev_name}}
                        <!-- 是否登录 是否开启手续费 手续费是否为0 -->
                        <span v-if="isLogin">{{$t('localization.Service-charge')}}：
                           <s v-if="totalParams.poundage_tm==1">
                              <!-- 开启手续费 -->
                              <i v-if="Number(totalParams.poundage_number)>0">{{limitSellCharge}} {{totalParams.poundage_name}}</i>
                              <i v-else style="color:#e45555;">{{$t('localization.Limited-free')}}</i>
                           </s>
                           <s v-else>
                              <i>{{limitSellCharge}} {{totalParams.bev_name}}</i>
                           </s>
                        </span>
                        <span v-else>{{$t('localization.Service-charge')}}：
                          <s>
                             <i>{{limitSellCharge}} {{totalParams.bev_name}}</i>
                          </s>
                        </span>
                      </div>
                      <el-button type="primary" @click="limitSellSubmit('limitSell')" class="sellBtn">{{$t('localization.Sell')}} {{totalParams.asset_name}}</el-button>
                    </el-form>
                  </div>
                  <div class="modal" v-if="!isLogin">
                     <h1>{{$t('localization.Please')}}
                       <router-link to="/login" class="login">{{$t('localization.Sign-in')}}</router-link> / 
                       <router-link to="/register" class="register">{{$t('localization.Sign-up')}}</router-link>
                     </h1>
                  </div>
                </div>
             </div>
             <!-- 深度图 -->
             <depth :depthData="depthData?depthData:''" ref="depth" :depthParams="depthParams" @changeDepthType="getDepthType" @depthBuyPrice='getDepthBuyPrice' @depthSellPrice='getDepthSellPrice'></depth>
          </div>
          <!-- 委托列表 -->
          <entrust @updateParams="updateParams" :isLogin="isLogin" ref="entrust"></entrust>
        </div>
      </div>
  </div>
</template>

<script>
import callback from "../../utile/callback.js"
import depth from './Depth.vue'
import entrust from './Entrust.vue'
import newDeal from './NewDeal.vue'
import kline from './Kline.vue'
import fixed from '../../utile/fixed.js'
export default {
  components:{
    depth,
    entrust,
    newDeal,
    kline
  },
  data() {
      var regNum =/^\d+(\.\d{1,4})?$/;//精确到小数点后4位
      var numCheck = (rule, value, callback) => {
        if(Number(value) > this.maxBuyAssets){
          callback(new Error(this.$t('localization.Insufficient-assets')));
        }else if (value <= 0) {
          callback(new Error(this.$t('localization.Least-buy')));
        }else if(!regNum.test(value)){
          callback(new Error(this.$t('localization.Up-to-4')));
        }else {
          callback();
        }
      };
      var priceCheck = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('localization.Price-tip')));
        }else if (value <= 0) {
          callback(new Error(this.$t('localization.Price-than-0')));
        }else if(!regNum.test(Number(value))){
          callback(new Error(this.$t('localization.Up-to-4')));
        }else {
          callback();
        }
      };
      var sellNumCheck = (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error(this.$t('localization.Quantity-than-0')));
        }else if(Number(value) > this.maxSellAsset){
          callback(new Error(this.$t('localization.Insufficient-assets')));
        }else if(!regNum.test(Number(value))){
          callback(new Error(this.$t('localization.Up-to-4')));
        }else {
          callback();
        }
      };
      var msellNumCheck = (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error(this.$t('localization.Quantity-than-0')));
        }else if(!regNum.test(Number(value))){
          callback(new Error(this.$t('localization.Up-to-4')));
        }else {
          callback();
        }
      };
      var entrustSellNum = (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error(this.$t('localization.Quantity-than-0')));
        }else if(!regNum.test(Number(value))){
          callback(new Error(this.$t('localization.Up-to-4')));
        }else {
          callback();
        }
      };
      return {
        fullscreenLoading:false,
        exchange:'',
        order:1,
        isLogin:true,
        userParams:'',
        field:4,
        own:2,
        depthType:3,
        beanId:'',
        showChecked:false,
        searchName:'',
        quotationData:[],
        depthData:{},
        topBeanData:{},
        newDealId:'',
        depthParams:{
          currentPrice:'',
          cny:'',
          bve:'',
          asset_name:'',
          increase:''
        },
        beanType:'2',
        limitSellTotalPrice:0,
        limitBuyTotalPrice:0,//购买预计交易总额
        limitBuyCharge:0,//购买手续费
        limitSellCharge:0,//出售手续费
        limitBuy: {
          price:'',
          number:'',
          type:1
        },
        limitSell: {
          price:'',
          number:'',
          type:2
        },
        depthBuyNumber:'',
        depthSellNumber:'',
        totalParams:{},
        maxBuyAssets:'',
        maxSellAsset:'',
        limitBuyrule: {
          price: [
            { validator: priceCheck}
          ],
          number: [
            { validator: numCheck}
          ]
        },
        limitSellrule: {
          price: [
            { validator: priceCheck}
          ],
          number: [
            { validator: sellNumCheck}
          ]
        }
      };
    },
    created(){
      if(localStorage.getItem('beanId')){
        this.beanId = localStorage.getItem('beanId')
      }else if(this.$route.query.id){
        this.beanId = this.$route.query.id
      }
      this.checkToken();//检查登录态
      this.getDataParams()
      var _this = this
      //监听websocket数据
      this.$bus.$on('soketData',(data) => {
          if(data.type=='quotation'){
            //更新顶部数据
            if(Number(_this.beanId)==Number(data.id)){
              _this.topBeanData = data.list
              _this.depthParams.currentPrice = data.list.price,
              _this.depthParams.increase = data.list.rise_fall
              _this.depthParams.cny = data.list.rate
            }
            //更新行情
            _this.quotationData.forEach(function(val){
               if(val.id == data.id){
                 val.increase = data.list.increase
                 val.price = data.list.price
                 val.sumMoney = data.list.sumMoney
                 val.rise_fall = data.list.rise_fall
               }
            })
          }
          //最新成交市场数据
          if(data.type=='newCoinQuotation'){
            if(Number(_this.beanId) == Number(data.id)){
              _this.$refs.nerDeal.updateWebsoket(data.list)
            }
          }
          //更新盘口（委托）数据
          if(data.type=='depth_pc'){
            if(Number(_this.beanId) == Number(data.id)){
              _this.$refs.depth.updateWebsoket(data.list)
            }
          }
      });
    },
    methods: {
      /*
       初始化k线图
      */
      initKline(symbol){
        this.$refs.kline.removeWidget()
        this.$refs.kline.init(symbol,'5',this.$i18n.locale.split('-')[0])
      },
      /*
        行情数据切换
      */
      quotation(){
        var url = this.$urlPrefix+'/quotation'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token,
          abb:this.searchName,
          type:this.beanType, //1.成交额 2.涨跌
          order:this.order, // 1.倒序 2.正序
          field:this.field, // 1.币种 2.最新价 3.成交额 4.涨跌
          own:this.own  //1.是 2.否
        }
        // console.log(data)
        this.$http.post(url,data).then(function(response){
           var result = JSON.parse(response.body)
           this.quotationData = result
        })
      },
      /*
        检查登录态
      */
      checkToken(){
        var token = localStorage.getItem('token')
        if(token){
          this.isOverdue(token)//检查token是否过期
        }else{
          this.isLogin = false
        }
      },
      /*
        检查token是否过期
      */
      isOverdue(token){
        var url = this.$urlPrefix+'/vLogin'
        var data={
          _ajax:1,
          toKey:token
        }
        this.$http.post(url,data).then(function(response){
           var result = response.body
           if(response.body.code==1){
              //没过期
              this.isLogin = true
           }else{
              //过期
              this.isLogin = false
           }
        })
      },
      /*
        页面参数，币种和数量
      */
      getDataParams(){
        var url = this.$urlPrefix+'/poundage'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token,
          asset_id:this.beanId,//币种id
          type:this.depthType,//深度类型
          quotation_type:this.beanType,//行情类型
          quotation_order:1,//行情排序
          quotation_field:this.field,//行情搜索分类
          quotation_abb:this.searchName,//行情搜索
          own:this.own//自选
        }
        this.$http.post(url,data).then(function(response){
           var result = response.body.data
           if(response.body.code==1){
              this.totalParams = result
              this.exchange = result.asset_name+'/'+result.bev_name
              if(this.beanId){
                this.getDepthData()//深度数据
                this.$refs.nerDeal.updateNewDeal(this.beanId)//最新成交市场数据
                // 委托数据
                this.$refs.entrust.currentEntrust(this.beanId)
                this.$refs.entrust.recordEntrust(this.beanId)
              }else{
                if(result.id){
                  this.beanId = result.id.toString()
                  this.quotation()//行情数据
                  this.getDepthData()//深度数据
                  this.$refs.nerDeal.updateNewDeal(this.beanId)//最新成交市场数据

                  // 委托数据
                  this.$refs.entrust.currentEntrust(this.beanId)
                  this.$refs.entrust.recordEntrust(this.beanId)
                }
              }
              
              this.getBeanData()//顶部信息
              this.depthParams.bve = result.bev_name,
              this.depthParams.asset_name = result.asset_name
              if(result.asset_number != '0'){
                this.maxSellAsset = result.asset_number
              }
              if(this.limitBuy.price){
                this.maxBuyAssets  = result.bev_number/this.limitBuy.price
              }
           }
        })
      },
      /*
        顶部数据
      */
      getBeanData(){
        var url = this.$urlPrefix+'/aloneQuotation'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token,
          asset_id:this.beanId
        }
        this.$http.post(url,data).then(function(response){
           var result = JSON.parse(response.body)
           this.topBeanData = result
           this.limitBuy.price = this.limitSell.price = result.price
           this.depthParams.currentPrice = result.price,
           this.depthParams.increase = result.rise_fall
           this.depthParams.cny = result.rate
        })
      },
      /*
        深度数据
      */
      getDepthData(){
        var url = this.$urlPrefix+'/depth'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token,
          asset_id:this.beanId,
          type:this.depthType
        }
        this.$http.post(url,data).then(function(response){
           this.depthData = JSON.parse(response.body)
        })
      },
      /*
        更新参数
      */
      updateParams(){
        this.getDataParams()
        //刷新发布委托表单数量
        var str = (this.totalParams.bev_number/this.limitBuy.price).toString()
        this.limitBuy.number = str.split('.')[0]+'.'+str.split('.')[1].substr(0, 4)
        this.limitSell.number = this.maxSellAsset
      },
      /*
       切换深度显示类型
      */
      getDepthType(type){
        this.depthType = type
        this.getDepthData()
      },
      /*
       点击购买挂单
      */
      getDepthBuyPrice(data){
        this.depthSellNumber = data.number
        if(this.limitSell.price == data.price){
            if(this.depthSellNumber && Number(this.depthSellNumber) < Number(this.maxSellAsset)){
              this.limitSell.number = this.depthSellNumber
            }else{
              this.limitSell.number = this.maxSellAsset
            }
        }else{
          this.limitSell.price = data.price
        }
      },
      /*
       点击出售挂单
      */
      getDepthSellPrice(data){
        this.depthBuyNumber = data.number
        if(this.limitBuy.price == data.price){
            var val = data.price
            this.maxBuyAssets = Number(this.totalParams.bev_number/val)
            if(this.depthBuyNumber && this.depthBuyNumber < this.maxBuyAssets){
              this.limitBuy.number = this.depthBuyNumber
            }else{
              this.limitBuy.number = fixed.toFixed4(this.maxBuyAssets)
            }
        }else{
          this.limitBuy.price = data.price
        }
      },
      /*
       行情交易对搜索
      */
      quotationsSearch(){
        this.quotation()
      },
      /*
        显示自选
      */
      confirmSelect(row){
        this.toggleSelect(row,1)
      },
      /*
        不显示自选
      */
      giveupSelect(row){
        this.toggleSelect(row,0)
      },
      toggleSelect(row,status){
        var url = this.$urlPrefix+'/collect'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token,
          asset_id:row.id,
        }
        this.$http.post(url,data).then(function(response){
           var result = response.body
           if(response.body.code==1){
             row.collect=status
           }else{
             callback.callback(this,response.body)
           }
        })
      },
      giveUpCollection(row){
        var url = this.$urlPrefix+'/collect'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token,
          asset_id:row.id,
        }
        this.$http.post(url,data).then(function(response){
           var result = response.body
           if(response.body.code==1){
             this.quotation()
           }
        })
      },
      quotationCellStyle({row, column, rowIndex, columnIndex}){
         if(row.id == this.beanId){
           if(columnIndex==0){
              return 'border-left:4px solid #00c1ce;'
           }
         }
      },
      cellStyle({row, column, rowIndex, columnIndex}){
        if(columnIndex == 2){
          if(row.price>0){
            return 'color:#00b275'
          }else if(row.price < 0){
            return 'color:#ef5057'
          }
        }
        if(columnIndex == 3){
          if(row.high>0){
            return 'color:#00b275'
          }else if(row.high < 0){
            return 'color:#ef5057'
          }
        }
      },
      /*
        排序
      */ 
      sortChange(val){
        if(this.beanType=='2'){
          if(val.prop == 'sumMoney'){
            val.prop='increase'
          }
        }
        if(this.beanType=='1'){
          if(val.prop == 'increase'){
            val.prop='sumMoney'
          }
        }
        switch(val.prop){
            case '':
                this.field=3;
                break;
            case 'abb':
                this.field=1;
                break;
            case 'price':
                this.field=2;
                break;
            case 'sumMoney':
                this.field = 3;
                break;
            case 'increase':
                this.field = 4;
                break;
            default:break;

        }
        val.order =='descending'?this.order = 1:this.order = 2
        this.quotation()
      },
      // 切换币种
      selectRow(row, event, column){
        if(column.label){
          this.beanId = row.id.toString()
          this.getDataParams()
          localStorage.setItem('beanId',row.id)
        }else{
          return false;
        }
      },
      // 限价购买
      limitBuySubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.limitSubmit(this.limitBuy)
          } else {
            return false;
          }
        });
      },
      // 限价出售
      limitSellSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.limitSubmit(this.limitSell)
          } else {
            return false;
          }
        });
      },
      limitSubmit(formData){
        var url = this.$urlPrefix+'/entrustCoin'
        var token = localStorage.getItem('token')
        formData._ajax = 1
        formData.toKey = token
        formData.asset_id = this.beanId
        this.fullscreenLoading = true
        this.$http.post(url,formData).then(function(response){
           var result = response.body
           if(response.body.code == 1){
              //刷新发布委托表单数量
              var str = (this.totalParams.bev_number/this.limitBuy.price).toString()
              this.limitBuy.number = str.split('.')[0]+'.'+str.split('.')[1].substr(0, 4)
              this.limitSell.number = this.maxSellAsset

              this.fullscreenLoading = false
              this.$message({
                message: result.msg,
                type: 'success'
              });
              this.getDataParams()
              this.$refs.nerDeal.updateNewDeal(this.beanId)//最新成交市场数据
              this.$refs.entrust.updateEntrust(this.beanId)//触发entrust组件内的方法
           }else{
              this.fullscreenLoading = false
              this.$message({
                message: result.msg,
                type: 'error'
              });
           }
        })
      }
    },
    // 页面卸载
    destroyed(){
      localStorage.removeItem('beanId')
    },
    watch:{
       showChecked(val){
          if(val){
             this.own = 1
          }else{
             this.own = 2
          }
          this.quotation()
       },
       beanType(val){
          val=='2'?this.field=4:this.field=3
          this.quotation()
       },
       'limitBuy.number':function(val){
          if(Number(val)<=0){
            this.limitBuyTotalPrice='0.0000'
            this.limitBuyCharge='0.0000'
            return false;
          }
          //交易额
          if(Number(this.limitBuy.price)>0){
             this.limitBuyTotalPrice = (val*(this.limitBuy.price)).toFixed(4)
          }
          //手续费
          this.limitBuyCharge = (Number(val)*Number(this.totalParams.poundage_number)).toFixed(4)
       },
       'limitBuy.price':function(val){
          if(Number(val)>0){
            var str = (this.totalParams.bev_number/val).toString()
            if(Number(str)>0){
              this.maxBuyAssets = str.split('.')[0]+'.'+str.split('.')[1].substr(0, 4)
            }
            if(this.depthBuyNumber && this.depthBuyNumber < this.maxBuyAssets){
              this.limitBuy.number = this.depthBuyNumber
            }else{
              this.limitBuy.number = this.maxBuyAssets
            } 
          }else{
            this.limitBuy.number=''
          }
       },
       'limitSell.number':function(val){
          if(Number(val)<=0){
            this.limitSellTotalPrice='0.0000'
            this.limitSellCharge = '0.0000'
            return false;
          }
          //交易额
          if(Number(this.limitSell.price)>0){
             this.limitSellTotalPrice  = (val*(this.limitSell.price)).toFixed(4)
          }
          //手续费
          this.limitSellCharge = (Number(val)*Number(this.totalParams.poundage_number)).toFixed(4)
       },
       'limitSell.price':function(val){
          if(Number(val)>0){
            this.limitSellTotalPrice  = (val*(this.limitSell.number)).toFixed(4)
          }else{
            this.limitSellTotalPrice='0.0000'
          }
          if(this.depthSellNumber && Number(this.depthSellNumber) < Number(this.maxSellAsset)){
            this.limitSell.number = this.depthSellNumber
          }else{
            this.limitSell.number = this.maxSellAsset
          }
       },
       '$i18n.locale':function(val){
         this.initKline(this.exchange)
       },
       exchange(val){
         if(val){
           this.initKline(val)
         }else{
           this.initKline(null)
         } 
       }
    }
}
</script>
