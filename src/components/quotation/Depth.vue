<template>
  <div class="right">
     <div class="option">
        <div class="gt">
           <a href="#" @click="depthChange(1)"><i class="el-icon-upload2 up"></i></a>
           <a href="#" @click="depthChange(2)"><i class="el-icon-download down"></i></a>
           <a href="#" @click="depthChange(3)"><i class="el-icon-sort"></i></a>
        </div>
     </div>
     <div class="data">
         <div class="depthTitle">
           <div class="item">{{$t('localization.Price')}}({{depthParams.bve}})</div>
           <div class="item">{{$t('localization.Number')}}({{depthParams.asset_name}})</div>
           <div class="item">{{$t('localization.Cumulative')}}({{depthParams.asset_name}})</div>
         </div>
         <div class="both" v-if="depthType==3">
            <div class="depthBuy">
              <div class="item_list" v-for="(item,index) in depthData.up" :key="index" @click="sendPrice(item.price,item.sumNodealNumber,'buy')">
                <div class="down_item">{{item.price}}</div>
                <div class="down_item">{{item.sumNodealNumber}}</div> 
                <div class="down_item">{{item.sumNumber}}</div>
                <div class="percent" v-if="item.sumNumber" :style="'width:' + item.percent+ '%'"></div>
              </div>
            </div>
            <div class="currentData">
              <div :class="depthParams.increase==1?'newPriceUp':'newPriceDown'">{{depthParams.currentPrice}}</div>
              <img v-if="depthParams.increase==1" src="../../assets/up.png">
              <img v-if="depthParams.increase==0" src="../../assets/down.png">
              <span>≈ {{depthParams.cny}} CNY</span>
            </div>
            <div class="depthSell">
              <div class="item_list" v-for="(item,index) in depthData.low" :key="index" @click="sendPrice(item.price,item.sumNodealNumber,'sell')">
                <div class="down_item">{{item.price}}</div>
                <div class="down_item">{{item.sumNodealNumber}}</div> 
                <div class="down_item">{{item.sumNumber}}</div>
                <div class="percent" v-if="item.sumNumber" :style="'width:' + item.percent+ '%'"></div>
              </div>
            </div>
         </div>
         <div class="onlySell" v-if="depthType==2">
           <div class="currentData">
               <div :class="depthParams.increase==1?'newPriceUp':'newPriceDown'">{{depthParams.currentPrice}}</div>
               <img v-if="depthParams.increase==1" src="../../assets/up.png">
               <img v-if="depthParams.increase==0" src="../../assets/down.png">
               <span>≈ {{depthParams.cny}} CNY</span>
           </div>
           <div class="depthSell">
             <div class="item_list" v-for="(item,index) in depthData" :key="index" @click="sendPrice(item.price,item.sumNodealNumber,'sell')">
                <div class="down_item">{{item.price}}</div>
                <div class="down_item">{{item.sumNodealNumber}}</div> 
                <div class="down_item">{{item.sumNumber}}</div>
                <div class="percent" v-if="item.sumNumber" :style="'width:' + item.percent+ '%'"></div>
             </div>
           </div>
         </div>
         <div class="onlyBuy" v-if="depthType==1">
           <div class="currentData">
               <div :class="depthParams.increase==1?'newPriceUp':'newPriceDown'">{{depthParams.currentPrice}}</div>
               <img v-if="depthParams.increase==1" src="../../assets/up.png">
               <img v-if="depthParams.increase==0" src="../../assets/down.png">
               <span>≈ {{depthParams.cny}} CNY</span>
           </div>
           <div class="depthBuy">
             <div class="item_list" v-for="(item,index) in depthData" :key="index" @click="sendPrice(item.price,item.sumNodealNumber,'buy')">
                <div class="down_item">{{item.price}}</div>
                <div class="down_item">{{item.sumNodealNumber}}</div> 
                <div class="down_item">{{item.sumNumber}}</div>
                <div class="percent" v-if="item.sumNumber" :style="'width:' + item.percent+ '%'"></div>
             </div>
           </div>
         </div>
     </div>
</div>
</template>

<script>
export default{
  props:['depthData','depthParams'],
  data(){
     return{
        baseCurrency:'USDT',
        currency:'BTH',
        depthType:3
     }
  },
  created(){
  },
  methods:{
    depthChange(type){
      this.$emit('changeDepthType',type)
      this.depthType = type
    },
    //websoket更新最新数据
    updateWebsoket(socketData){
       //买卖
       if(this.depthType==3){
          this.depthData.low = socketData.low
          this.depthData.up = socketData.up
       }else if(this.depthType==2){//出售
          this.depthData = socketData.sell
       }else if(this.depthType==1){//购买
          this.depthData = socketData.buy
       }
    },
    sendPrice(price,number,type){
      var data = {
        price:price,
        number:number
      }
      if(type=='buy'){
        this.$emit('depthBuyPrice',data)
      }else{
        this.$emit('depthSellPrice',data)
      }
      
    }
  }
}
</script>