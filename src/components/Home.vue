<template>
  <div class="home_container">
    <div class="banner">
        <el-carousel height="100%">
          <el-carousel-item v-for="(item,index) in bannerList" :key="index">
            <img :src="item.path">
          </el-carousel-item>
        </el-carousel>
    </div>
    <div class="quotations_content">
      <div class="quotation ft">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane name="1" class="tabs">
              <span slot="label"><i class="el-icon-star-off"></i> {{ $t("localization.Optional") }}</span>
          </el-tab-pane>
          <el-tab-pane class="tabs" name="2">
              <span slot="label">BVE{{ $t("localization.Market") }}</span>
          </el-tab-pane>
        </el-tabs>
        <!-- 行情列表 -->
        <el-table
          ref="collection"
          :data="tableData"
          highlight-current-row
          tooltip-effect="dark"
          style="width: 100%"
          :default-sort="{prop: 'sumMoney', order: 'descending'}"
          class="selfSelection"
          @row-click="selectRow">
          <el-table-column
          width="100">
            <template slot-scope="scope">
              <!-- 自选 -->
              <span style="color:#FFBC32;font-size:16px;" v-if="activeTab=='1'">
                <i class="el-icon-star-on" @click="giveUpCollection(scope.row)"></i>
              </span>
              <!-- 非自选 -->
              <span style="color:#FFBC32;font-size:16px;" v-else>
                <i class="el-icon-star-off" v-if="scope.row.collect==0" @click="confirmSelect(scope.row)"></i>
                <i class="el-icon-star-on" v-if="scope.row.collect==1" @click="giveupSelect(scope.row)"></i>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="abb"
            :label="$t('localization.Coin')"
            width="100">
          </el-table-column>
          <el-table-column
            :label="$t('localization.Price')">
            <template slot-scope="scope">
              <span style="color:#e45555" v-if="scope.row.rise_fall==1">{{scope.row.price}}</span>
              <span style="color:rgb(0, 178, 117)" v-else>{{scope.row.price}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="maxPrice"
            :label="$t('localization.24H-Highest')">
          </el-table-column>
          <el-table-column
            prop="minPrice"
            :label="$t('localization.24H-Lowest')">
          </el-table-column>
          <el-table-column
            :label="$t('localization.24H-change')">
            <template slot-scope="scope">
              <span class="increase" v-if="scope.row.rise_fall==1">{{scope.row.increase}}%</span>
              <span class="increase lower" v-else>{{scope.row.increase}}%</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sumNumber"
            :label="$t('localization.24H-Volume')">
          </el-table-column>
          <el-table-column
            prop="sumMoney"
            :label="$t('localization.24H-Turnover')"
            sortable>
          </el-table-column>
          <el-table-column
            width="200"
            :label="$t('localization.Operation')">
            <template slot-scope="scope">
              <a href="javascript:;" @click="prepareDeal(scope.row.id)">{{ $t("localization.Go-Trade") }}
                <i class="el-icon-arrow-right"></i>
              </a>
            </template>
          </el-table-column>
        </el-table>
        <div class="quotations_search">
           <input type="text" @keyup.enter="quotationsSearch" v-model="currencyName" :placeholder="$t('localization.Enter-coin-name')" name="quotationsSearchVal"/>
           <i class="el-icon-search" @click="quotationsSearch"></i>
        </div>
      </div>
      <!-- 概况 -->
      <div class="introduce">
        <p class="title">{{$t('localization.Survey')}}
          <span>
            <i class="el-icon-star-off" v-if="currentInfo.collect==0" @click="confirmSelect(currentInfo)"></i>
            <i class="el-icon-star-on" v-if="currentInfo.collect==1" @click="giveupSelect(currentInfo)"></i>
          </span> 
        </p>
        <div class="content">
          <div class="info">
            <h1>{{assetsInfo.abb_team}}</h1>
            <div class="params">
              <div class="assetsLogo">
                <img :src="assetsInfo.path">
              </div>
              <div class="info">
                <p :style="currentInfo.rise_fall==1?'color:#e45555':'color:rgb(0, 178, 117)'">{{currentInfo.price}}</p>
                <span>≈ ￥{{(currentInfo.price*assetsInfo.rate).toFixed(4)}}</span>
                <span>{{$t('localization.24H-Volume')}} {{currentInfo.sumNumber}}</span>
                <p :style="currentInfo.rise_fall==1?'color:#e45555':'color:rgb(0, 178, 117)'">{{currentInfo.increase}}%</p>
                <div class="exchange">
                  <a href="javascript:;" @click="prepareDeal(currentInfo.id)">{{ $t("localization.Go-Trade") }}</a>
                </div>
              </div>
            </div>
          </div>
          <div class="detail">
            <div class="title">
              {{$t('localization.Basic-info')}}
            </div>
            <div class="detail">
              <ul>
                <li><div class="name ft">{{$t('localization.Currency-name')}}</div><span class="gt">{{assetsInfo.name}}</span></li>
                <li><div class="name ft">{{$t('localization.Issue-time')}}</div><span class="gt">{{assetsInfo.create_time}}</span></li>
                <li><div class="name ft">{{$t('localization.Issue-amount')}}</div><span class="gt">{{assetsInfo.found_total}}</span></li>
                <li><div class="name ft">{{$t('localization.Remittance-amount')}}</div><span class="gt">{{assetsInfo.release_total}}</span></li>
                <li><div class="name ft">{{$t('localization.Related-links')}}</div>
                  <span class="gt">
                    <a href="http://www.creation.link" target="_blank">{{$t('localization.Block-query')}}</a>
                  </span>
                </li>
                <li><div class="name ft">{{$t('localization.Introduction')}}</div></li>
              </ul>
              <div class="content" v-html="assetsInfo.introduce">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="desc">
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
    </div> -->
  </div>
</template> 

<script>
var self=[];
var other=[];
import callback from "../utile/callback.js"
export default {
  name: 'Home',
  data () {
    return {
        tableData: [],
        currencyName:'',
        activeTab:"2",
        assetsInfo:{},
        currentInfo:{},
        isLogin:true,
        bannerList:[]
    }
  }, 
  created(){
    this.checkToken()
    this.getBanner()
    this.init()
    //监听websoket新消息
    var _this = this
    this.$bus.$on('soketData',(data) => {
      if(data.type=='quotation'){
         _this.tableData.forEach(function(val){
            if(val.id == data.id){
              val.increase = data.list.increase
              val.price = data.list.price
              val.sumMoney = data.list.sumMoney
              val.maxPrice = data.list.maxPrice
              val.minPrice = data.list.minPrice
              val.sumNumber = data.list.sumNumber
              val.rise_fall = data.list.rise_fall
            }
         })
      }
    });
  },
  methods:{
    /*
     轮播图
    */
    getBanner(){
      var url = this.$urlPrefix+'/apiBanner'
      var data={
        _ajax:1
      }
      this.$http.post(url,data).then(function(response){
          if(response.body.code==1){
             this.bannerList = response.body.data
          }
      })
    },
    /*
     初始化列表
    */ 
    init(){
      var url = this.$urlPrefix+'/quotationIndex'
      var token = localStorage.getItem('token')
      var data={
        _ajax:1,
        toKey:token,
        abb:this.currencyName,
        order:1,//排序 1：倒序 2：正序
        toKey:token,
        own:this.activeTab //自选 1：是 2：否
      }
      this.$http.post(url,data).then(function(response){
          var result = JSON.parse(response.body)
          if(result.length>0){
            this.tableData = result
            if(this.activeTab=='2'){
              this.currentInfo = result[0]
              this.assetsDetail()
            }
          }else{
            this.tableData = []
          }
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
     资产详情
    */
    assetsDetail(){
      var url = this.$urlPrefix+'/assetInfo'
      var data={
        _ajax:1,
        id:this.currentInfo.id
      }
      this.$http.post(url,data).then(function(response){
          var result = response.body.data
          if(response.body.code==1){
            this.assetsInfo = result
          }
      })
    },
    /*
     自选删除数据
    */
    giveUpCollection(row){
      if(row.id == this.currentInfo.id){
        this.currentInfo.collect==1? this.currentInfo.collect=0 : this.currentInfo.collect=1
      }
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
            this.init()
         }
      })
    },
    /*
     去交易进入行情页面
    */
    prepareDeal(id) {
      this.$router.push({
        path:'/quotation',
        query:{
          id:id
        }
      })
    },
    /*
     模糊搜索
    */
    quotationsSearch(){
      this.init()
    },
    /*
     列表添加自选
    */
    confirmSelect(row){
      this.toggleSelect(row,1)
      this.init()
    },
    /*
     列表取消自选
    */
    giveupSelect(row){
      this.toggleSelect(row,0)
      this.init()
    },
    /*
     列表自选切换请求后台
    */
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
    // 切换币种
    selectRow(row, event, column){
      if(column.label){
        this.currentInfo = row
        this.assetsDetail()
      }else{
        return false;
      }
    }
  },
  watch:{
    /*
     监听tab栏
    */
    activeTab:function(val){
      if(this.tableData){
        this.tableData=[]
      }
      this.init()

      if(!this.isLogin && val==1){
        this.tableData=[]
      }
    }
  }
}
</script>
<style lang='less'>
  .home_container{
    overflow: hidden;
    background: #f5f5f5;
    .banner{
        width: 100%;
        height: 540px;
        .el-carousel{
          width: 100%;
          height: 100%;
          .el-carousel__item{
              img{
                  width: 100%;
                  height: 100%;
              }
          }
        }
     }
     .quotations_content{
         width: 100%;
         min-width:1200px;
         height: 1000px;
         padding: 20px;
         display: flex;
         .quotation{
           flex:1;
           display: flex;
           flex-flow:column;
           position:relative;
           box-shadow: 0 0 15px rgba(0,0,0,0.05);
           .quotations_search{
             width: 210px;
             height: 28px;
             position:absolute;
             right:0px;
             top:6px;
             background-color: #f2f2f2;
             margin-right: 10px;
             border-radius: 15px;
             z-index:3;
             i{
               color:#e45555;
             }
             input{
                width: 80%;
                height:100%;
                line-height: 30px;
                background: transparent;
                border:0;
                outline:none;
                font-size:14px;
             }
             &:hover{
                border-color:#00c1ce;
             }
           }
           .el-table{
             flex:1;
             display: flex;
             flex-flow:column;
             .el-table__body-wrapper{
                flex:1;
                overflow-y: auto;
             }
           }
           .el-tabs{
             td{
               padding: 16px 0;
             }
             .el-table__body-wrapper,.el-table__empty-block{
               min-height: 400px;
             }
             .el-table__row{
                &:last-of-type{
                   td{
                     border-bottom: 0;
                   }
                }
             }
           }
         }
         .introduce{
           width: 360px;
           max-width: 400px;
           height: 100%;
           background-color: #fff;
           margin-left: 20px;
           display: flex;
           flex-flow:column;
           box-shadow: 0 0 15px rgba(0,0,0,0.05);
           .title {
             width: 100%;
             height: 40px;
             font-weight: 700;
             fone-size:12px;
             line-height: 40px;
             color:#333;
             padding-left:20px;
             border-bottom: 1px solid #00c1ce;
             text-align: left;
             span{
               float:right;
               height: 100%;
               margin-right: 15px;
               i{
                 font-size:20px;
               }
               .el-icon-star-on{
                 color:rgb(255, 188, 50)
               }
               .el-icon-star-off{
                 color:#888;
               }
             }
           }
           .content{
             flex:1;
             display: flex;
             flex-flow:column;
             .info{
                width: 100%;
                box-sizing: border-box;
                padding:24px 24px 10px;
                h1{
                  color: #555;
                  font-size: 26px;
                  text-align: left;
                  margin-bottom: 20px;
                }
                .params{
                  display: flex;
                  .assetsLogo{
                    width: 150px;
                    height: 100%;
                    img{
                      width: 80px;
                      height: 80px;
                      border-radius: 50%;
                      margin-top: 30px;
                    }
                  }
                  .info{
                    flex:1;
                    p,span{
                      text-align: right;
                    }
                    span{
                      display: block;
                      font-size:12px;
                      margin:10px 0;
                      color:#9ca9b5;
                    }
                    p{
                      font-size:18px;
                      color: #ef5656;
                      margin-bottom: 10px;
                    }
                    .exchange{
                      overflow: hidden;
                      a{
                        float:right;
                        width: 100px;
                        height: 32px;
                        line-height: 32px;
                        background: linear-gradient(270deg, #22e6b8, #00c1ce);
                        border-radius: 2px;
                        margin-top: 6px;
                        color: #fff;
                      }
                    }
                  }
                } 
             }
             .detail{
               flex:1;
               padding:10px 0;
               display: flex;
               flex-flow:column;
               .title{
                  font-weight: 700;
                  line-height: 40px;
                  border-bottom: 0;
                  background-color: #fff;
                  border-bottom: 1px solid #eee;
               }
               .detail{
                  flex:1; 
                  display: flex;
                  flex-flow:column;
                  ul{
                    padding:0 24px 10px;
                    li{
                      overflow: hidden;
                      height: 30px;
                      line-height: 30px;
                      font-size:14px;
                      color:#596a7a;
                      .name{
                        color:#9ca9b5;
                      }
                      a{
                        color:rgba(239,86,86,.8);
                      }
                    }
                  }
                  .content{
                    flex:1;
                    padding:10px 24px;
                    font-size:14px;
                    line-height: 20px;
                    text-align: left;
                    overflow-y: auto;
                  }
               }
             }
           }
         }
     }
     .desc{
        max-width: 1366px;
        min-width: 1200px;
        margin: 20px auto;
        height: 400px;
        background-color: #fff;
        .item{
           width: 31%;
           margin-right:1.5%;
           float:left;
           height: 100%;
           background-color: #ccc;
           &:last-of-type{
             margin-right: 0;
           }
           &:first-of-type{
             margin-left: 2%;
           }
           
        }
     }
  }
</style>
