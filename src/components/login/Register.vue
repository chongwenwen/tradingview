<template>
  <div class="login_content">
      <div class="login_container register_container">
        <img src="../../assets/login/watermark.png">
        <div class="title">
            {{ $t("localization.Register") }}
        </div>
        <el-form :model="registerForm" :rules="registerRules" ref="registerForm" label-width="100%" class="demo-ruleForm login_form">
          <div class="phone_lable">{{$t('localization.mobile')}}</div>
          <div class="phone_item">
            <el-form-item label="" prop="area_code" class="area">
              <el-select v-model="registerForm.area_code" :placeholder="$t('localization.Area-code')" filterable :no-match-text="$t('localization.area-not-exist')">
                <el-option v-for="(item, index) in countryData" :key="index" :label="'+ '+item.code+' ( '+item.zh+' ) '" :value="'+ '+item.code+' ( '+item.zh+' ) '"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="mobile" class="phone">
              <el-input type="text" v-model="registerForm.mobile" autocomplete="off" :placeholder="$t('localization.mobile')"></el-input>
            </el-form-item>
          </div>
          <el-form-item :label="$t('localization.Verification-Code')" prop="code">
            <el-input type="text" v-model="registerForm.code" autocomplete="off" :placeholder="$t('localization.validation-code')" style="width: 250px;margin-right:110px;">
            </el-input>
            <a href="javascript:;" id="getCode" @click="sendCode()">{{tip}}</a>
          </el-form-item>
          <el-form-item :label="$t('localization.Password')" prop="password">
            <el-input type="password" v-model="registerForm.password" autocomplete="off" :placeholder="$t('localization.Password')" class="bui-input"></el-input>
          </el-form-item>
          <el-form-item :label="$t('localization.Confirm-password')" prop="confirmPass">
            <el-input type="password" v-model="registerForm.confirmPass" autocomplete="off" :placeholder="$t('localization.Confirm-password')"></el-input>
          </el-form-item>
          <div class="login_submit">
            <el-button type="primary" @click="submitForm('registerForm')">{{$t('localization.Register')}}</el-button>
          </div>
          <div class="tip">
            <span>{{$t('localization.Existing-account')}}？</span>
            <router-link to="/login">{{$t('localization.Immediate-login')}}</router-link> 
          </div>
        </el-form>
      </div>
  </div>
</template>

<script>
var phoneRule = /^[1][3,4,5,7,8][0-9]{9}$/;
var passRule = /^(?!_)(?!.*?_$)[a-zA-Z0-9]+$/;
var timer = null;
export default {
  name: 'Register',
  data() {
      var validatePass = (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error(this.$t('localization.New-password-tip')));
        }else if(!passRule.test(value)){
          callback(new Error(this.$t('localization.Wrong-password-register')));
        }else if( value.length<6 || value.length>18){
          callback(new Error(this.$t('localization.passwords-recommended')));
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
      var checkPass = (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error(this.$t('localization.Confirm-password-tips')));
        }else if(value !== this.registerForm.password){
          callback(new Error(this.$t('localization.password-atypism')));
        }else {
          callback();
        }
      };
      var phoneCode = (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error(this.$t('localization.Verification-empty')));
        }else {
          callback();
        }
      };
      var checkCountry = (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error(this.$t('localization.choose-nationality')));
        }else {
          callback();
        }
      };
      var checkArea = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('localization.choose-area')));
        }else {
          callback();
        }
      };
      return {
        registerForm: {
          password: '',
          mobile: '',
          confirmPass:'',
          code:'',
          nationality:'',
          area_code:''
        },
        countryData:[],
        tip:this.$t('localization.Get-the-code'),
        time:60,
        flag:true,
        registerRules: {
          password: [
            { validator: validatePass,trigger: 'blur'}
          ],
          mobile: [
            { validator: checkPhone,trigger: 'blur' }
          ],
          confirmPass:[
            { validator: checkPass,trigger: 'blur'}
          ],
          code:[
            { validator: phoneCode,trigger: 'change'}
          ],
          area_code:[
            { validator: checkArea,trigger: 'change'}
          ]
        }
      };
    },
    created(){
      this.init()
    },
    mounted(){
      var bodyHeight = $(window).height();
      $('.login_content').css('height',bodyHeight)
    },
    methods: {
      /*
        获取所有国家区号
      */
      init(){
        var url = this.$urlPrefix+'/country'
        var data={
          _ajax:1
        }
        this.$http.post(url,data).then(function(response){
           if(response.body.code==1){
              this.countryData = JSON.parse(response.body.data)
           }
        })
      },
      /*
        注册提交
      */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var countryArea = this.registerForm.area_code
            this.registerForm.area_code = countryArea.split('(')[0].split('+')[1].trim();
            this.registerForm.nationality = countryArea.split('(')[1].split(')')[0].trim();
            this.registerForm._ajax=1
            var url = this.$urlPrefix+'/register'
            this.$http.post(url,this.registerForm).then(function(response){
              var _this = this
              if(response.body.code==1){
                 this.registerForm.area_code = countryArea
                 this.$message({
                   message: response.body.msg,
                   type: 'success',
                   duration: 2000,
                   onClose:function(){
                      _this.$refs[formName].resetFields();
                      _this.$router.push({
                         path:'/login'
                      })
                   }
                 });
              }else{
                 this.$message({
                   message: response.body.msg,
                   type: 'error'
                 });
                 _this.registerForm.area_code = countryArea
              }
            })
          } else {
            return false;
          }
        });
      },
      /*
        发送验证码
      */ 
      sendCode(){
        var that = this
        if(this.registerForm.mobile==""){
           this.$message({
             message: this.$t('localization.phone-number-tips'),
             type: 'error'
           });
        }else if(!phoneRule.test(this.registerForm.mobile)){
           this.$message({
             message: this.$t('localization.mobile-format'),
             type: 'error'
           });
        }else{
           if(this.flag){
              this.flag = false
              var url = this.$urlPrefix+'/sendSms'
              var data={
                _ajax:1,
                mobile:this.registerForm.mobile
              }
              this.$http.post(url,data).then(function(response){
                 if(response.body.code==1){
                    this.$message({
                      message: this.$t('localization.send-code'),
                      type: 'success'
                    });
                    timer = setInterval(function(){
                       if(that.time<=1){
                          that.tip = that.$t('localization.Regain');
                          window.clearInterval(timer)
                          that.time = 60
                          that.flag = true
                       }else{
                          that.time = that.time-1;
                          that.tip = that.time +" "+that.$t('localization.Seconds-after-retry');
                       }
                    },1000)
                 }
              })
           }
        }
      }
    },
    destroyed(){
      if(timer){
        window.clearInterval(timer)
      }
    }
}
</script>
