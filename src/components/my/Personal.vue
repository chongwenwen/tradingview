<template>
  <div class="my_container">
     <div class="content">
        <div class="aside ft">
          <div class="assideTop">
            <div class="avatar">
              <div class="flagName">{{flagName}}</div>
              <span>{{totalData.nickname?totalData.nickname:totalData.mobile}}</span>
            </div>
            <ul class="detailInfo">
              <li>{{ $t("localization.C2C-total-transactions") }}： <span>{{totalData.total_order}}</span></li>
            </ul>
          </div>
          <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" mode="vertical" active-text-color="#52cbca" text-color="#666"  @select="handleSelect">
            <el-menu-item index="myBasic">
               <i class="icon iconfont icon-ziliao"></i>
               <span slot="title">{{ $t("localization.Basic-data") }}</span>
            </el-menu-item>
            <el-menu-item index="mySecurity">
              <i class="icon iconfont icon-anquan"></i>
              <span slot="title">{{ $t("localization.Account-security") }}</span>
            </el-menu-item>
            <el-menu-item index="myAssets">
              <i class="icon iconfont icon-zichanguanli"></i>
              <span slot="title">{{ $t("localization.My-assets") }}</span>
            </el-menu-item>
            <el-menu-item index="assetsWater">
              <i class="icon iconfont icon-xinzengliushuihao"></i>
              <span slot="title">{{ $t("localization.Assets-flow") }}</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="right gt" v-if="activeIndex=='myBasic'">
           <basicInfo :basicInfo='totalData' @changeNickName='getNickName' @emailConfig="emailConfig"></basicInfo>
        </div>
        <div class="right gt" v-if="activeIndex=='mySecurity'">
           <accountSafe></accountSafe>
        </div>
        <div class="right gt" v-if="activeIndex=='myAssets'">
           <assets></assets>
        </div>
        <div class="right gt" v-if="activeIndex=='assetsWater'">
           <assetsWater></assetsWater>
        </div>
     </div>
  </div>
</template>

<script>
import basicInfo from './BasicInfo.vue'
import accountSafe from './AccountSafe.vue'
import assets from './Assets.vue'
import assetsWater from './AssetsWater.vue'
export default {
  components:{
      basicInfo,
      accountSafe,
      assets,
      assetsWater
  },
  name: 'Personal',
  data() {
    return {
      activeIndex:'',
      flagName:'',
      totalData:{}
    }
  },
  created(){
    var type = this.$route.query.type
    if(type == "pay"){
      this.activeIndex='mySecurity'
    }else{
      this.activeIndex = localStorage.getItem('myIndex')?localStorage.getItem('myIndex'):'myBasic'
    }
    this.init()
  },
  methods: {
     init(){
        var url = this.$urlPrefix+'/me'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token
        }
        this.$http.post(url,data).then(function(response){
           if(response.body.code==1){
              this.totalData = response.body.data
              if(this.totalData.nickname){
                this.flagName = this.totalData.nickname[0].toUpperCase();
              }else{
                this.flagName = this.totalData.mobile[0].toUpperCase();
              }
              
           }
        })
     },
     getNickName(val){
        this.totalData.nickname = val
     },
     handleSelect(key, keyPath) {
       this.activeIndex = key
       localStorage.setItem('myIndex',key)
     },
     emailConfig(){
       this.init()
     }
  },
  watch:{
    'totalData.nickname':function(){
       if(this.totalData.nickname){
         this.flagName = this.totalData.nickname[0].toUpperCase();
       }else{
         this.flagName = this.totalData.mobile[0].toUpperCase();
       }
    }
  }
}
</script>