<template>
  <div>
    <div @click="lockScreen">
      <h-icon name="lock"></h-icon>
      <!-- <span>锁屏</span>
      <span class='fenge'>|</span> -->
    </div>
    
    <h-msg-box v-model = "isShow"
            title = "请输入解锁密码" 
            :closable = "closable"
            transfer
            :mask-closable="false"
            width=300
            @keyup.enter.native="lockValid"
            ref = "msgbox">
      <h-input placeholder="请输入密码" v-model="password" type="password"></h-input>
      <div slot="footer">
          <h-button type="error" @click="lockValid">确定</h-button>
      </div>
    </h-msg-box>
  </div>
</template>
<script>
  import {post} from "@/api/bizApi/commonUtil";
  import {reLogin} from '@/api/login'
  import {mapGetters, mapState} from 'vuex'
  import Cookies from 'js-cookie'
  export default {
    name: 'LockScreen',
    data () {
      return {
        password: '',
        disabled: true,
        errorTip: '',
        closable: false,
        isShow: false,
        timer: null
      }
    },
    props: {
      lockTime: {
        type: Number,
        default: 1
      }
    },
    computed : {
      ...mapGetters([
        'lock'
      ]),
      ...mapState({
        lock: function (state) {
          let sLockscreen = Cookies.get('lock')
          if (state.app.lock == '' && sLockscreen == 'true') {
            this.$store.dispatch('lockscreen')
          }
          return state.app.lock
        }
      }),
      lockTimes () {
        return this.lockTime * 60 * 1000
      }
    },
    methods: {
      lockTimer () {
        // if (this.timer != 'null') {
          clearTimeout(this.timer)
        // }
        let that = this
        if (!this.isShow) {
        this.timer = setTimeout(function() {
          that.lockScreen()
        } , that.lockTimes)
        }
      },
      lockScreen () {
        this.$store.dispatch('lockscreen')
        this.isShow = true
        post({},'/lock.json').then(res => {});
      },
      setTip (tip) { // 消息提示，1.5秒后自动关闭
        this.errorTip = tip
        // this.disabled = false
        // setTimeout(() => {
        //   this.disabled = true
        //   this.errorTip = ''
        // }, 1500)
        this.$hMessage.info(tip)
      },
      lockValid () {
        if (!this.password) {
          this.setTip('密码不能为空')
        } else {
          if (this.$store.getters.token) {
            let username = window.sessionStorage.getItem('userName')
            if (username) {
              reLogin(username, this.password).then(res => {
                if (res.data && res.data[this.LOCAL_CONFIG.SUCCESS_KEY] == '0') {
                  this.isShow = false
                  this.password = ''
                  this.$hMessage.info('重新登录成功')
                  this.$store.dispatch('unlockscreen')
                  Cookies.set('Admin-Token', res.data.sessionId)
                } else {
                  this.$hMessage.info('密码校验失败，请重新输入')
                  this.password = ''
                }
              }).catch(error => {
                this.$hMessage.info('当前系统登录出错,请重新登录')
                this.$store.dispatch('ReLogin')
              })
            } else {
              this.$hMessage.error('当前未登录，系统出错！')
              this.$store.dispatch('ReLogin')
            }
          }
        }
      }
    },
    created() {
      if(this.lock) {
        this.isShow = true
      }
    },
    mounted () {
      document.addEventListener('mousemove', this.lockTimer)
      document.addEventListener('mousedown', this.lockTimer)
    },
    beforeDestory() {
      document.removeEventListener('mousemove', this.lockTimer)
      document.removeEventListener('mousedown', this.lockTimer)
    }
  }
</script>