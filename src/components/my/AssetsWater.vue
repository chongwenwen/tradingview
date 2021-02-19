<template>
    <div>
        <div class="top">
           <div class="safety_grade">
             {{$t('localization.Asset-record')}}
           </div>
        </div>
        <div class="assetsList">
            <div class="totalSearch">
              <div class="item">
                <span>{{$t('localization.Assets')}}：</span>
                <el-select v-model="assets"  @change="switchAssets(assets)" class="el-select">
                  <el-option :label="$t('localization.All')" value="0">
                  </el-option>
                  <el-option v-for="(item,index) in abbList" :key="index" :label="item.abb" :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <div class="item">
                <span>{{$t('localization.Operation-type')}}：</span>
                <el-select v-model="type"  @change="switchType(type)" class="el-select">
                  <el-option :label="$t('localization.All')" value="0">
                  </el-option>
                  <el-option :label="$t('localization.Change-into')" value="1">
                  </el-option>
                  <el-option :label="$t('localization.Turn-out')" value="2">
                  </el-option>
                  <el-option :label="$t('localization.Service-charge')" value="3">
                  </el-option>
                  <el-option :label="$t('localization.Currency-entry')" value="4">
                  </el-option>
                  <el-option :label="$t('localization.Currency-out')" value="5">
                  </el-option>
                  <el-option :label="$t('localization.C2C-entry')" value="6">
                  </el-option>
                  <el-option :label="$t('localization.C2C-out')" value="7">
                  </el-option>
                  <el-option :label="$t('localization.Currency-frozen')" value="8">
                  </el-option>
                  <el-option :label="$t('localization.C2C-frozen')" value="9">
                  </el-option>
                </el-select>
              </div>
            </div>
            <el-table
                :data="assetsData"
                tooltip-effect="dark"
                style="width: 100%"
                :cell-style="cellStyle"
                :header-cell-style="rowClass"
                v-loading="fullLoading">
                <el-table-column
                  prop="abb"
                  :label="$t('localization.Assets')">
                </el-table-column>
                <el-table-column
                  width='150'
                  :label="$t('localization.Asset-changes')">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type=='1'" style='color:#F56C6C;'>+ {{scope.row.number}}</span>
                    <span v-if="scope.row.type=='2'" style='color:#00b275;'>- {{scope.row.number}}</span>
                    <span v-if="scope.row.type=='3'" style='color:#00b275;'>- {{scope.row.number}}</span>
                    <span v-if="scope.row.type=='4'" style='color:#F56C6C;'>+ {{scope.row.number}}</span>
                    <span v-if="scope.row.type=='5'" style='color:#00b275;'>- {{scope.row.number}}</span>
                    <span v-if="scope.row.type=='6'" style='color:#F56C6C;'>+ {{scope.row.number}}</span>
                    <span v-if="scope.row.type=='7'" style='color:#00b275;'>- {{scope.row.number}}</span>
                    <span style='color:#999;' v-if="scope.row.type=='8'||scope.row.type=='9'">
                      <i class="el-icon-lock"></i>
                      {{scope.row.number}}
                    </span>
                  </template>
                </el-table-column>  
                <el-table-column
                  prop="type_msg"
                  width='150'
                  :label="$t('localization.Flow-type')">
                </el-table-column>
                <el-table-column
                  :label="$t('localization.Asset-status')">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type==1 && scope.row.status==1">{{$t('localization.Transferred-to')}}</span>
                    <span v-if="scope.row.type==2 && scope.row.status==0">{{$t('localization.In-audit')}}</span>
                    <span v-if="scope.row.type==2 && scope.row.status==1">{{$t('localization.Audited')}}</span>
                    <span v-if="scope.row.type==2 && scope.row.status==2">{{$t('localization.Audit-rejected')}}</span>
                    <span v-if="scope.row.type!=1 && scope.row.type!=2">{{$t('localization.Complete')}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="balance"
                  :label="$t('localization.Account-balance')">
                </el-table-column>
                <el-table-column
                  prop="time"
                  width='250'
                  :label="$t('localization.Time')">
                </el-table-column>
            </el-table>
            <el-pagination
              v-if="totalPage>1"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next, jumper"
              :total="totalCount"
              :prev-text="$t('localization.Previous-page')"
              :next-text="$t('localization.next-page')">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
       totalPage:0,
       currentPage:1,
       type:'0',
       totalCount:0,
       pageSize:1,
       assets:'0',
       assetsData: [],
       abbList:[],
       fullLoading:true
    }
  },
  created(){
    this.init()
    this.getTotalAssets()
  },
  methods: {
    init(){
      var url = this.$urlPrefix+'/myAssetRecord'
      var token = localStorage.getItem('token')
      var data={
        _ajax:1,
        toKey:token,
        page:this.currentPage,
        type:this.type,
        abb:this.assets
      }
      this.$http.post(url,data).then(function(response){
         if(response.body.code==1){
           this.fullLoading  = false
           var result = response.body.data
           this.assetsData = result.data
           this.totalCount = result.total
           this.pageSize = result.per_page
           this.totalPage = result.last_page
         }
      })
    },
    getTotalAssets(){
      var url = this.$urlPrefix+'/abbList'
      var data={
        _ajax:1
      }
      this.$http.post(url,data).then(function(response){
         if(response.body.code==1){
           this.abbList = response.body.data
         }
      }) 
    },
    switchType(value){
      this.currentPage = 1
      this.init()
    },
    switchAssets(assets){
      this.currentPage = 1
      this.init()
    },
    rowClass({ row, rowIndex}) {
      if(rowIndex == 0){
          return 'background:#f9f9f9'
      }
    },
    cellStyle({row, column, rowIndex, columnIndex}){
      return 'padding:10px 0'
      if(columnIndex === 4){
          return 'color:#00c1ce'
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.init()
    }
  }
}    
</script>