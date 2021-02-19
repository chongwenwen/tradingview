<template>
  <div class="login_content" v-loading.fullscreen.lock="fullscreenLoading">
      <!-- 登录 -->
      <div class="login_container">
        <img src="../../assets/login/watermark.png">
        <div class="title">
            {{ $t("localization.Login") }}
        </div>
        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="70px" class="demo-ruleForm login_form">
          <el-form-item :label="$t('localization.mobile')" prop="mobile">
            <el-input type="text" v-model="loginForm.mobile" autocomplete="off" :placeholder="$t('localization.mobile')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('localization.Password')" prop="password">
            <el-input type="password" v-model="loginForm.password" autocomplete="off" :placeholder="$t('localization.Password')" class="bui-input" @keyup.enter.native="loginSubmit('loginForm')"></el-input>
          </el-form-item>
          <div class="tip">
             <router-link to="/forgetPass">{{$t('localization.Forget-password')}}?</router-link>
          </div>
          <div class="login_submit">
            <el-button type="primary" class="loginBtn" @click="loginSubmit('loginForm')">{{$t('localization.Sign-in')}}</el-button>
          </div>
          <div class="tip">
            <span>{{$t('localization.No-BVE-account')}}？</span>
            <router-link to="/register">{{$t('localization.Immediate-registration')}}</router-link>  
          </div>
        </el-form>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
      var phoneRule = /^[1][3,4,5,7,8][0-9]{9}$/;
      var passRule = /^(?!_)(?!.*?_$)[a-zA-Z0-9]+$/;
      var validatePass = (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error(this.$t('localization.New-password-tip')));
        }else if(!passRule.test(value)){
          callback(new Error(this.$t('localization.Wrong-password')));
        }else {
          callback();
        }
      };
      var checkPhone = (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error(this.$t('localization.phone-number-tips')));
        }else if(!phoneRule.test(value)){
          callback(new Error(this.$t('localization.mobile-format')));
        }else {
          callback();
        }
      };
      return {
        loginForm: {
          password: '',
          mobile: '',
        },
        loginFlag:true,
        fullscreenLoading:false,
        loginRules: {
          password: [
            { validator: validatePass, trigger: 'change' }
          ],
          mobile: [
            { validator: checkPhone, trigger: 'change' }
          ]
        }
      };
    },
    mounted(){
      this.init()
    },
    methods: {
      init(){
        var bodyHeight = $(window).height();
        $('.login_content').css('height',bodyHeight)
      },
      loginSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 表单验证通过
            if(this.loginFlag){

              this.loginFlag = false //提交关闭，阻止连续点击
              var url = this.$urlPrefix+'/login'
              this.loginForm._ajax=1
              this.fullscreenLoading = true;
              this.$http.post(url,this.loginForm).then(function(response){
                 var _this = this
                 if(response.body.code==1){
                    localStorage.setItem('token',response.body.data.tokey)
                    setTimeout(function(){
                      if(localStorage.getItem('router')){
                        _this.$router.push(localStorage.getItem('router'))
                      }else{
                        _this.$router.push('/')
                      }
                      localStorage.setItem('userPhone',_this.loginForm.mobile)
                       _this.fullscreenLoading = false;
                       _this.loginFlag = true //提交打开
                       _this.$refs[formName].resetFields();
                       _this.getName()
                       //给socket发送数据
                       _this.$bus.$emit('socketLogin', '');
                    },1500)
                 }else{
                    this.loginFlag = true  //提交打开
                    this.$message({
                      message: response.body.msg,
                      type: 'error'
                    });
                    this.fullscreenLoading = false;
                 }
              })
            }
          } else {
            return false;
          }
        });
      },
      getName(){
        var url = this.$urlPrefix+'/top'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token
        }
        this.$http.post(url,data).then(function(response){
           if(response.body.code==1){
             this.$bus.$emit('newNickName', response.body.data);
             localStorage.setItem('nickName',response.body.data)
           }
        })
      }
    }
}
</script>
