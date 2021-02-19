<template>
    <div class="entrust_list">
       <div class="item">
          <div class="title">
             <span>{{$t('localization.Current-orders')}}</span>
             <span class="more" @click="lookMore">{{$t('localization.More')}}<i class="el-icon-arrow-right"></i></span>
          </div>
          <el-table
            :data="currentEntrustData"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="time"
              width="160"
              :label="$t('localization.Order-time')">
            </el-table-column>
            <el-table-column
              prop="abb"
              :label="$t('localization.Coin')">
            </el-table-column>
            <el-table-column
              prop="type"
              :label="$t('localization.Deal-type')">
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
                <span class="option" @click="revokeEntrust(scope.row.id)">{{$t('localization.Revoke')}}</span>
              </template>
            </el-table-column>
          </el-table>
       </div>
       <div class="item">
         <div class="title">
            <span>{{$t('localization.Order-history')}}</span>
            <span class="more" @click="lookMore('record')">{{$t('localization.More')}}<i class="el-icon-arrow-right"></i></span>
         </div>
         <el-table
            :data="recordEntrustData"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="time"
              :label="$t('localization.Order-time')">
            </el-table-column>
            <el-table-column
              prop="abb"
              :label="$t('localization.Coin')">
            </el-table-column>
            <el-table-column
              prop="type"
              :label="$t('localization.Deal-type')">
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
       </div>
       <p>
         <i class="icon iconfont icon-tips"></i> 
         {{$t('localization.serverTip')}}
       </p>
    </div>
</template>
<script>
export default{
    props:['isLogin'],
    data(){
        return{
            currentEntrustData:[],
            recordEntrustData:[],
        }
    },
    methods:{
        currentEntrust(id){
          var url = this.$urlPrefix+'/myCoinEntrustCurrent'
          var token = localStorage.getItem('token')
          var data={
             _ajax:1,
             toKey:token,
             asset_id:id
          }
          this.$http.post(url,data).then(function(response){
             var result = response.body
             if(response.body.code==1){
               this.currentEntrustData = result.data
             }
          })
        },
        recordEntrust(id){
          var url = this.$urlPrefix+'/myCoinEntrustHistory'
          var token = localStorage.getItem('token')
          var data={
             _ajax:1,
             toKey:token,
             asset_id:id
          }
          this.$http.post(url,data).then(function(response){
             var result = response.body
             if(response.body.code==1){
               this.recordEntrustData = result.data
             }
          })
        },
        revokeEntrust(id){
          this.$confirm(this.$t('localization.Confirm-Revoke-Tip'),this.$t('localization.Revoke-tips'), {
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
                this.$emit('updateParams','')
                this.currentEntrust()
                this.recordEntrust()
             }
          })
        },
        updateEntrust(id){
            this.currentEntrust(id)//当前委托记录
            this.recordEntrust(id)//历史委托记录
        },
        lookMore(type){
            if(this.isLogin){
              //登录
              if(type=='record'){
                this.$router.push({
                  path:'/exchange',
                  query:{type:'record'}
                })
              }else{
                this.$router.push('/exchange')
              }
            }else{
              this.$router.push('/login')
            }
        }
    }
}
</script>