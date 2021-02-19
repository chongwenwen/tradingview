<template>
  <div id="trade-view">
  </div>
</template>
<script>
import { widget as TvWidget } from '../../../static/tradeview/charting_library/charting_library.min.js'
import datafeeds from '../../../static/datafeeds/datafees.js'
import socket from '../../../static/datafeeds/socket.js'
export default {
  data() {
    return {
      widget: null,
      datafeeds: new datafeeds(this),
      symbol: null,
      interval: null,
      cacheData: {},
      lastTime: null
    }
  },
  created(){
    //监听websocket数据
    this.$bus.$on('soketData',(data) => {
      if(data.type =="kLine" && data.list){ 
         var newData = {
           time: data.list.deal_time*1000,
           open: Number(data.list.open),
           high: Number(data.list.high),
           low: Number(data.list.low),
           close: Number(data.list.close),
           volume: Number(data.list.volume)
         }
         // console.log(newData)
         //如果增量更新数据的时间大于缓存时间，而且缓存有数据，数据长度  大于0
         if (newData.time > this.lastTime && this.cacheData && this.cacheData.length) {
           // console.log('>')
           //增量更新的数据直接加入缓存数组
           this.cacheData.push(newData)
           //修改缓存时间
           this.lastTime = newData.time
         }else if(newData.time == this.lastTime && this.cacheData.length){
           // console.log('=')
           //如果增量更新的时间等于缓存时间，即在当前时间颗粒内产生了新数据，更新当前数据
           this.cacheData[this.cacheData.length - 1] = newData
         }
         this.datafeeds.barsUpdater.updateData()
      }
    })
  },
  methods: {
    init(symbol,interval,locale) {
      this.widget = new TvWidget({
          symbol: symbol,//商品名称
          interval: interval,//默认显示时间分辨率
          container_id: 'trade-view',//k线div容器id
          datafeed: this.datafeeds,
          autosize:true,
          library_path: '/static/tradeview/charting_library/',
          disabled_features: [
            'header_symbol_search',
            'volume_force_overlay',
            'widget_logo',
            'timeframes_toolbar',
            'header_saveload',//保存和加载图表 
            'border-around_the_chart',
            'header_compare'
          ],
          enabled_features: ['study_templates'],
          timezone: 'Asia/Shanghai',//图表的初始时区。时间刻度上的数字取决于这个时区。
          locale:locale,//设置默认语言
          debug: false,
          autosize:false,
          'scalesProperties.lineColor' : "#fff",
          overrides:{
            'volumePaneSize':'medium',
            //k线图样式
            'mainSeriesProperties.candleStyle.upColor': "#e45555",
            'mainSeriesProperties.candleStyle.downColor': "#00b275",
            'mainSeriesProperties.candleStyle.borderUpColor': "#e45555",
            'mainSeriesProperties.candleStyle.borderDownColor': "#00b275",
            'mainSeriesProperties.candleStyle.wickUpColor': '#e45555',
            'mainSeriesProperties.candleStyle.wickDownColor': '#00b275'
            // 'paneProperties.legendProperties.showLegend':false//隐藏左上角指标
          },
          studies_overrides: {
              "volume.volume.color.0": "#00b275",
              "volume.volume.color.1": "#e45555",
              "volume.volume.transparency": 70,
              "volume.volume ma.color": "#0CABD4",
              "volume.volume ma.transparency": 70,
              // "volume.volume ma.linewidth": 20,
              "volume.show ma": true
          },
          // charts_storage_url: 'https://saveload.tradingview.com',
          // client_id: 'tradingview.com',
          // user_id: 'public_user_id'
        })
        this.symbol = symbol
        this.interval = interval
        var thats = this.widget;
        this.widget.onChartReady(function() {
          //设置均线种类 均线样式
          thats.chart().createStudy('Moving Average', false, false, [7],null,{'Plot.color':'#FFBA70','Plot.linewidth':2});
          thats.chart().createStudy('Moving Average', false, false, [30], null,{'Plot.color': 'rgb(104,200,235)','Plot.linewidth':2})
        })
    },
    /*
      接收k线初始数据
    */
    getSymbol() {
      if(this.symbol != null){
          return {
            'name': this.symbol,
            'timezone': 'Asia/Shanghai',
            'minmov': 1,     
            'session': '24x7',
            'has_intraday': true,
            'has_no_volume': false,//显示成交量
            'description': this.symbol,
            'ticker': this.symbol,
            'supported_resolutions': ['1', '5', '15', '30', '60', '1D']
          }
      }
    },
    getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) {
      if(this.interval != resolution){
        //图表取消订阅
        this.widget.chart().onIntervalChanged().unsubscribe(null, function(interval, obj) {
            obj.timeframe = this.interval;
        })
        this.interval = resolution
      }
      //给socket发送数据
      var socketData={
        cmd:"kLine",
        name:symbolInfo.ticker,
        time:resolution
      }
      this.$bus.$emit('klineData',socketData);

      //历史数据
      var url = this.$urlPrefix+'/kLine'
      var data={
        _ajax:1,
        name:symbolInfo.ticker,
        time:resolution,
        start_time:rangeStartDate,
        end_time:rangeEndDate
      }
      this.$http.post(url,data).then(function(response){
        var result = JSON.parse(response.body).list
        if (result && result.length) {
          const list = []
          result.forEach(function (element) {
            list.push({
              time:element.deal_time*1000,
              open: Number(element.open),
              high: Number(element.high),
              low: Number(element.low),
              close: Number(element.close),
              volume: Number(element.volume)
            })
          }, this)
          this.cacheData = list
          onLoadedCallback(list)
          this.lastTime = list[list.length - 1].time
        }
      })
    },
    removeWidget(){
      if(this.widget){
        this.widget=null
      }
    }
  },
  destroyed(){
    //关闭k线请求
    this.datafeeds.unsubscribeBars(this.symbol+'_'+this.interval)
    //移除k线
    this.removeWidget()
  }
}
</script>
<style lang="less">
    #trade-view{
        width: 100%;
        height: 100%;
        iframe{
           width: 100% !important;
           height: 100% !important;
           .chart-page{
             margin-left: 40px;
           }
           .layout__area--center{
             left:152px;
           }
           .getimage{
             display: none;
           }
        }
    }
</style>

