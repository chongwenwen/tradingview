<template>
    <div class="exchange_contin">
        <div class="content">
            <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
                <!-- 模糊搜索 -->
                <div class="search">
                    <div class="item">
                        <div class="input_item currency">
                            {{$t("localization.Coin")}}：
                            <el-select v-model="search.name" :placeholder="$t('localization.Please-choose')" @change="switchLanguage(search.name)" class="el-select">
                              <el-option :label="$t('localization.All')" value="0">
                              </el-option>
                              <el-option :label="item.abb" v-for="(item,index) in currencyNameList" :key="index" :value="item.abb">
                              </el-option>
                            </el-select>
                        </div>
                        <div class="input_item">
                            {{$t('localization.Operation-type')}}：
                            <el-select v-model="search.type" :placeholder="$t('localization.Please-choose')" @change="switchLanguage(search.type)" class="el-select">
                              <el-option :label="$t('localization.All')" value="0">
                              </el-option>
                              <el-option :label="$t('localization.Buy')" value="1">
                              </el-option>
                              <el-option :label="$t('localization.Sell')" value="2">
                              </el-option>
                            </el-select>
                        </div>
                        <div class="input_item time">
                            {{$t('localization.Time')}}：
                             <el-date-picker
                              v-model="search.time"
                              type="month"
                              :placeholder="$t('localization.Selection-time')">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
                <!-- 当前委托 -->
                <el-tab-pane name="1" class="tabs">
                    <span slot="label">{{$t('localization.Current-orders')}}</span>
                    <el-table
                      :data="currentData"
                      tooltip-effect="dark"
                      style="width: 100%"
                      :header-cell-style="rowClass"
                      v-loading="fullscreenLoading">
                      <el-table-column
                        prop="time"
                        width="220"
                        :label="$t('localization.Order-time')">
                      </el-table-column>
                      <el-table-column
                        prop="abb"
                        :label="$t('localization.Coin')">
                      </el-table-column>
                      <el-table-column
                        prop="type"
                        :label="$t('localization.Operation-type')">
                      </el-table-column>
                      <el-table-column
                        prop="price"
                        :label="$t('localization.entrust-price')">
                      </el-table-column>
                      <el-table-column
                        prop="number"
                        :label="$t('localization.entrust-amount')">
                      </el-table-column>
                      <el-table-column
                        prop="nodeal_number"
                        :label="$t('localization.Unexecuted')">
                      </el-table-column>
                      <el-table-column
                        prop="deal_number"
                        :label="$t('localization.Executed')">
                      </el-table-column>
                      <el-table-column
                        :label="$t('localization.Operation')"
                        width="200">
                        <template slot-scope="scope">
                          <a href="javascript:;" class="option" @click="revokeEntrust(scope.row.id)">{{$t('localization.Revoke')}}</a>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-pagination
                      v-if="activeTab =='1' && totalPage>1"
                      @current-change="handleCurrentChange"
                      :current-page.sync="currentPage"
                      :page-size="pageSize"
                      layout="prev, pager, next, jumper"
                      :total="currentTotalCount"
                      :prev-text="$t('localization.Previous-page')"
                      :next-text="$t('localization.next-page')">
                    </el-pagination>
                </el-tab-pane>
                <!-- 委托记录 -->
                <el-tab-pane class="tabs" name="2">
                    <span slot="label">{{$t('localization.Order-history')}}</span>
                    <el-table
                      :data="recordData"
                      tooltip-effect="dark"
                      style="width: 100%"
                      :header-cell-style="rowClass"
                      v-loading="fullscreenLoading">
                      <el-table-column
                        prop="time"
                        :label="$t('localization.Closing-time')">
                      </el-table-column>
                      <el-table-column
                        prop="abb"
                        :label="$t('localization.Coin')">
                      </el-table-column>
                      <el-table-column
                        prop="type"
                        :label="$t('localization.Transaction-type')">
                      </el-table-column>
                      <el-table-column
                        prop="price"
                        :label="$t('localization.Executed-price')">
                      </el-table-column>
                      <el-table-column
                        prop="deal_number"
                        :label="$t('localization.Executed-volume')">
                      </el-table-column>
                      <el-table-column
                        prop="total_price"
                        :label="$t('localization.Executed-value')">
                      </el-table-column>
                      <el-table-column
                        prop="poundage"
                        :label="$t('localization.Service-charge')">
                      </el-table-column>
                    </el-table>
                    <el-pagination
                      v-if="activeTab =='2' && h_totalPage>1"
                      @current-change="h_CurrentChange"
                      :current-page.sync="h_currentPage"
                      :page-size="h_pageSize"
                      layout="prev, pager, next, jumper"
                      :total="historyTotalCount"
                      :prev-text="$t('localization.Previous-page')"
                      :next-text="$t('localization.next-page')">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import dateFilter from '../utile/date.js'
export default {
  name: 'Exchange',
  data() {
       return{
         activeTab:'1',
         currentData:[],
         recordData:[],
         currencyNameList:[],
         currentPage:1,
         pageSize:0,
         totalPage:0,
         h_currentPage:1,
         h_pageSize:0,
         h_totalPage:0,
         search:{
           name:'0',
           type:'0',
           time:''
         },
         currentTotalCount:0,
         historyTotalCount:0,
         fullscreenLoading:false
       }
    },
    created(){
       this.getCurrency()
       if(this.$route.query.type=="record"){
          this.activeTab = "2"
          this.getRecord()
       }else{
          this.init()
       }
    },
    methods: {
      getCurrency(){
        var url = this.$urlPrefix+'/getCoin'
        var token = localStorage.getItem('token')
        var data={
           _ajax:1
        }
        this.$http.post(url,data).then(function(response){
           var result = response.body.data
           if(response.body.code==1){
              this.currencyNameList = result
           }
        })
      },
      init(){
        var url = this.$urlPrefix+'/myCoinEntrustCurrentList'
        var token = localStorage.getItem('token')
        var data={
           _ajax:1,
           toKey:token,
           page:this.currentPage,
           abb:this.search.name,
           type:this.search.type,
           time: this.search.time?dateFilter.formatTime(this.search.time):''
        }
        this.$http.post(url,data).then(function(response){
           var result = response.body.data
           if(response.body.code==1){
              this.fullscreenLoading  = false
              this.currentData = result.data
              this.totalPage = result.last_page
              this.pageSize = result.per_page
              this.currentTotalCount = result.total
           }
        })
      },
      getRecord(){
        var url = this.$urlPrefix+'/myCoinEntrustHistoryList'
        var token = localStorage.getItem('token')
        var data={
           _ajax:1,
           toKey:token,
           page:this.h_currentPage,
           abb:this.search.name,
           type:this.search.type,
           time: this.search.time?dateFilter.formatTime(this.search.time):''
        }
        this.$http.post(url,data).then(function(response){
           var result = response.body.data
           if(response.body.code==1){
              this.fullscreenLoading  = false
              this.recordData = result.data
              this.h_totalPage = result.last_page
              this.h_pageSize = result.per_page
              this.historyTotalCount = result.total
           }
        })
      },
      rowClass({ row, rowIndex}) {
        if(rowIndex == 0){
            return 'background:#f9f9f9'
        }
      },
      switchLanguage(){

      },
      handleClick(){
        this.search={
           name:'',
           type:'',
           time:''
         }
      },
      revokeEntrust(id){
        this.$confirm(this.$t('localization.Confirm-Revoke-Tip'), this.$t('localization.Revoke-tips'), {
          confirmButtonText: this.$t('localization.Yes'),
          cancelButtonText: this.$t('localization.No'),
          type: 'warning',
          center: true
        }).then(() => {
          this.revoke(id);
        }).catch(() => {
          
        });
      },
      revoke(id){
        var url = this.$urlPrefix+'/revokeCoinEntrust'
        var token = localStorage.getItem('token')
        var data={
           _ajax:1,
           toKey:token,
           id:id
        }
        this.$http.post(url,data).then(function(response){
           if(response.body.code==1){
              this.$message({
                message: response.body.msg,
                type: 'success'
              });
              this.init()
           }
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.fullscreenLoading = true
        this.init()
      },
      h_CurrentChange(val){
        this.h_currentPage = val
        this.fullscreenLoading = true
        this.getRecord()
      }
    },
    watch:{
      activeTab(val){
        this.currentPage = this.h_currentPage = 1
        val=="1"? this.init():this.getRecord()
      },
      'search.name':function(val){
        this.currentPage = this.h_currentPage = 1
        this.activeTab=='1'? this.init():this.getRecord()
      },
      'search.type':function(val){
        this.currentPage = this.h_currentPage = 1
        this.activeTab=='1'? this.init():this.getRecord()
      },
      'search.time':function(val){
        this.currentPage = this.h_currentPage = 1
        this.activeTab=='1'? this.init():this.getRecord()
      }
    }
}
</script>
<style lang="less">
    .exchange_contin{
        margin: 0 auto;
        min-width: 1200px;
        max-width: 1700px;
        padding: 40px 10px;
        .content{
            overflow: hidden;
            .el-tabs{
                positin:relative;
                .search{
                    width: 100%;
                    padding:20px 30px;
                    background-color: #fff;
                    border-bottom: 1px solid #eee;
                    position:absolute;
                    top:0;
                    left:0;
                    .item{
                        display: flex;
                        color:#333;
                        font-size:15px;
                        .input_item{
                            margin-left: 36px;
                            .el-input__inner{
                                width: 100px;
                                height: 30px;
                                line-height: 30px;
                                border-radius: 0;
                            }
                            .el-input__icon{
                               line-height: 30px;
                            }
                            &:first-of-type{
                                margin-left: 0;
                            }
                        }
                        .time,.currency{
                            .el-input__inner{
                                width: 140px;
                            }
                            .el-date-editor{
                                width: 140px;
                            }
                        }
                    }
                }
                .el-tabs__header{
                  margin:0;
                  border-bottom: 2px solid #52cbca;
                  padding:0 32px;
                }
                .el-tabs__content{
                  padding-top:71px;
                }
            }
            .el-table{
                .el-table__empty-block{
                   min-height: 630px;
                }
                .option{
                   &:hover{
                     text-decoration: underline;
                   }
                }
                .el-tabs__item{
                    height: 44px;
                    line-height: 44px;
                }
                .el-table__body-wrapper{
                   min-height: 540px;
                }
            }
            .el-pagination{
               padding:10px 0 50px 0;
               float:right;
               width: 100%;
               background-color: #fff;
               button{
                 background-color: transparent;
               }
            }
        }
    }
</style>