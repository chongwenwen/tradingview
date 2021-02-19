import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import vueResource from "vue-resource";
import vueCookie from 'vue-cookie'
import preview from 'vue-photo-preview'//图片预览
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'


Vue.use(vueCookie)
Vue.use(VueI18n)
Vue.use(ElementUI);
Vue.use(ElementUI, { zhLocale });
Vue.use(preview)
Vue.use(vueResource);


//样式文件
import 'element-ui/lib/theme-chalk/index.css';
import 'vue-photo-preview/dist/skin.css'
import '../static/css/reset.css';
import '../static/css/login.css';
import '../static/font/iconfont.css'
import '../static/css/app.css';
import '../static/css/my.css';
import '../static/css/quotation.css';



//正式服务器
// Vue.prototype.$urlPrefix='http://k.aubve.com'
// Vue.prototype.$urlWebsoket='ws://ws.bve.huayuyun.cn'

//测试服务器
// Vue.prototype.$urlPrefix='http://bve.huayuyun.cn'
// Vue.prototype.$urlWebsoket='ws://115.159.71.83:2346'

//本地服务器
Vue.prototype.$urlPrefix='http://bve.huayuyun.cn'
Vue.prototype.$urlWebsoket='ws://115.159.71.83:8282'

Vue.config.productionTip = false
Vue.http.options.emulateJSON = true;
Vue.prototype.$bus= Vue.prototype.$bus ||  new Vue()//注册一个全局的总线组件


//内存获取默认语言
function InitLanguage() {
    return Vue.cookie.get('DefaultLanguage') == null ? 'zh-CN' : Vue.cookie.get('DefaultLanguage');
}
const i18n = new VueI18n({
  locale:  InitLanguage(), 
  messages: {
    'en-US': Object.assign(require("../static/lang/en"),enLocale),
    'zh-CN': Object.assign(require("../static/lang/zh-CN"),zhLocale)
  }
});
locale.i18n((key, value) => i18n.t(key, value));//为了之后将element-ui组件本地化

// //拦截器
// Vue.http.interceptors.push((request, next) => {
//   // modify request
//   request.method = 'POST';//在请求之前可以进行一些预处理和配置
  
// 　next((response) => {
//   //在响应之后传给then之前对response进行修改和逻辑判断。
//   //对于token时候已过期的判断，就添加在此处，
//   //页面中任何一次http请求都会先调用此处方法
//     　　if(response.body.code == 1){
//            return response;
//         }else if(response.body.code == 102){
//            this.$message({
//              message: '您还未进行实名认证',
//              type: 'error'
//            });
//         }else if(response.body.code == 102){
//            this.$message({
//              message: '您还未进行实名认证',
//              type: 'error'
//            });
//         }
//   });
// });

new Vue({
  el: '#app',
  router,
  i18n,//将VueI18n挂载到vue实例上
  components: { App },
  template: '<App/>'
})
