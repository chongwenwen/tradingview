<template>
    <div class="common_head">
        <div class="container">
            <div class="ft">
                <router-link to="/" class="logo ft">
                   <img src="../assets/logo.jpg">
                   <span>澳洲（国际）品牌价值交易所</span>
                </router-link>
                <el-menu :default-active="$route.path=='/information'?'':$route.path" class="el-menu-demo ft" mode="horizontal" active-text-color="#52cbca" text-color="#666" menu-trigger=''>
                  <el-menu-item index="/">
                     <router-link to="/">{{ $t("localization.Home") }}</router-link>
                  </el-menu-item>
                  <el-menu-item index="/quotation">
                     <router-link to="/quotation">{{ $t("localization.Exchange") }}</router-link>
                  </el-menu-item>
                  <el-menu-item index="/frenchCurrenry" v-if="showFrench">
                     <router-link to="/frenchCurrenry">C2C</router-link>
                  </el-menu-item>
                  <el-menu-item index="3">
                     <router-link to="/information">{{ $t("localization.Information") }}</router-link>
                  </el-menu-item>
                  <!-- <el-menu-item index="5">
                     <router-link to="/Help">{{ $t("localization.Help") }}</router-link>
                  </el-menu-item> -->
                </el-menu>
            </div>
            <div class="gt">
                <el-row class="ft" v-if="!isLogin">
                  <router-link to="/login">
                     <el-button type="primary" round plain>{{ $t("localization.Login") }}</el-button>
                  </router-link>
                  <router-link to="/register">
                     <el-button type="warning" round plain>{{ $t("localization.Register") }}</el-button>
                  </router-link>
                </el-row>
                <div class="language">
                    <el-dropdown v-if="isLogin">
                      <!-- trigger="click" -->
                      <!-- 图标 -->
                      <span class="el-dropdown-link">
                        <el-badge v-if="newsCount>0" :max="20" :value="newsCount" class="item">
                          <i class="icon iconfont icon-notice" style="font-size:20px;margin-right: 20px;"></i>
                        </el-badge>
                        <i v-else class="icon iconfont icon-notice" style="font-size:20px;margin-right: 20px;"></i>
                      </span>
                      <!-- 消息列表 有消息 -->
                      <el-dropdown-menu v-if="newsList.length>0" slot="dropdown" style="border-top: 4px solid #00c1ce;">
                        <el-dropdown-item v-for="(item,index) in newsList" :key="index" class="newsList">
                           <a href="javascript:;" v-if="index<=3" @click="readNews(item.id,item.event_id)">
                              <div>
                                  <el-badge is-dot class="item" v-if="item.status==0"></el-badge>
                                  {{item.type}}
                              </div>
                              <div class="news_content">
                                  <span class="detail">
                                    {{item.event_content}}
                                  </span>
                                  <span class="time">{{item.time}}</span>
                              </div>
                           </a>
                        </el-dropdown-item>
                        <el-dropdown-item class="newsList">
                           <router-link style="text-align: center;color:#00c1ce;" to="/news">{{ $t("localization.More") }} >></router-link>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                      <!-- 消息列表 无消息 -->
                      <el-dropdown-menu v-else slot="dropdown" style="border-top: 4px solid #ddd;">
                          <el-dropdown-item class="newsList" style="width:200px;">
                             <a href="javascript:;">
                                <p >
                                  <span class="nodata" style="color:#898989;">{{ $t("localization.No-news") }}</span>
                                </p>
                             </a>
                          </el-dropdown-item>
                          <el-dropdown-item class="newsList" style="width:200px;">
                             <router-link style="text-align: center;color:#00c1ce;" to="/news">{{ $t("localization.More") }} >></router-link>
                          </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <!-- 昵称 -->
                    <el-dropdown v-if="isLogin">
                      <span class="el-dropdown-link">
                        {{userName}} <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                           <router-link to="/my/personal">
                              <i class="icon iconfont icon-user"></i>
                              {{$t('localization.Personal-center')}}
                           </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                           <a href="javascript:;" @click="logout">
                              <i class="icon iconfont icon-logout"></i>
                              {{$t('localization.Logout')}}
                           </a>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <!-- 多语言 -->
                    <el-select v-model="lang"  v-if="languageShow" @change="switchLanguage(lang)" class="el-select">
                      <el-option
                         v-for="item in language"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
                      </el-option>
                    </el-select>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default{
    props:['isLogin','languageShow'],
    data(){
        return{
            userName:'',
            lang: '',
            showFrench:true,
            language: [
                {
                value: "en-US",
                label: "English"
                },
                {
                value: "zh-CN",
                label: "中文简体"
                }
            ],
            newsCount:'',
            newsList:[]
        }
    },
    created(){
       this.lang = this.$i18n.locale
       this.userName = localStorage.getItem('nickName')? localStorage.getItem('nickName'):''
       this.getNewList()
       this.getNewcount()
    },
    mounted(){
      //监听修改昵称
      this.$bus.$on('newNickName',(data) => {
        this.userName = data
      });
      //socket返回消息总条数
      this.$bus.$on('messageCount',(data) => {
        this.newsCount = data
      });
      //socket返回新消息
      this.$bus.$on('newMessage',(data) => {
        this.newsList.unshift(data)
      });
      //监听消息阅读
      this.$bus.$on('readNews',(data) => {
        this.getNewcount()
        this.getNewList()
      });
    },
    methods:{
        /**
        * 获取消息列表
        */
        getNewList(){
          this.newsList=[]
          var _this = this
          var url = this.$urlPrefix+'/messageList'
          var token = localStorage.getItem('token')
          var data={
            _ajax:1,
            toKey:token
          }
          this.$http.post(url,data).then(function(response){
             if(response.body.code==1){
                var result = response.body.data.data
                result.forEach(function(val){
                    if(val.status == 0){
                      _this.newsList.push(val)
                    }
                })
             }
          })
        },
        /**
        * 获取消息条数
        */
        getNewcount(){
          var url = this.$urlPrefix+'/messageCount'
          var token = localStorage.getItem('token')
          var data={
            _ajax:1,
            toKey:token
          }
          this.$http.post(url,data).then(function(response){
             if(response.body.code==1){
               var result = response.body.data
               this.newsCount = result.message
             }
          })
        },
        switchLanguage(value) {
          value == "zh-CN"?this.$i18n.locale = "zh-CN":this.$i18n.locale = "en-US";
          //保存到Cookie中,有效时间为30分钟
          this.$cookie.set("DefaultLanguage", (this.lang),{expires: "30m"});
        },
        logout(){
          var url = this.$urlPrefix+'/signOut'
          var token = localStorage.getItem('token')
          var data={
            _ajax:1,
            toKey:token
          }
          this.$http.post(url,data).then(function(response){
             var result = response.body
             if(response.body.code==1){
               localStorage.removeItem('token')
               localStorage.removeItem('userPhone')
               localStorage.removeItem('router')
               this.$router.push('/login')
             }
          })
        },
        /**
        * 阅读消息
        */
        readNews(readId,detailId){
          console.log(readId,detailId)
          var url = this.$urlPrefix+'/messageRead'
          var data={
            _ajax:1,
            id:readId
          }
          this.$http.post(url,data).then(function(response){
             var result = response.body
             // 跳转详情页
             if(response.body.code==1){
                this.getNewList()
                this.getNewcount()
                setTimeout(()=>{
                   this.$router.push({
                    path:'/orderDetail',
                    query:{
                      id:detailId
                    }
                  })
                })
                
             }
          })
        }
    },
    watch:{
      lang(val){
        val=='zh-CN'?this.showFrench = true:this.showFrench = false
      }
    }
}
</script>