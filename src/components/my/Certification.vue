<template>
    <div class="certify_container" v-loading.fullscreen.lock="fullscreenLoading">
        <el-form :model="certifyForm" status-icon :rules="rules" ref="certifyForm" label-width="110px" class="demo-ruleForm" enctype='multipart/form-data'>
            <div class="item">
                <h1>{{ $t("localization.Real-name") }} <router-link to="/my/personal"><i class="el-icon-back"></i>  {{$t('localization.Return-my-center')}}</router-link></h1>
                <p><span style="color:#e35555;font-size:18px;">*</span> {{$t('localization.Australian-stock')}}</p>
            </div>
            <div class="item baseInfo">
                <h1>{{ $t("localization.Basic-info") }} <span>*</span></h1> 
                <el-form-item :label="$t('localization.Current-mobile')" prop="mobile" style="width:600px;">
                  {{certifyForm.mobile}}
                </el-form-item>
                <el-form-item :label="$t('localization.realname')" prop="name" style="width:620px;">
                  <el-input type="text" v-model="certifyForm.name" :placeholder="$t('localization.name')"  autocomplete="off"></el-input>
                  <p style="color:#e35555;">* {{ $t('localization.realname-tip') }}</p>
                </el-form-item>
                <el-form-item :label="$t('localization.ID')" prop="idCard" style="width:620px;">
                  <el-input type="text" v-model="certifyForm.idCard" :placeholder="$t('localization.ID-tip')"  autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item class="certifySubmit">
                  <el-button type="primary" @click="certifySubmit('certifyForm')">{{ $t("localization.Submission") }}</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
import callback from "../../utile/callback.js"
export default {
  data() {
    var nameRule = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
    var certifyRule = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
    var validateName = (rule, value, callback) => {
      if (value.trim()=='') {
        return callback(new Error(this.$t("localization.Name-empty")));
      }else if(!nameRule.test(value)){
        return callback(new Error(this.$t("localization.name-false")));
      }else {
        callback();
      }
    };
    var checkId = (rule, value, callback) => {
      if (value.trim()=='') {
        return callback(new Error(this.$t("localization.Certif-empty")));
      }else if(!certifyRule.test(value)){
        return callback(new Error(this.$t("localization.ID-format")));
      }else {
        callback();
      }
    }; 
    return {
        certifyForm:{
            mobile:'',
            name:'',
            idCard:''
        },
        fullscreenLoading:false,
        rules: {
          name: [
            { validator: validateName, trigger: 'blur' }
          ],
          idCard:[
            { validator: checkId, trigger: 'blur' }
          ]
        }
    }
  },
  created(){
     this.certifyForm.mobile = localStorage.getItem('userPhone')
  },
  methods: {
    certifySubmit(formName) {
       this.$refs[formName].validate((valid) => {
         if (valid) {
            this.fullscreenLoading = true
            var url = this.$urlPrefix+'/apiAuthentica'
            this.certifyForm._ajax=1
            this.certifyForm.toKey=localStorage.getItem('token')
            this.$http.post(url,this.certifyForm).then(function(response){
                var _this = this
                var result = response.body
                this.fullscreenLoading = false;
                if(result.code==1){
                   this.$message({
                      message: result.msg,
                      type: 'success',
                      duration: 500,
                      onClose:function(){
                         _this.$router.go(-1)
                      }
                   });
                }else{
                  callback.callback(this,result)
                }
             })
         }
       });
     }
  }
}
</script>

<style lang="less">
    .certify_container{
        width: 1200px;
        margin:20px auto;
        overflow: hidden;
        .certifySubmit{
            margin-top: 50px;
            margin-bottom: 0;
            .el-form-item__content{
               .el-button--primary{
                  width: 300px;
                  color: #fff;
                  border:0;
                  height: 40px;
                  border-radius: 48px;
                  font-size: 22px;
                  background-size: 110%;
                  background-image: linear-gradient(270deg,#ffe170,#ffb900);
                }
            }
        }
        .item{
          padding:30px;
          background-color: #fff;
          text-align: left;
          box-shadow: 0 0 20px 0 #ececec;
          overflow: hidden;
          margin-bottom: 10px;
          h1{
             font-size:20px;
             padding-bottom: 20px;
             span{
                color:#e35555;
                font-size:22px;
             }
             a{
                color:#52cbca;
                font-size:14px;
                float:right;
                &:hover{
                    text-decoration: underline;
                }
             }
          }
          p{
            font-size:14px;
            color:#6f6f6f;
          }
          .upload{
             padding:0 30px;
             .tip{
                margin-top: 10px;
                font-size:14px;
                color:rgb(227, 85, 85);
             }
             .uploadBox{
                width: 100%;
                padding:20px 0;
                overflow: hidden;
                .avatar-uploader{
                   width: 240px;
                   height: 160px;
                   font-size:14px;
                   text-align: center;
                   line-height: 160px;
                   float:left;
                   border:1px solid #ccc;
                   margin-right: 10px;
                   border-radius: 4px;
                   .el-upload{
                     width: 100%;
                     height: 100%;
                     img{
                       width: 100%;
                       height: 100%;
                     }
                   }
                }
                .selectFile{
                    width: 300px;
                    height: 180px;
                    border:1px solid #ccc;
                }
             }
          }
        }
        .baseInfo{
            height:650px;
            >.el-form-item {
               padding-left:30px;
               margin-bottom: 40px;
               .el-button{
                  margin-top: 30px;
                  border-radius: 5px;
                  font-size:20px;
               }
            }
            h1{
               border-bottom: 2px solid #eee;
               margin-bottom: 50px;
            }
        }
    }
</style>