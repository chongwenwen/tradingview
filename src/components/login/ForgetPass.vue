<template>
  <div class="login_content">
      <div class="login_container forget_contain" style="margin:150px auto 0;">
        <img src="../../assets/login/watermark.png">
        <div class="title">
            {{$t('localization.Change-password')}}
        </div>
        <el-form :model="forgetForm" :rules="forgetRules" ref="forgetForm" label-width="100%" class="demo-ruleForm login_form">
          <div class="phone_lable">{{$t('localization.mobile')}}</div>
          <div class="phone_item">
            <el-form-item label="" prop="mobile" class="phone">
              <el-input type="text" v-model="forgetForm.mobile" autocomplete="off" :placeholder="$t('localization.mobile')"></el-input>
            </el-form-item>
          </div>
          <el-form-item :label="$t('localization.Verification-Code')" prop="code">
            <el-input type="text" v-model="forgetForm.code" autocomplete="off" :placeholder="$t('localization.validation-code')" style="width: 250px;margin-right:110px;">
            </el-input>
            <a href="javascript:;" id="getCode" @click="sendCode()">{{tip}}</a>
          </el-form-item>
          <el-form-item :label="$t('localization.Password')" prop="password">
            <el-input type="password" v-model="forgetForm.password" autocomplete="off" :placeholder="$t('localization.Password')" class="bui-input"></el-input>
          </el-form-item>
          <el-form-item :label="$t('localization.Confirm-password')" prop="confirmPass">
            <el-input type="password" v-model="forgetForm.confirmPass" autocomplete="off" :placeholder="$t('localization.Confirm-password')"></el-input>
          </el-form-item>
          <div class="login_submit">
            <el-button type="primary" @click="submitForm('forgetForm')">{{$t('localization.Submission')}}</el-button>
          </div>
          <div class="tip">
            <router-link to="/login">{{$t('localization.Return-login')}}</router-link> 
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
        }else if(value !== this.forgetForm.password){
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
      return {
        forgetForm: {
          password: '',
          mobile: '',
          confirmPass:'',
          code:''
        },
        countryData:[],
        tip:this.$t('localization.Get-the-code'),
        time:60,
        flag:true,
        forgetRules: {
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
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            var url = this.$urlPrefix+'/forgetPwd'
            this.forgetForm._ajax=1

            this.$http.post(url,this.forgetForm).then(function(response){
               var _this = this
               if(response.body.code==1){
                  this.$message({
                    message: response.body.msg,
                    type: 'success',
                    duration: 2000,
                    onClose:function(){
                       _this.$refs[formName].resetFields();
                       //跳转登录页
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
               }
            })
          } else {
            return false;
          }
        });
      },
      sendCode(){
        var that = this
        if(this.forgetForm.mobile==""){
            that.$message({
              message: this.$t('localization.phone-number-tips'),
              type: 'error'
            });
        }else if(!phoneRule.test(this.forgetForm.mobile)){
            that.$message({
              message: this.$t('localization.mobile-format'),
              type: 'error'
            });
        }else{
            if(this.flag){
              this.flag = false
              var url = this.$urlPrefix+'/sendSms'
              var data={
                _ajax:1,
                mobile:this.forgetForm.mobile
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
