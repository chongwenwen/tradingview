<template>
    <div class="latest_deal">
       <h1>{{$t('localization.Latest-execution')}}</h1>
       <el-tabs v-model="activeTab" type="card">
         <el-tab-pane name="1" :label="$t('localization.Market')" class="tabs">
             <el-table
               :data="marketData"
               tooltip-effect="dark"
               style="width: 100%">
               <el-table-column
                 :label="$t('localization.Time')">
                 <template slot-scope="scope">
                   <i class="el-icon-time" style="color:#e45555;"></i>
                   <span style="margin-left: 4px;">{{ scope.row.deal_time }}</span>
                 </template>
               </el-table-column>
               <el-table-column
                 :label="$t('localization.Price')">
                 <template slot-scope="scope">
                   <span style="color:#e45555;" v-if="scope.row.rise_fall==1" >{{ scope.row.price }}</span>
                   <span style="color:rgb(0, 178, 117);" v-if="scope.row.rise_fall==0" >{{ scope.row.price }}</span>
                 </template>
               </el-table-column>
               <el-table-column
                 prop="number"
                 :label="$t('localization.Volume')">
               </el-table-column>
             </el-table>
         </el-tab-pane>
         <el-tab-pane :label="$t('localization.Mine')" class="tabs" name="2">
             <el-table
               :data="newMytData"
               tooltip-effect="dark"
               style="width: 100%">
               <el-table-column
                 :label="$t('localization.Time')">
                 <template slot-scope="scope">
                   <i class="el-icon-time" style="color:#e45555;"></i>
                   <span style="margin-left: 4px;">{{ scope.row.deal_time }}</span>
                 </template>
               </el-table-column>
               <el-table-column
                 :label="$t('localization.Price')">
                 <template slot-scope="scope">
                   <span style="color:rgb(0, 178, 117);" v-if="scope.row.rise_fall==1">{{ scope.row.price }}</span>
                   <span style="color:#e45555;" v-if="scope.row.rise_fall==0">{{ scope.row.price }}</span>
                 </template>
               </el-table-column>
               <el-table-column
                 prop="number"
                 :label="$t('localization.Volume')">
               </el-table-column>
             </el-table>
         </el-tab-pane>
       </el-tabs>
    </div>
</template>
<script>
export default{
    data(){
        return{
            activeTab:"1",
            newMytData:[],
            newDealId:'',
            marketData:[]
        }
    },
    created(){
    }, 
    methods:{
        // 最新市场记录
        newMarketQu(){
          var url = this.$urlPrefix+'/coinQuotation'
          var token = localStorage.getItem('token')
          var data={
            _ajax:1,
            toKey:token,
            asset_id:this.newDealId
          }
          this.$http.post(url,data).then(function(response){
             this.marketData = JSON.parse(response.body)
          })
        },
        //最新成交我的记录
        newMyQu(){
          var url = this.$urlPrefix+'/myCoinQuotation'
          var token = localStorage.getItem('token')
          var data={
            _ajax:1,
            toKey:token,
            asset_id:this.newDealId
          }
          this.$http.post(url,data).then(function(response){
             var result = response.body.data
             if(response.body.code==1){
                this.newMytData = result
             }
          })
        },
        updateNewDeal(beanId){
            this.newDealId = beanId
            this.activeTab=='2'? this.newMyQu():this.newMarketQu()//最新成交市场信息
        },
        //websoket更新最新成交市场数据
        updateWebsoket(soketData){
           if(this.activeTab=='1'){
              this.marketData.unshift(soketData)
           }
        }
    },
    watch:{
      activeTab(val){
        if(val==2){
          this.newMyQu()
        }
      }
    }
}
</script>