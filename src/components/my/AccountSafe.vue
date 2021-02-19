<template>
  <div>
     <div class="top" v-loading="loading">
         <div class="safety_grade">
            <span>{{ $t("localization.Safety-grade") }}：</span>
            <el-rate 
              disabled 
              v-model="baseInfo.grade">
            </el-rate>
         </div>
         <p>{{ $t("localization.Safety-authentication-tips") }}</p>
      </div>
      <ul class="safeItem">
         <li>
           <div class="name">{{ $t("localization.Bind-phone") }}</div>    
           <div class="detail">
              <span class="noBind" v-if="!baseInfo.mobile">{{ $t("localization.Unbound") }}</span>
              <span v-if="baseInfo.mobile">{{baseInfo.mobile.substr(0, 3)+"****" + baseInfo.mobile.substr(7)}}</span>
           </div>
           <div class="gt">
              <button @click="replacePhone">{{ $t("localization.Modify") }}</button>
           </div>
         </li>
         <li>
           <div class="name">{{ $t("localization.Login-password") }}</div>
           <div class="detail">
              {{ $t("localization.Password-strength") }}：
              <span class="noBind">{{baseInfo.strength}}</span>
           </div>
           <div class="gt">
              <button @click="replacePass">{{ $t("localization.Modify") }}</button>
           </div>
         </li>
         <li>
           <div class="name">{{ $t("localization.Set-the-transaction-password") }}</div>
           <div class="detail">
              <span class="noBind" v-if="baseInfo.pay==0">{{ $t("localization.Not-set") }}</span>
              <span v-if="baseInfo.pay==1">******</span>
           </div>
           <div class="gt">
              <button v-if="baseInfo.pay==0" @click="setDealPass">{{ $t("localization.Settings") }}</button>
              <button v-if="baseInfo.pay==1" @click="replaceDealPass">{{ $t("localization.Modify") }}</button>
           </div>
         </li>
         <li>
           <div class="name">{{ $t("localization.Collection-settings") }}：</div>
           <div class="detail">
              <span class="noBind" v-if="baseInfo.collect==0">{{ $t("localization.Not-set") }}</span>
              <span v-if="baseInfo.collect != 0" v-for="item in baseInfo.collect">
                <img src="../../assets/weixin_01.png" v-if="item=='1'">
                <img src="../../assets/zhifubao_01.png" v-if="item=='2'">
                <img src="../../assets/card_01.png" v-if="item=='3'">
              </span>
              <span>（ {{ $t("localization.Collection-tips") }} ）</span>
           </div>
           <div class="gt">
              <button @click="setPaymentStyle">{{ $t("localization.Settings") }}</button>
           </div>
         </li>
     </ul>
     <!-- 手机修改modal -->
     <el-dialog
       :title="$t('localization.Bind-phone')"
       :visible.sync="phoneModal"
       width="700px">
        <div class="progress">
          <div class="item" :class="{'active':phoneProgress >= 1}"><i class="el-icon-circle-check"></i>{{ $t("localization.Mailbox-validation") }}</div>
          <span>- - -</span>
          <div class="item" :class="{'active':phoneProgress >= 2}"><i class="el-icon-circle-check"></i>{{ $t("localization.New-mobile-phone") }}</div>
          <span>- - -</span>
          <div class="item" :class="{'active':phoneProgress == 3}"><i class="el-icon-circle-check"></i>{{ $t("localization.Binding-success") }}</div>
        </div>
        <div class="body_content">
          <div v-if="phoneProgress == 1">
          <el-input :placeholder="$t('localization.current-mailbox')" v-model="phoneEmail"></el-input>
            <div class="emailCode">
            <el-input :placeholder="$t('localization.Verification-Code')"  v-model="EmailCode"></el-input>
              <span @click="sendEmailCode">{{sendEmailTip}}</span>
            </div>
          </div>
          <div v-if="phoneProgress == 2">
          <el-input :placeholder="$t('localization.New-mobile-phone')" v-model="newPhone"></el-input>
            <div class="emailCode">
            <el-input :placeholder="$t('localization.Verification-Code')"  v-model="newPhoneCode"></el-input>
              <span @click="sendPhoneCode">{{phoneCodeTip}}</span>
            </div>
          </div>
          <div class="success" v-if="phoneProgress == 3">
             <p><i class="el-icon-success"></i></p>{{$t('localization.Mobile-successful')}}
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" v-if="phoneProgress == 1" @click="confirmChangePhone1">{{$t('localization.Next')}}</el-button>
          <el-button type="primary" v-if="phoneProgress == 2" @click="confirmChangePhone2">{{$t('localization.Confirm')}}</el-button>
          <el-button type="primary" v-if="phoneProgress == 3" @click="phoneModal=false">{{$t('localization.Confirm')}}</el-button>
        </span>
     </el-dialog>
     <!-- 登录密码修改 -->
      <el-dialog
       :title="$t('localization.Modify-login-password')"
       :visible.sync="passModal"
       width="700px">
        <div class="progress">
          <div class="item" :class="{'active':passProgress >= 1}"><i class="el-icon-circle-check"></i>{{$t('localization.Mobile-verification')}}</div>
          <span>- - -</span>
          <div class="item" :class="{'active':passProgress >= 2}"><i class="el-icon-circle-check"></i>{{$t('localization.Setting-new-password')}}</div>
          <span>- - -</span>
          <div class="item" :class="{'active':passProgress == 3}"><i class="el-icon-circle-check"></i>{{ $t("localization.Binding-success") }}</div>
        </div>
        <div class="body_content">
          <div v-if="passProgress == 1">
            <el-input :placeholder="$t('localization.mobile')" v-model="phone"></el-input>
            <div class="emailCode">
            <el-input :placeholder="$t('localization.Verification-Code')" v-model="phoneCode"></el-input>
              <span @click="sendPhoneCode2">{{phoneTip}}</span>
            </div>
          </div>
          <div v-if="passProgress == 2">
            <el-input type="password" :placeholder="$t('localization.New-password')" class="bui-input" v-model="newPass"></el-input>
            <el-input type="password" :placeholder="$t('localization.Confirm-password')" v-model="confirmPass"></el-input>
          </div>
          <div class="success" v-if="passProgress == 3">
             <p><i class="el-icon-success"></i></p>
             {{$t('localization.New-password-successful')}}
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" v-if="passProgress == 1" @click="confirmChangePass1">{{$t('localization.Next')}}</el-button>
          <el-button type="primary" v-if="passProgress == 2" @click="confirmChangePass2">{{$t('localization.Confirm')}}</el-button>
          <el-button type="primary" v-if="passProgress == 3" @click="passModal=false">{{$t('localization.Confirm')}}</el-button>
        </span>
      </el-dialog>
      <!-- 交易密码设置 -->
      <el-dialog
       :title="$t('localization.Set-the-transaction-password')"
       :visible.sync="dealPassModal"
       width="600px">
          <div class="progress"> 
            <div class="item" :class="{'active':dealProgress >= 1}"><i class="el-icon-circle-check"></i>{{$t('localization.transaction-password')}}</div>
            <span>- - - - -</span>
            <div class="item" :class="{'active':dealProgress == 2}"><i class="el-icon-circle-check"></i>{{$t('localization.Set-successfully')}}</div>
          </div>
          <div class="body_content">
            <div v-if="dealProgress == 1">
              <el-input type="password" :placeholder="$t('localization.Input-password')" v-model="dealPass"></el-input>
              <p style="text-align: left;color:red;padding-left:6px;"> *{{$t('localization.Payment-passwords-tips')}}</p>
            </div>
            <div class="success" v-if="dealProgress == 2">
               <p><i class="el-icon-success"></i></p>
               {{$t('localization.Transaction-password-successfully')}}
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" v-if="dealProgress == 1" @click="confirmChangeDeal">{{$t('localization.Submission')}}</el-button>
            <el-button type="primary" v-if="dealProgress == 2" @click="dealPassModal=false">{{$t('localization.Confirm')}}</el-button>
          </span>
      </el-dialog>
      <!-- 修改交易密码 -->
      <el-dialog
       :title="$t('localization.Modify-transaction-password')"
       :visible.sync="replaceDealModal"
       width="700px">
          <div class="progress">
            <div class="item" :class="{'active':replaceDealProgress >= 1}"><i class="el-icon-circle-check"></i>{{$t('localization.Mobile-verification')}}</div>
            <span>- - -</span>
            <div class="item" :class="{'active':replaceDealProgress >=2}"><i class="el-icon-circle-check"></i>{{$t('localization.Setting-new-password')}}</div>
            <span>- - -</span>
            <div class="item" :class="{'active':replaceDealProgress == 3}"><i class="el-icon-circle-check"></i>{{$t('localization.Modified-success')}}</div>
          </div>
          <div class="body_content">
            <div v-if="replaceDealProgress == 1">
            <el-input :placeholder="$t('localization.mobile')" v-model="replaceDealphone"></el-input>
              <div class="emailCode">
              <el-input :placeholder="$t('localization.Verification-Code')" v-model="replaceDealCode"></el-input>
                <span @click="sendPhoneCode3">{{dealPhoneTip}}</span>
              </div>
            </div>
            <div v-if="replaceDealProgress ==2">
            <el-input type="password" :placeholder="$t('localization.Input-password')" v-model="newDealPass"></el-input>
              <p style="text-align: left;color:#f20;padding-left:6px;"> *{{$t('localization.Payment-passwords-tips')}}</p>
            </div>
            <div class="success" v-if="replaceDealProgress == 3">
               <p><i class="el-icon-success"></i></p>{{$t('localization.Modification-password-successful')}}
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" v-if="replaceDealProgress == 1" @click="replaceDealPassOne">{{$t('localization.Next')}}</el-button>
            <el-button type="primary" v-if="replaceDealProgress == 2" @click="replaceDealPassTwo">{{$t('localization.Submission')}}</el-button>
            <el-button type="primary" v-if="replaceDealProgress == 3" @click="replaceDealModal=false">{{$t('localization.Confirm')}}</el-button>
          </span>
      </el-dialog>
      <!--收付款设置 -->
      <el-dialog
       :title="$t('localization.Collection-settings')"
       :visible.sync="paymentModal"
       width="700px">
          <div class="paymentStyle">
             <h1>{{$t('localization.Choose-way')}}：</h1>
             <el-tabs type="border-card" v-model="paymentStyle" @tab-click="selectPay">
               <!-- 微信 -->
               <el-tab-pane name='1'>
                 <span slot="label">
                    <img src="../../assets/fig.png" class='tip'>
                    <img src="../../assets/weixin.png">
                    {{$t('localization.WeChat')}}
                 </span>
                 <!-- 已设置 -->
                 <div class="payId already" v-if="editWeixinUrl">
                    <div class="item">
                      <span>
                        {{weixin.nickname}}({{$t('localization.wx-nickname')}})
                        <el-switch
                           v-model="wxSwitch"
                           active-color="#409EFF"
                           @change="wxCut">
                        </el-switch>
                      </span>
                    </div>
                    <div class="item">
                      <span>{{weixin.wx_account}}({{$t('localization.wx-number')}})</span>
                    </div>
                   <img :src="editWeixinUrl" class="avatar" style="width: 200px;height: 200px;">
                 </div>
                 <!-- 未设置 -->
                 <div class="payId" v-else>
                   <div class="item">
                      <span>{{$t('localization.wx-nickname')}}：</span>
                      <input type="text" v-model="wx.nickname" :placeholder="$t('localization.wx-nickname')" />
                    </div>
                    <div class="item">
                      <span>{{$t('localization.wx-number')}}：</span>
                      <input type="text" v-model="wx.wx_account" :placeholder="$t('localization.wx-number')" />
                    </div>
                    <div class="item">
                      <span>{{$t('localization.Upload-receipt-code')}}：</span>
                      <div class="imgBox">
                        <el-upload
                          class="avatar-uploader"
                          :action="$urlPrefix+'/picturePay'"
                          accept="image/png, image/jpeg, image/jpg"
                          :show-file-list="false"
                          :on-success="weiCodeSuccess"
                          :before-upload="beforeImgUpload">
                          <img v-if="weixinUrl" :src="weixinUrl" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                      </div>
                    </div>
                 </div>
               </el-tab-pane>
               <!-- 支付宝 -->
               <el-tab-pane name='2'>
                  <span slot="label">
                    <img src="../../assets/fig.png" class='tip'>
                    <img src="../../assets/zhifubao.png">
                    {{$t('localization.Alipay')}}
                  </span>
                  <!-- 已设置 -->
                  <div class="payId already" v-if="zhifubao">
                    <div class="item">
                      <span>
                         {{zhifubao.name}}({{$t('localization.Name-of-payee')}})
                         <el-switch
                           v-model="aliSwitch"
                           active-color="#409EFF"
                           @change="aliCut">
                         </el-switch>
                      </span>
                    </div>
                    <div class="item">
                      <span>{{zhifubao.api_account}}({{$t('localization.Alipay-number')}})</span>
                    </div>
                    <img v-if="editAlipayUrl" :src="editAlipayUrl" class="avatar" style="width: 200px;height: 200px;">
                  </div>
                  <!-- 未设置 -->
                  <div class="payId" v-else>
                    <div class="item">
                      <span>{{$t('localization.Name-of-payee')}}：</span>
                      <input type="text" v-model="alipay.name" :placeholder="$t('localization.Name-of-payee')" />
                    </div>
                    <div class="item">
                      <span>{{$t('localization.Alipay-number')}}：</span>
                      <input type="text" v-model="alipay.api_account" :placeholder="$t('localization.Alipay-number')" />
                    </div>
                    <div class="item">
                      <span>{{$t('localization.Upload-receipt-code')}}：</span>
                      <div class="imgBox">
                        <el-upload
                          class="avatar-uploader"
                          :action="$urlPrefix+'/picturePay'"
                          accept="image/png, image/jpeg, image/jpg"
                          :show-file-list="false"
                          :on-success="alipaySuccess"
                          :before-upload="beforeImgUpload">
                          <img v-if="alipayUrl" :src="alipayUrl" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                      </div>
                    </div>
                  </div>
               </el-tab-pane>
               <!-- 银行卡 -->
               <el-tab-pane name='3'>
                  <span slot="label">
                    <img src="../../assets/fig.png" class='tip'>
                    <img src="../../assets/card.png">{{$t('localization.Bank-card')}}
                  </span>
                  <!-- 已设置 -->
                  <div class="payId already" v-if="editUnion">
                      <div class="item">
                        <span> 
                          {{editUnion.name}}({{$t('localization.Cardholder')}})
                          <el-switch
                           v-model="cardSwitch"
                           active-color="#409EFF"
                           @change="cardCut">
                          </el-switch>
                        </span>
                      </div>
                      <div class="item">
                         <span>{{editUnion.code}}({{$t('localization.Bank-card-number')}})</span>
                      </div>
                      <div class="item">
                        <span>{{editUnion.bank}}({{$t('localization.bank-name')}})</span>
                      </div>
                      <div class="item">
                        <span>{{editUnion.open_bank}}({{$t('localization.Opening-bank')}})</span>
                      </div>
                  </div>
                  <!-- 未设置 -->
                  <div class="payId" v-else>
                     <div class="item">
                       <span>{{$t('localization.Cardholder')}}：</span>
                       <input type="text" v-model="unionPay.name" :placeholder="$t('localization.Name-of-cardholder')" />
                     </div>
                     <div class="item">
                       <span>{{$t('localization.Bank-card-number')}}：</span>
                       <input type="text" v-model="unionPay.code" :placeholder="$t('localization.Bank-card-number')" />
                     </div>
                     <p style="padding-left:110px;">{{$t('localization.bank-tip')}}</p>
                     <div class="item">               
                        <span>{{$t('localization.bank-name')}}：</span>
                        <el-select v-model="unionPay.bank" :placeholder="$t('localization.Please-choose')" filterable>
                          <el-option
                            v-for="item in bankList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.label">
                          </el-option>
                        </el-select>
                     </div>
                     <div class="item">
                       <span>{{$t('localization.Opening-bank')}}：</span>
                       <input type="text" v-model="unionPay.open_bank" :placeholder="$t('localization.Opening-bank')" />
                     </div>
                  </div>
               </el-tab-pane>
             </el-tabs>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" v-if="paymentStyle=='1' && editWeixinUrl==''" @click="weixinSubmit">{{$t('localization.Submission')}}</el-button>
            <el-button type="primary" v-if="paymentStyle=='1' && editWeixinUrl" @click="editWeixinSubmit">{{ $t("localization.Modify") }}</el-button>
            <el-button type="primary" v-if="paymentStyle=='2' && !zhifubao" @click="alipaySubmit">{{$t('localization.Submission')}}</el-button>
            <el-button type="primary" v-if="paymentStyle=='2' && zhifubao" @click="editAlipaySubmit">{{ $t("localization.Modify") }}</el-button>
            <el-button type="primary" v-if="paymentStyle=='3' && editUnion==''" @click="unionPaySubmit">{{$t('localization.Submission')}}</el-button>
            <el-button type="primary" v-if="paymentStyle=='3' && editUnion" @click="editUnionSubmit">{{ $t("localization.Modify") }}</el-button>
          </span>
      </el-dialog>
  </div>
</template>
<script>
import callback from "../../utile/callback.js"
import bankJson from '../../../static/js/bank.js'
var phoneRule = /^[1][3,4,5,7,8][0-9]{9}$/;
var passRule = /^(?!_)(?!.*?_$)[a-zA-Z0-9]+$/;
var length = /^\d{6}$/;  //只能为6位数字
var continuityNum = /([\d])\1{5}/; //重复6位数字
var emailRule = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
var loginTimer = null;
var dealTimer = null;
var emailTimer = null;
var phoneTimer = null;
export default {
  data() {
    return {
      wxSwitch:false,
      aliSwitch:false,
      cardSwitch:false,
      loading:false,
      bankList:[],
      paymentStyle:'1',
      editAlipayUrl:'',
      value:'',
      wx:{
        url:'',
        nickname:'',
        wx_account:''
      },
      alipay:{
        name:'',
        api_account:'',
        url:''
      },
      zhifubao:'',
      editUnion:'',
      unionPay:{
        name:'',
        code:'',
        bank:'',
        open_bank:''
      },
      baseInfo:[],
      phoneModal:false,
      passModal:false,
      dealPassModal:false,
      replaceDealModal:false,
      paymentModal:false,
      phoneProgress:1,
      passProgress:1,
      dealProgress:1,
      replaceDealProgress:1,
      phoneEmail:'',
      EmailCode:'',
      newPhone:'',
      newPhoneCode:'',
      phone:'',
      phoneCode:'',
      newPass:'',
      confirmPass:'',
      dealPass:'',
      replaceDealphone:'',
      replaceDealCode:'',
      newDealPass:'',
      sendEmailTip:this.$t('localization.Get-the-code'),
      phoneCodeTip:this.$t('localization.Get-the-code'),
      phoneTip:this.$t('localization.Get-the-code'),
      dealPhoneTip:this.$t('localization.Get-the-code'),
      emailFlag:true,
      phoneFlag:true,
      passPhoneFlag:true,
      passPhoneFlag1:true,
      emailTime:60,
      phoneTime:60,
      dealPhoneTime:60,
      passPhoneTime:60,
      weixinUrl:'',
      alipayUrl:'',
      editWeixinUrl:'',
      wexin:{}
    }
  },
  created(){
    this.init()
  },
  mounted(){
    this.bankList = bankJson.getBank
  },
  methods: {
     /*
      初始化页面数据
     */
     init(){
        var url = this.$urlPrefix+'/account'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token
        }
        this.$http.post(url,data).then(function(response){
           if(response.body.code==1){
              this.baseInfo = response.body.data
           }
        })
     },
     /*
       初始化收款设置弹窗数据
     */
     getInitStatus(){
       this.weixinUrl=''
       this.paymentStyle = localStorage.getItem('payment')? localStorage.getItem('payment'):'1';
       var url = this.$urlPrefix+'/paySetUpFind'
       var token = localStorage.getItem('token')
       var data={
         _ajax:1,
         toKey:token
       }
       this.$http.post(url,data).then(function(response){
          if(response.body.code==1){
             var result = response.body.data
             if(result){
               if(result.wx){
                  this.weixin = JSON.parse(result.wx)
                  this.editWeixinUrl = result.url+this.weixin.url
                  this.wxSwitch = this.weixin.status==1?true:false
               }
               if(result.alipay){
                 this.zhifubao = JSON.parse(result.alipay)
                 this.editAlipayUrl = result.url+this.zhifubao.url
                 this.aliSwitch = this.zhifubao.status==1?true:false
               }
               if(result.bank){
                  this.editUnion = JSON.parse(result.bank)
                  this.cardSwitch = this.editUnion.status==1?true:false
               }
             }
          }
       })
     },
     /*
       点击去修改手机号
     */
     replacePhone(){
       this.phoneModal = true
       this.phoneProgress = 1
     },
     /*
       点击去修改登录密码
     */
     replacePass(){
       this.passModal = true
       this.passProgress = 1
     },
     /*
       点击去设置交易密码
     */
     setDealPass(){
       this.dealPassModal = true
       this.dealProgress = 1
     },
     /*
       点击去修改交易密码
     */
     replaceDealPass(){
      this.replaceDealModal = true
      this.replaceDealProgress = 1
     },
     /*
       点击去设置收款方式
     */
     setPaymentStyle(){
       this.paymentModal = true
     },
     /*
       修改手机号-邮箱验证-发送验证码
     */
     sendEmailCode(){
       if(this.phoneEmail.trim()==''){
          this.$message({
            message: this.$t('localization.Mailbox-empty'),
            type: 'error'
          });
          return;
       }
       if(!emailRule.test(this.phoneEmail)){
          this.$message({
            message: this.$t('localization.Error-mailbox'),
            type: 'error'
          });
          return;
       }
       if(this.emailFlag){
          this.emailFlag = false
          var url = this.$urlPrefix+'/sendEmail'
          var data={
            _ajax:1,
            email:this.phoneEmail
          }
          this.$http.post(url,data).then(function(response){
             var that = this
             if(response.body.code==1){
                this.$message({
                  message: this.$t('localization.send-code'),
                  type: 'success'
                });
                emailTimer = setInterval(function(){
                   if(that.emailTime<=1){
                      that.sendEmailTip = that.$t('localization.Regain');
                      window.clearInterval(emailTimer)
                      that.emailTime = 60
                      that.emailFlag = true
                   }else{
                      that.emailTime = that.emailTime-1;
                      that.sendEmailTip = that.emailTime +" "+that.$t('localization.Seconds-after-retry');
                   }
                },1000)
             }
          })
        }
     },
     /*
       修改手机号-邮箱验证
     */
     confirmChangePhone1(){
        if(this.phoneEmail.trim()==''){
          this.$message({
            message: this.$t('localization.Mailbox-empty'),
            type: 'error'
          });
          return;
        }
        if(this.EmailCode.trim()==''){
          this.$message({
            message: this.$t('localization.Verification-empty'),
            type: 'error'
          });
          return;
        }
        var url = this.$urlPrefix+'/vEmail'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          email:this.phoneEmail,
          code:this.EmailCode,
          toKey:token
        }
        this.$http.post(url,data).then(function(response){
            if(response.body.code==1){
               this.phoneProgress = 2
               this.phoneEmail=''
               this.EmailCode=''
               window.clearInterval(emailTimer)
            }else{
               this.$message({
                 message: response.body.msg,
                 type: 'error'
               });
            }
        }) 
     },
     /*
       修改手机号-设置新手机号-发送验证码
     */
      sendPhoneCode(){
        if(this.newPhone.trim()==''){
          this.$message({
            message: this.$t('localization.phone-number-tips'),
            type: 'error'
          });
        }else if(!phoneRule.test(this.newPhone)){
          this.$message({
            message: this.$t('localization.mobile-format'),
            type: 'error'
          });
        }else{
          if(this.phoneFlag){
            this.phoneFlag = false
            var url = this.$urlPrefix+'/sendSms'
            var data={
              _ajax:1,
              mobile:this.newPhone
            }
            this.$http.post(url,data).then(function(response){
                var that = this
                if(response.body.code==1){
                  this.$message({
                    message: this.$t('localization.send-code'),
                    type: 'success'
                  });
                  phoneTimer = setInterval(function(){
                     if(that.passPhoneTime<=1){
                        that.phoneCodeTip =that.$t('localization.Regain');
                        window.clearInterval(phoneTimer)
                        that.passPhoneTime = 60
                        that.phoneFlag = true
                     }else{
                        that.passPhoneTime = that.passPhoneTime-1;
                        that.phoneCodeTip = that.passPhoneTime +" "+that.$t('localization.Seconds-after-retry');
                     }
                  },1000)
                }else{
                  this.$message({
                    message: response.body.msg,
                    type: 'error'
                  });
                }
            })
          }
        }
     },
     /*
       修改手机号-设置新手机号-提交
     */
     confirmChangePhone2(){
        if(this.phoneCodeRule(this.newPhone,this.newPhoneCode)){
            var url = this.$urlPrefix+'/Vmobile'
            var token = localStorage.getItem('token')
            var data={
              _ajax:1,
              toKey:token,
              mobile:this.newPhone,
              code:this.newPhoneCode
            }
            this.$http.post(url,data).then(function(response){
               if(response.body.code==1){
                  this.phoneProgress = 3
                  this.newPhone = ''
                  this.newPhoneCode = ''
                  window.clearInterval(phoneTimer)
               }else{
                  callback.callback(this,response.body)
               }
            })
        }
     },
     /*
       修改登录密码-验证手机-发送验证码
     */
     sendPhoneCode2(){
        var that = this
        if(this.phone.trim()==''){
          this.$message({
            message: this.$t('localization.phone-number-tips'),
            type: 'error'
          });
        }else if(!phoneRule.test(this.phone)){
          this.$message({
            message: this.$t('localization.mobile-format'),
            type: 'error'
          });
        }else{
          if(this.passPhoneFlag){
            this.passPhoneFlag = false
            var url = this.$urlPrefix+'/sendSms'
            var data={
              _ajax:1,
              mobile:this.phone
            }
            this.$http.post(url,data).then(function(response){
                var that = this
                if(response.body.code==1){
                  this.$message({
                    message: this.$t('localization.send-code'),
                    type: 'success'
                  });
                  loginTimer = setInterval(function(){
                     if(that.phoneTime<=1){
                        that.phoneTip =that.$t('localization.Regain');
                        window.clearInterval(loginTimer)
                        that.phoneTime = 60
                        that.passPhoneFlag = true
                     }else{
                        that.phoneTime = that.phoneTime-1;
                        that.phoneTip = that.phoneTime +" "+that.$t('localization.Seconds-after-retry');
                     }
                  },1000)
                }else{
                  this.$message({
                    message: response.body.msg,
                    type: 'error'
                  });
                }
            })
          }
        }
     },
     /*
       修改登录密码-验证手机-提交
     */
     confirmChangePass1(){
        if(this.phoneCodeRule(this.phone,this.phoneCode)){
            var url = this.$urlPrefix+'/Vmobile'
            var token = localStorage.getItem('token')
            var data={
              _ajax:1,
              toKey:token,
              mobile:this.phone,
              code:this.phoneCode
            }
            this.$http.post(url,data).then(function(response){
               if(response.body.code==1){
                  this.passProgress = 2
                  this.phone = ''
                  this.phoneCode = ''
                  window.clearInterval(loginTimer)
               }else{
                  callback.callback(this,response.body)
               }
            })
        }
     },
     /*
       修改登录密码-新密码-提交
     */
     confirmChangePass2(){
        if(this.newPass.trim()==''){
           this.$message({
            message: this.$t('localization.New-password-tip'),
            type: 'error'
           });
           return;
        }
        if(this.confirmPass.trim()==''){
           this.$message({
            message: this.$t('localization.Confirm-password-tips'),
            type: 'error'
           });
           return;
        }
        if(this.confirmPass != this.newPass){
          this.$message({
            message: this.$t('localization.password-atypism'),
            type: 'error'
          });
          return;
        }
        var url = this.$urlPrefix+'/updatePwd'
        var token = localStorage.getItem('token')
        var data={
          _ajax:1,
          toKey:token,
          password:this.newPass
        }
        this.$http.post(url,data).then(function(response){
           if(response.body.code==1){
              this.passProgress = 3
              this.newPass=''
              this.confirmPass=''
           }else{
              callback.callback(this,response.body)
           }
        })
     },
     /*
       修改交易密码-验证手机-发送验证码
     */
     sendPhoneCode3(){
        var that = this
        if(this.replaceDealphone.trim()==''){
          this.$message({
            message: this.$t('localization.phone-number-tips'),
            type: 'error'
          });
        }else if(!phoneRule.test(this.replaceDealphone)){
          this.$message({
            message: this.$t('localization.mobile-format'),
            type: 'error'
          });
        }else{
          if(this.passPhoneFlag1){
            this.passPhoneFlag1 = false
            var url = this.$urlPrefix+'/sendSms'
            var data={
              _ajax:1,
              mobile:this.replaceDealphone
            }
            this.$http.post(url,data).then(function(response){
                var that = this
                if(response.body.code==1){
                  this.$message({
                    message: this.$t('localization.send-code'),
                    type: 'success'
                  });
                  dealTimer = setInterval(function(){
                     if(that.dealPhoneTime<=1){
                        that.dealPhoneTip =that.$t('localization.Regain');
                        window.clearInterval(dealTimer)
                        that.dealPhoneTime = 60
                        that.passPhoneFlag1 = true
                     }else{
                        that.dealPhoneTime = that.dealPhoneTime-1;
                        that.dealPhoneTip = that.dealPhoneTime +" "+that.$t('localization.Seconds-after-retry');
                     }
                  },1000)
                }else{
                  this.$message({
                    message: response.body.msg,
                    type: 'error'
                  });
                }
            })
          }
        }
     },
     /*
       修改交易密码-验证手机-提交
     */
     replaceDealPassOne(){
        if(this.phoneCodeRule(this.replaceDealphone,this.replaceDealCode)){
            var url = this.$urlPrefix+'/Vmobile'
            var token = localStorage.getItem('token')
            var data={
              _ajax:1,
              toKey:token,
              mobile:this.replaceDealphone,
              code:this.replaceDealCode
            }
            this.$http.post(url,data).then(function(response){
               if(response.body.code==1){
                  this.replaceDealProgress = 2
                  this.replaceDealphone = ''
                  this.replaceDealCode = ''
                  window.clearInterval(dealTimer)
               }else{
                  callback.callback(this,response.body)
               }
            })
        }
     },
     /*
       修改交易密码-新交易密码-提交
     */
     replaceDealPassTwo(){
        if(this.passRule(this.newDealPass)){
            var url = this.$urlPrefix+'/payPwd'
            var token = localStorage.getItem('token')
            var data={
              _ajax:1,
              toKey:token,
              password:this.newDealPass
            }
            this.$http.post(url,data).then(function(response){
               if(response.body.code==1){
                  this.newDealPass=''
                  this.replaceDealProgress = 3
                  this.init()
               }else{
                  this.$message({
                    message: response.body.msg,
                    type: 'error'
                  });
               }
            })
        }
     },
     /*
       设置交易密码-提交
     */
     confirmChangeDeal(){
        if(this.passRule(this.dealPass)){
            var url = this.$urlPrefix+'/payPwd'
            var token = localStorage.getItem('token')
            var data={
              _ajax:1,
              toKey:token,
              password:this.dealPass
            }
            this.$http.post(url,data).then(function(response){
               if(response.body.code==1){
                  this.dealPass=''
                  this.dealProgress = 2
                  this.init()
               }else{
                  this.$message({
                    message: response.body.msg,
                    type: 'error'
                  });
               }
            })
        }
     },
     /*
       手机号验证规则
     */
     phoneCodeRule(phone,code){
        if(phone.trim()==''){
           this.$message({
            message: this.$t('localization.phone-number-tips'),
            type: 'error'
           });
           return;
        }
        if(!phoneRule.test(phone)){
          this.$message({
            message: this.$t('localization.mobile-format'),
            type: 'error'
          });
          return;
        }
        if(code.trim()==''){
          this.$message({
            message: this.$t('localization.Verification-empty'),
            type: 'error'
          });
          return;
        }
        return true;
     },
     /*
       交易密码验证规则
     */
     passRule(pass){
        if(pass.trim()==''){
           this.$message({
            message: this.$t('localization.New-password-tip'),
            type: 'error'
           });
           return false;
        }
        if(!length.test(pass)){
           this.$message({
            message: this.$t('localization.password-6'),
            type: 'error'
           });
           return false;
        }
        if(continuityNum.test(pass)){
           this.$message({
            message: this.$t('localization.password-6-bit'),
            type: 'error'
           });
           return false;
        }
        return true;
     },
     /*
       收款方式切换
     */
     selectPay(tab){
       localStorage.setItem('payment',tab.name)
     },
     wxCut(val){
        this.switchChange(this.weixin.id,1,val)
     },
     aliCut(val){
        this.switchChange(this.zhifubao.id,2,val)
     },
     cardCut(val){
        this.switchChange(this.editUnion.id,3,val)
     },
     //收款方式切换开关
     switchChange(id,type,isCheck){
       var token = localStorage.getItem('token')
       var url = this.$urlPrefix+'/apiPaySwitch'
       var data={
         _ajax : 1,
         toKey:token,
         id:id,
         status:isCheck?1:0
       }
       this.$http.post(url,data).then(function(response){
          if(response.body.code==0){
             this.$message({
               message: response.body.msg,
               type: 'error'
             });
             switch(type){
               case 1:
                   this.wxSwitch = !isCheck;
                   break;
               case 2:
                   this.aliSwitch = !isCheck;
                   break;
               default:
                   this.cardSwitch = !isCheck;
                   break;
             }
          }
       })
     },
     /*
       微信收款信息提交
     */
     weixinSubmit(){
        if(this.wx.nickname.trim()==''){
          this.$message({
           message: this.$t('localization.nickname-empty'),
           type: 'error'
          });
        }else if(this.wx.wx_account.trim()==''){
          this.$message({
           message: this.$t('localization.wx-number-tip'),
           type: 'error'
          });
        }else if(this.wx.url==''){
          this.$message({
           message: this.$t('localization.Please')+this.$t('localization.Upload-receipt-code'),
           type: 'error'
          });
        }else{
          var token = localStorage.getItem('token')
          var data={
            _ajax:1,
            type:this.paymentStyle,
            toKey:token,
            content:JSON.stringify(this.wx)
          }
          if(this.baseInfo.collect != 0 ){
             var url = this.$urlPrefix+'/paySetUpEdit'
             this.$http.post(url,data).then(function(response){
               if(response.body.code==1){
                  this.$message({
                   message: response.body.msg,
                   type: 'success'
                  });
                  this.paymentModal = false
                  this.init()
               }
            })
          }else{
            var url = this.$urlPrefix+'/paySetUp'
            this.$http.post(url,data).then(function(response){
               if(response.body.code==1){
                  this.$message({
                   message: response.body.msg,
                   type: 'success'
                  });
                  this.paymentModal = false
                  this.init()
               }
            })
          }
        }
     },
     editWeixinSubmit(){
        this.editWeixinUrl =''
     },
     /*
       支付宝收款信息提交
     */
     alipaySubmit(){
         if(this.alipay.name.trim() == ''){
            this.$message({
             message: this.$t('localization.payee-name'),
             type: 'error'
            });
         }else if(this.alipay.api_account.trim() ==''){
            this.$message({
             message: this.$t('localization.Alipay-account'),
             type: 'error'
            });
         }else if(this.alipay.url == ''){
            this.$message({
             message: this.$t('localization.Please')+this.$t('localization.Upload-receipt-code'),
             type: 'error'
            });
         }else{
            //请求接口
            var token = localStorage.getItem('token')
            
            var data={
              _ajax:1,
              type:this.paymentStyle,
              toKey:token,
              content:JSON.stringify(this.alipay)
            }
            if(this.baseInfo.collect != 0){
               var url = this.$urlPrefix+'/paySetUpEdit'
               this.$http.post(url,data).then(function(response){
                 if(response.body.code==1){
                    this.$message({
                     message: response.body.msg,
                     type: 'success'
                    });
                    this.paymentModal = false
                    this.init()
                 }
              })
            }else{
               var url = this.$urlPrefix+'/paySetUp'
               this.$http.post(url,data).then(function(response){
                 if(response.body.code==1){
                    this.$message({
                     message: response.body.msg,
                     type: 'success'
                    });
                    this.paymentModal = false
                    this.init()
                 }
              })
            }
            
          }
     },
     editAlipaySubmit(){
        this.zhifubao = ''
     },
     /*
       银行卡收款信息提交
     */
     unionPaySubmit(){
        var cardRule = /^([1-9]{1})(\d{14}|\d{18})$/;
        if(this.unionPay.name.trim() ==''){
           this.$message({
             message: this.$t('localization.Name-empty'),
             type: 'error'
           });
           return false;
        }else if(this.unionPay.code.trim() ==''){
           this.$message({
             message: this.$t('localization.Card-empty'),
             type: 'error'
           });
           return false;
        }else if(this.unionPay.bank.trim()==''){
          this.$message({
           message: this.$t('localization.bank-empty'),
           type: 'error'
          });
          return false;
        }else if(this.unionPay.open_bank.trim() ==''){
           this.$message({
             message: this.$t('localization.open-bank'),
             type: 'error'
           });
           return false;
        }
        // else if(!cardRule.test(this.unionPay.code)){
        //    this.$message({
        //      message: '卡号输入有误',
        //      type: 'error'
        //    });
        //    return false;
        // }
        //请求接口
        var token = localStorage.getItem('token')
        var url = this.$urlPrefix+'/paySetUp'
        var data={
          _ajax:1,
          type:this.paymentStyle,
          toKey:token,
          content:JSON.stringify(this.unionPay)
        }
        if(this.baseInfo.collect != 0 ){
           var url = this.$urlPrefix+'/paySetUpEdit'
           this.$http.post(url,data).then(function(response){
             if(response.body.code==1){
                this.$message({
                 message: response.body.msg,
                 type: 'success'
                });
                this.paymentModal = false
                this.init()
             }
          })
        }else{
          var url = this.$urlPrefix+'/paySetUp'
          this.$http.post(url,data).then(function(response){
             if(response.body.code==1){
                this.$message({
                 message: response.body.msg,
                 type: 'success'
                });
                this.paymentModal = false
                this.init()
             }
          })
        }
     },
     editUnionSubmit(){
       this.editUnion = ''
     },
     /*
       微信上传二维码
     */
     weiCodeSuccess(res, file) {
       this.weixinUrl = URL.createObjectURL(file.raw);
       this.wx.url = res
       this.$message({
         message: this.$t('localization.Upload-success'),
         type: 'success'
       });
     },
     /*
       支付宝上传二维码
     */
     alipaySuccess(res, file){
       this.alipayUrl = URL.createObjectURL(file.raw);
       this.alipay.url = res
       this.$message({
         message: this.$t('localization.Upload-success'),
         type: 'success'
       });
     },
     /*
       图片上传验证
     */
     beforeImgUpload(file) {
       const isLt2M = file.size / 1024 / 1024 < 2;
       if (!isLt2M) {
         this.$message.error(this.$t('localization.uploaded-tips')+'2MB!');
       }
       return isLt2M;
     }
  },
  watch:{
    'unionPay.bank':function (val) {
      console.log(val)
    },
    phoneModal(val){
      if(!val){
        this.sendEmailTip = this.$t('localization.Get-the-code')
        this.phoneCodeTip =this.$t('localization.Get-the-code')
        if(emailTimer){
          window.clearInterval(emailTimer)
        }
        if(phoneTimer){
          window.clearInterval(phoneTimer)
        }
      }
    },
    passModal(val){
      if(!val){
        if(loginTimer){
          window.clearInterval(loginTimer)
        }
        this.phoneTip = this.$t('localization.Get-the-code')
      }
    },
    paymentModal(val){
      this.getInitStatus()
      if(!val){
        this.init()
      }
    },
    replaceDealModal(val){
      if(!val){
        if(dealTimer){
          window.clearInterval(dealTimer)
        }
        this.dealPhoneTip = this.$t('localization.Get-the-code')
      }
    },
    dealPassModal(val){
      this.dealPass = ''
    }
  },
  destroyed(){
    if(loginTimer){
      window.clearInterval(loginTimer)
    }
    if(dealTimer){
      window.clearInterval(dealTimer)
    }
    if(emailTimer){
      window.clearInterval(emailTimer)
    }
    if(phoneTimer){
      window.clearInterval(phoneTimer)
    }
  }
}
</script>