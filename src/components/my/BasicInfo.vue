<template>
    <div>
        <div class="top">
           <div class="nickName">
              <span v-if="!replaceNick">{{nickName}}</span>
              <input v-if="replaceNick" v-model="editNickName"/>
              <a href="javascript:;" @click="replaceNickName" v-if="!replaceNick">{{ $t("localization.Modify-nickname") }}</a>
              <a href="javascript:;" v-if="replaceNick" @click="nickChanged">{{ $t("localization.Confirm") }}</a>
              <a href="javascript:;" v-if="replaceNick" @click="nickCancle">{{ $t("localization.Cancle") }}</a>
              <p>{{ $t("localization.Last-logon-time") }}： {{basicInfo.login_time}} <router-link to="/my/loginLog">{{ $t("localization.Login-record") }}</router-link></p>
              <p>{{ $t("localization.Last-logon-ip") }}： {{basicInfo.ip}} </p>
           </div>
        </div>
        <ul class="safeItem">
          <li>
            <div class="name">{{ $t("localization.Bind-mailbox") }}：</div>    
            <div class="detail">
               <span class="noBind" v-if="basicInfo.email==''">{{ $t("localization.Unbound") }}</span>
               <span v-if="basicInfo.email">{{basicInfo.email}}</span> 
            </div>
            <div class="gt">
               <button @click="replaceEmail" v-if="basicInfo.email ==''">{{ $t("localization.De-binding") }}</button>
               <button @click="replaceEmail" v-if="basicInfo.email">{{ $t("localization.Modify") }}</button>
            </div>
          </li>
          <li>
            <div class="name">{{ $t("localization.Real-name") }}</div>
            <div class="detail" v-if="basicInfo.certify == 1">
               <i class="el-icon-success"></i> {{ $t("localization.Authentication-pass") }}
            </div>
            <div class="detail" v-else>
              <span class="noBind">{{ $t("localization.Uncertified") }}</span>
              （ {{ $t("localization.certify-tip") }} ）
            </div>
            <div class="gt">
               <button @click="certification" v-if="basicInfo.certify != 1">{{ $t("localization.De-certification") }}</button>
            </div>
          </li>
        </ul>
        <!-- 邮箱验证modal -->
         <el-dialog
            :title="basicInfo.email?$t('localization.Modify-mailbox'):$t('localization.Bind-mailbox')"
            :visible.sync="emailModal"
            width="700px">
            <div class="progress">
              <div class="item" v-if="basicInfo.email" :class="{'active':emailProgress >= 1}"><i class="el-icon-circle-check"></i>{{ $t("localization.Mailbox-validation") }}</div>
              <span v-if="basicInfo.email">- - -</span>
              <div class="item" :class="{'active':emailProgress >= 2}"><i class="el-icon-circle-check"></i>{{ $t("localization.Add-new-mailbox") }}</div>
              <span>- - -</span>
              <div class="item" :class="{'active':emailProgress == 3}"><i class="el-icon-circle-check"></i>
                <span v-if="basicInfo.email">{{ $t("localization.Modify") }}</span><span v-if="!basicInfo.email">{{ $t("localization.Add-to") }}</span>{{ $t("localization.success") }}
              </div>
            </div>
            <div class="body_content">
              <div v-if="emailProgress == 1 && basicInfo.email">
                <el-input :placeholder="$t('localization.current-mailbox')" v-model="oldEmail"></el-input>
                <div class="emailCode">
                  <el-input :placeholder="$t('localization.validation-code')"  v-model="oldEmailCode"></el-input>
                  <span @click="sendOldEmailCode">{{sendOldCode}}</span>
                </div>
              </div>
              <div v-if="emailProgress == 2">
                <el-input :placeholder="$t('localization.enter-new-mailbox')" v-model="newEmail"></el-input>
                <div class="emailCode">
                  <el-input :placeholder="$t('localization.validation-code')"  v-model="newEmailCode"></el-input>
                  <span @click="sendNewEmailCode">{{sendNewCode}}</span>
                </div>
              </div>
              <div class="success" v-if="emailProgress == 3">
                 <p><i class="el-icon-success"></i></p>
                 {{$t('localization.Mailbox-Successful')}}
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" v-if="emailProgress == 1 && basicInfo.email" @click="confirmChangeEmail1">{{$t('localization.Next')}}</el-button>
              <el-button type="primary" v-if="emailProgress == 2" @click="confirmChangeEmail2">{{$t('localization.Submission')}}</el-button>
              <el-button type="primary" v-if="emailProgress == 3" @click="emailModal=false">{{$t('localization.Confirm')}}</el-button>
            </span>
         </el-dialog>
    </div>
</template>
<script>
var emailRule = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
var timer=null;
export default {
  props:['basicInfo'],
  data() {
    return {
      nickName:'',
      replaceNick:false,
      emailModal:false,
      emailProgress:1,
      oldEmail:'',
      oldEmailCode:'',
      newEmail:'',
      newEmailCode:'',
      sendOldCode:this.$t('localization.Get-the-code'),
      sendNewCode:this.$t('localization.Get-the-code'),
      oldEmailFlag:true,
      newEmailFlag:true,
      oldEmailtime:60,
      newEmailtime:60
    }
  },
  created(){
    this.nickName = this.basicInfo.nickname?this.basicInfo.nickname:this.basicInfo.mobile;
    localStorage.setItem('nickName',this.nickName)
  },
  methods: {
    replaceNickName(){
       this.replaceNick = true
       this.editNickName = this.nickName
    },
    nickChanged(){
        var _this = this
        //给后台发送
        var url = this.$urlPrefix+'/nickname'
        var token = localStorage.getItem('token')
        if(this.editNickName.trim()==''){
          this.$message({  
            message: _this.$t('localization.nickname-empty'),
            type: 'error'
          });
          return false;
        }
        var data={
          _ajax:1,
          toKey:token,
          nickname:this.editNickName.trim()
        }
        this.$http.post(url,data).then(function(response){
           var _this = this
           if(response.body.code==1){
             this.$message({
               message: response.body.msg,
               type: 'success',
               duration: 1000,
               onClose:function(){
                  _this.$emit('changeNickName',_this.editNickName.trim())
                  _this.nickName = _this.editNickName.trim()
                  localStorage.setItem('nickName',_this.editNickName.trim())
                  _this.replaceNick = false
                  _this.$bus.$emit('newNickName', _this.editNickName.trim());
               }
             });
           }else{
              this.$message({
                message: response.body.msg,
                type: 'error'
              });
           }
        })
    },
    nickCancle(){
       this.replaceNick = false
       this.nickName = localStorage.getItem('nickName')
    },
    replaceEmail(){
       if(this.basicInfo.email){
          this.emailProgress = 1
       }else{
          this.emailProgress = 2
       }
       this.emailModal = true
       this.sendOldCode =this.$t('localization.Get-the-code');
       this.sendNewCode =this.$t('localization.Get-the-code');
    },
    certification(){
       this.$router.push({
          path:'/my/certification'
       })
    },
    confirmChangeEmail1(){//验证旧邮箱
      if(this.oldEmail==''){
        this.$message({
          message: this.$t('localization.Mailbox-empty'),
          type: 'error'
        });
      }else if(this.oldEmailCode==''){
        this.$message({
          message: this.$t('localization.Verification-empty'),
          type: 'error'
        });
      }else{
        var url = this.$urlPrefix+'/vEmail'
        this.confirmEmail(url,this.oldEmail,this.oldEmailCode,2)
      }
    },
    confirmChangeEmail2(){//提交邮箱
      if(this.newEmail==''){
         this.$message({
           message: this.$t('localization.Mailbox-empty'),
           type: 'error'
         });
      }else if(this.newEmailCode==''){
         this.$message({
           message: this.$t('localization.Verification-empty'),
           type: 'error'
         });
      }else{
         var url = this.$urlPrefix+'/email'
         this.confirmEmail(url,this.newEmail,this.newEmailCode,3)
      }
    },
    confirmEmail(url,email,code,step){
       var token = localStorage.getItem('token')
       var data={
         _ajax:1,
         email:email,
         code:code,
         toKey:token
       }
       this.$http.post(url,data).then(function(response){
           if(response.body.code==1){
              this.emailProgress = step
              window.clearInterval(timer)
           }else{
              this.$message({
                message: response.body.msg,
                type: 'error'
              });
           }
       })
    },
    sendNewEmailCode(){
       if(this.newEmail==''){
          this.$message({
            message: this.$t('localization.Mailbox-empty'),
            type: 'error'
          });
       }else if(!emailRule.test(this.newEmail)){
          this.$message({
            message: this.$t('localization.Error-mailbox'),
            type: 'error'
          });
       }else{
          if(this.newEmailFlag){
             this.newEmailFlag = false
             this.sendCode(this.newEmail)
         }
       }
    },
    sendOldEmailCode(){
       if(this.oldEmail==''){
          this.$message({
            message: this.$t('localization.Mailbox-empty'),
            type: 'error'
          });
       }else if(!emailRule.test(this.oldEmail)){
          this.$message({
            message: this.$t('localization.Error-mailbox'),
            type: 'error'
          });
       }else{
          if(this.oldEmailFlag){
             this.oldEmailFlag = false  
             this.sendCode(this.oldEmail)
           }
       } 
    },
    sendCode(email){
      var url = this.$urlPrefix+'/sendEmail'
      var data={
        _ajax:1,
        email:email
      }
      this.$http.post(url,data).then(function(response){
          var that = this
          if(response.body.code==1){
            this.$message({
              message: this.$t('localization.send-code'),
              type: 'success'
            });
            if(this.emailProgress==2){//已经绑定过
              timer = setInterval(()=>{
                if(that.newEmailtime<=1){
                  that.sendNewCode = that.$t('localization.Regain');
                  window.clearInterval(timer)
                  that.newEmailtime = 60
                  that.newEmailFlag = true
                }else{
                  that.newEmailtime = that.newEmailtime-1;
                  that.sendNewCode = that.newEmailtime +" "+that.$t('localization.Seconds-after-retry');
                }
              },1000)
              
            }else{//未绑定
              timer = setInterval(()=>{
                if(that.oldEmailtime<=1){
                  that.sendOldCode = that.$t('localization.Regain');
                  window.clearInterval(timer)
                  that.oldEmailtime = 60
                  that.oldEmailFlag = true
                }else{
                  that.oldEmailtime = that.oldEmailtime-1;
                  that.sendOldCode = that.oldEmailtime +" "+that.$t('localization.Seconds-after-retry');
                }
              },1000)
            }
          }else{
            this.$message({
              message: response.body.msg,
              type: 'error'
            });
            if(this.emailProgress==1){
              this.oldEmailFlag = true 
            }else{
              this.newEmailFlag = true
            }
          }
      })
    }
  },
  watch:{
     basicInfo:function(val){
        this.nickName = this.basicInfo.nickname?this.basicInfo.nickname:this.basicInfo.mobile;
        localStorage.setItem('nickName',this.nickName)
     },
     emailModal(val){
        if(!val){
          window.clearInterval(timer)
          this.$emit('emailConfig','')
          this.timer = null
          this.oldEmail=''
          this.oldEmailCode=''
          this.newEmail=''
          this.newEmailCode=''
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