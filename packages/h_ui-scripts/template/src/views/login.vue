<template>
  <div class="login-container">
    <div class="login-img">
      <img src="../assets/login.png"> 
      <h2>成就所托，持之以恒!</h2>
      <h3>洞悉需求，应势而生；风雨同舟，一路同行</h3>
    </div>
    <div class="login-box">
      <div class="login-header">
        <h3>{{sysName}}</h3>
      </div>
      <div class="login-content">
        <h-form autoComplete="on" :model="loginForm" ref="loginForm" label-position="left" class="card-box login-form">
          <h4>用户登录<h-icon name="mine" colcor="red"></h-icon></h4>
          <h-form-item prop="email"> 
            <h-input name="email" type="text"  v-model="loginForm.username" autocomplete="on" placeholder="邮箱/用户名" ref='username'>
               <h-icon name="mine" slot="prepend"></h-icon> 
            </h-input>
            <div class="verify-tip verify-bottom" v-show='userError'>
              <div class="verify-tip-arrow"></div>
              <div class="verify-tip-inner">{{userErrorInfo}}</div>
            </div>
          </h-form-item>
          <h-form-item prop="password">  
            <h-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autocomplete="on"
              placeholder="密码" ref='password'>
               <h-icon name="lock" slot="prepend"></h-icon> 
            </h-input>
            <div class="verify-tip verify-bottom"  v-show='passError'>
              <div class="verify-tip-arrow"></div>
              <div class="verify-tip-inner">{{passErrorInfo}}</div>
            </div>
          </h-form-item>
          <h-form-item prop="checkcode">
            <h-input name="checkcode" type="text"  @keyup.enter.native="handleLogin" v-model="loginForm.checkcode" autocomplete="on"
              placeholder="验证码" class="checkInput"></h-input>
            <div class="checkcode">
               <canvas  id="codeimg" style="width:110px;height: 40px;cursor: pointer;margin-top: 10px;" @click="refreshCode" title="点击这里刷新验证码"></canvas>
            </div>
            <div class="verify-tip verify-bottom"  v-show='codeError'>
              <div class="verify-tip-arrow"></div>
              <div class="verify-tip-inner">{{codeErrorInfo}}</div>
            </div>
          </h-form-item>
          <h-form-item style="margin-bottom: 0">
            <h-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
              登录
            </h-button>
          </h-form-item>
        </h-form>
      </div>
    </div>
    <div class="login-footer">@2017 恒生电子股份有限公司</div>
  </div>
</template>

<script>
import fetch from '../api/httpFetch.js'
import Cookies from 'js-cookie'

  export default {
    name: 'login',
    data () {
      const validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能小于6位'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: 'admin',
          password: '111111',
          checkcode: ''
        },
        randomCode:'',
        loginRules: {
          username: [
            {
              required: true,
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              validator: validatePass
            }
          ],
          checkcode: [
            {
              required: true,
              trigger: 'blur'
            }
          ]
        },
        loading: false,
        showDialog: false,
        userError: false,
        userErrorInfo: '',
        codeError:false,
        codeErrorInfo: '',
        passError: false,
        passErrorInfo: '',
        sysName: this.LOCAL_CONFIG.SYS_NAME
      }
    },
    watch: {
      loginForm: {
        handler: function () {
          this.userError = false
          this.passError = false
          this.loading = false
          this.codeError = false
        },
        deep: true
      }
    },
    methods: {
      handleLogin () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('Login', this.loginForm).then((res) => {
              // return_code: 0  登录成功
              this.loading = false
              if (res[this.LOCAL_CONFIG.SUCCESS_KEY]  == '0') {
                this.$router.push({ path: '/' })
              } else {
                if (res[this.LOCAL_CONFIG.SUCCESS_KEY]  == '-1' || res[this.LOCAL_CONFIG.SUCCESS_KEY] == '-3') {
                // return_code: -1 用户名为空/-3 用户名错误
                  // this.userErrorInfo = res.return_info;
                  this.userErrorInfo = '用户名输入不正确'
                  this.$refs.username.focus();
                  this.userError = true;
                } else if (res[this.LOCAL_CONFIG.SUCCESS_KEY] == '-2' || res[this.LOCAL_CONFIG.SUCCESS_KEY] == '-4') {
                // return_code: -2 密码为空/ -4 密码错误
                  // this.passErrorInfo = res.return_info;
                  this.userErrorInfo = '密码输入不正确'
                  this.$refs.password.focus();                 
                  this.passError = true;
                } else if (res[this.LOCAL_CONFIG.SUCCESS_KEY] == '-5' || res[this.LOCAL_CONFIG.SUCCESS_KEY] == '-6') {
                // return_code: -5 验证码为空/ -6 验证码错误
                  this.codeErrorInfo = res.return_info;        
                  this.codeError = true;
                } else {
                  this.$hMessage.error('网络通信失败,服务器异常，登录错误')
                }
               this.createCode();
              }
            }).catch(err => {
              // 请求出错
              this.$hMessage.error('登录错误');
              this.loading = false;
               this.createCode();
            })
          } else {
            return false
          }
        })
      },
      refreshCode () {
        this.createCode()
      },
      codeBlur () {
        var checkCodeToken = this.randomCode;
        if(this.loginForm.checkcode==""){
            this.codeErrorInfo = "验证码不能为空";     
            this.codeError = true;
        }
        if(this.loginForm.checkcode!=checkCodeToken){
            this.codeErrorInfo = "验证码不正确";     
            this.codeError = true;
        }
      },
      nameBlur () {
        if(this.loginForm.username==""){
          this.userErrorInfo = "用户名不能为空";     
          this.userError = true;
        }else{
          fetch.get('/getSecurityKey.json').then(response=>{
            if(response){
              var key1 = response.data.key1;
              var key2 = response.data.key2;
              var key3 = response.data.key3;
              var loginName = BizSecurity.DES.encrypt(this.loginForm.username, key1, key2, key3);
              fetch.post('/checkUserNameOrPwd.json',{flag:1,loginName:loginName}).then(res=>{
                if(res){
                  var data = res.data;
                  if(data[this.LOCAL_CONFIG.SUCCESS_KEY]!='0'){
                    this.userErrorInfo = data.return_info;     
                    this.userError = true;
                  }
                }
              })
            }
          })
        }
      },
      pwdBlur () {
        if(this.loginForm.password==""){
          this.passErrorInfo = "密码不能为空";     
          this.passError = true;
        }else{
          if(this.loginForm.username=="") return;
          fetch.get('/getSecurityKey.json').then(response=>{
            if(response){
              var key1 = response.data.key1;
              var key2 = response.data.key2;
              var key3 = response.data.key3;
              var loginName = BizSecurity.DES.encrypt(this.loginForm.username, key1, key2, key3);
              var password = BizSecurity.DES.encrypt(this.loginForm.password, key1, key2, key3);
              fetch.post('/checkUserNameOrPwd.json',{flag:2,loginName:loginName,password:password}).then(res=>{
                if(res){
                  var data = res.data;
                  if(data[this.LOCAL_CONFIG.SUCCESS_KEY]!='0'){
                    this.passErrorInfo = data.return_info;     
                    this.passError = true;
                  }
                }
              })
            }
          })
        }
      },
      /*随机干扰线条函数*/
      drawline(canvas, context) { 
        //若省略beginPath，则每点击一次验证码会累积干扰线的条数
        context.beginPath();
        //起点与终点在canvas宽高内随机
        context.moveTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height));  
        context.lineTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height));  
        context.lineWidth = 1;  
        context.strokeStyle = '#275DB3';        
        context.stroke();  
      },
    /*生成验证码*/
      createCode(){
        fetch.get('/getCheckCode').then(res=>{
          if(res && res.data){
            let data = res.data
            //每次生成code先将其清空防止叠加
            var canvas = document.getElementById("codeimg");
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.strokeStyle = "#FFF";
            context.strokeRect(0, 0, canvas.width, canvas.height); 
            var ranCode = data.code;
            if(ranCode=="") return;
            this.randomCode = ranCode;
            Cookies.set('checkCode-token', data.sessionId)
            //生成干扰线，数量随意
            for (var i = 0; i < 20; i++) {  
                this.drawline(canvas, context);  
            }  
            //循环生成4位验证码
            for (var k = 0; k < ranCode.length; k++) { 
              context.font='76px Arial';
              //将初始状态保存
              context.save();
              //获得-1到1的随机数
              var rA = 1-Math.random()*2;
              //获取随机倾斜角
              var angle = rA / 8 ;
              var ranNum = ranCode.charAt(k);
              //旋转生成的随机字符
              context.rotate(angle);
              //把rand()生成的随机数文本依次填充到canvas中，注意x坐标
              context.fillText(ranNum,20+45*k,100);
              //恢复初始状态，以便下一次循环
              context.restore();
            } 
          }
        })
      }
    },
    created () {
      document.getElementsByTagName('html')[0].className = 'theme-black'
      document.body.className = 'login'
    },
    mounted () {
      this.createCode()
    },
    destroyed () {
        document.body.className = ''
    }
  }
</script>