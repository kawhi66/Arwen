<template>
  <div class="h-topbar">
    <div class="h-topbar-expandIcon" @click.prevent.stop="expandSiderbar">
        <!-- 展开 -->
        <!-- <h-icon name="navicon"></h-icon> -->
        <span class="h-topbar-expandIcon-img"></span>
      </div>
    <div class="h-topbar-tool" ref="topbarTool">
      <h-menu theme="dark" mode="horizontal" >
        <h-menu-item name='1' @click.native.prevent.stop="handleShowInput">
          <!-- <a style="display: inline-block" > -->
            <h-icon name="search"></h-icon>
          <!-- </a> -->
        </h-menu-item> 
        <div class="h-topbar-search h-menu-item" ref="topbarSearch" v-show="showInput">
          <h-select v-model="appname" :isString="true" @on-change="change" @on-scroll="scroll" :isComputed="isComputed" noMoreText="暂无数据" placeholder="站内搜索" filterable algin="left">
            <h-option v-for="item in appList" :value="item.value" :key="item.value">{{ item.label }}</h-option>
          </h-select>
        </div> 
        <h-menu-item name='2' style="z-index: 10">
          <lock-screen :lockTime='locktime'></lock-screen>
        </h-menu-item>
        <h-menu-item name='3'>
          <a href="http://118.31.148.129:8080/hui/" target="_blank">
            <h-icon name="feedback" color="rgba(0, 0, 0, 0.65)"></h-icon>
          </a>
        </h-menu-item>
        <!-- <h-submenu name='3'>
          <template slot='title'>
            <h-icon name="setup"></h-icon>
          </template>
          <h-menu-item name='3-1' disabled>
            <h-icon name="setup"></h-icon>
            <span>系统设置</span>
          </h-menu-item>
          <h-menu-item name='3-2' disabled>
            <h-icon name="editor"></h-icon>
            <span>编辑资料</span>
          </h-menu-item> 
        </h-submenu> -->
        <!-- <h-submenu name='4' class="theme">
          <template slot='title'>
            <h-icon name="tshirt-outline"></h-icon>
          </template>
          <h-menu-item name='4-1' @click.native="handleChangeTheme('theme-black')" title="黑色主题">
            <h-icon name="tshirt " color="#2B3643"></h-icon>
          </h-menu-item>
          <h-menu-item name='4-2' @click.native="handleChangeTheme('theme-default')" title="黑蓝主题">
            <h-icon name="tshirt" color="#374250"></h-icon>
          </h-menu-item> 
          <h-menu-item name='4-3' @click.native="handleChangeTheme('blue')" title="蓝色主题">
            <h-icon name="tshirt" color="blue"></h-icon>
          </h-menu-item>
        </h-submenu> -->
        <h-submenu name='5' class="toolLast" style="margin-right: 15px;">
          <template slot='title'>
            <h-icon name="mine" color="blue"></h-icon>
            <span>Admin</span>
          </template>
          <!-- <h-menu-item name='5-1' disabled>
            <h-icon name="mine"></h-icon>
            <span>个人中心</span>
          </h-menu-item> -->
          <h-menu-item name='5-2' @click.native="handleResetPass">
            <h-icon name="editor"></h-icon>
            <span>修改密码</span>
          </h-menu-item>
          <h-menu-item name='5-3' @click.native="logout">
            <h-icon name="delete"></h-icon>
            <span>退出登录</span>
          </h-menu-item>
        </h-submenu>
      </h-menu>
    </div>

    <h-msg-box v-model="setPassword"
              title="重置密码"
              :mask-closable="false"
              style="text-align:left">
      <h-form ref="setPassForm" :model="setPassForm"  :label-width="80">
        <h-form-item prop="oldPassword" label="当前密码" required>
          <h-input type="password" v-model="setPassForm.oldPassword" placeholder="请输入当前密码"></h-input>
        </h-form-item>
        <h-form-item prop="newPassword" label="新密码" required>
          <h-input type="password" v-model="setPassForm.newPassword" placeholder="请输入新密码"></h-input>
        </h-form-item> 
        <h-form-item prop="newPasswordCheck" label="新密码确认" required :rules="validNewPassCheck">
          <h-input type="password" v-model="setPassForm.newPasswordCheck" placeholder="请再次输入新密码"></h-input>
        </h-form-item>
      </h-form>
      <div slot="footer">
        <h-button @click="setPassword = false">取消</h-button>
        <h-button type="primary" @click="handleSetPassword">确认</h-button>
      </div>
    </h-msg-box>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import LockScreen from '@/components/LockScreen'
  import { changePwd,initMsg } from '@/api/login'
  import { allToggleClass } from '@/utils'
  export default {
    data () {
      // 新密码框校验

      // 确认密码框校验
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入您的新密码'));
        } else if (value !== this.setPassForm.newPassword) {
            callback(new Error('两次密码输入不一致'));
        } else {
            callback();
        }
      }
      return {
        showInput: false,
        setPassForm: {
          oldPassword: '',
          newPassword: '',
          newPasswordCheck: ''
        },
        validNewPassCheck: {
          validator: validatePassCheck, trigger: 'blur'
        },
        setPassword: false,
        submitLoading: true,
        locktime: this.LOCAL_CONFIG.LOCK_TIME,
        theme: this.LOCAL_CONFIG.THEME,
        sysName: this.LOCAL_CONFIG.SYS_NAME,
        appname: '',
        canPage:true,
        isComputed:false,
        appList: [{
          value: 'tip1',
          label: '搜索提示1'
        },
        {
          value: 'tip2',
          label: '搜索提示2'
        },
        {
          value: 'tip3',
          label: '搜索提示3'
        }],
        allAppList: [],
        navWidth: 0,
        showMore: false,
        hideNavList: []
      }
    },
    components: {
      LockScreen
    },
    computed: {
      ...mapGetters([
        'permission_routers',
        'menusRoot',
        'activeIndex'
      ]),
      hideNavListLength () {
        return this.hideNavList.length
      }
    },
    watch: {
      theme () {
        allToggleClass(document.getElementsByTagName('html')[0], this.theme)
      },
      setPassword (val) {
        if (!val) {
          this.$refs.setPassForm.resetFields()
        }
      },
      hideNavListLength (val) {
        if (val > 0) {
          this.showMore = true
        } else {
          this.showMore = false
        }
      }
    },
    methods: {
      handleShowInput () {
        console.log('asd')
        this.showInput = !this.showInput
      },
      stopEvent ($event) {
        console.log('sfd')
        $event.stopEvent()
        $event.preventDefault();
      },
      expandSiderbar () {
        this.$store.dispatch('ToggleSidebar')
      },
      // 换肤
      handleChangeTheme (color) {
        this.theme = color
      },
      handleResetPass () {
        this.handleResetForm('setPassForm')
        this.setPassword = true
      },
      handleResetForm (name) {
        this.$refs[name].resetFields();
      },
      handleSetPassword () {    
        this.$refs['setPassForm'].validate((valid) => {
          if (valid) {
            changePwd( this.setPassForm.oldPassword, this.setPassForm.newPassword).then(res => {
              // 服务端基础服务出错，实际已修改成功
              if (res.data && res.data[this.LOCAL_CONFIG.SUCCESS_KEY] == '0' || res.data && res.data[this.LOCAL_CONFIG.SUCCESS_KEY] == '-1' && res.data.return_info == '获取基础业务框架服务失败') {
                this.setPassword = false
                this.$hMessage.success('重置密码成功!');
              } else {
                this.$hMessage.success('重置密码失败[' + res.data.return_info + ']');
              }
            }).catch(error => {
              this.$hMessage.info("网络通信失败,服务器异常")
            })
          } else{
            this.$hMessage.error('请正确填写密码!')
          }
        })
      },
      logout () {
        this.$store.dispatch('Logout').then(() => {
          location.reload()
        })
      },
      activeSidebar (index) {
        if (index >= 0) {
          this.$store.dispatch('ActiveRootIndex', index)
        }
        // let item = this.menusRoot[this.activeIndex]
        // 防止页面刷新时会跳转根页面
        // if(this.$route.matched[0].path !== item.url) {
        //   this.$router.push({path: item.url})
        // }
      },
      change (val) {
        console.log(val)
      },
      scroll(num){
        let _this = this;
        if (num<=1 && _this.canPage) {
          _this.canPage = false;
          let length = _this.appList.length;
          setTimeout(() => {
            let arr = _this.allAppList.slice(length,length+10);
            if (arr.length>0) {
              _this.appList=_this.appList.concat(arr);
              _this.canPage = true;
            }else{
              this.isComputed = true
            }
          }, 200);
        }
      },
      computedNavWidth () {
        this.hideNavList = []
        if (this.$refs.topbarNav) {
          let logoWidth = this.$refs.topbarLogo ? this.$refs.topbarLogo.clientWidth : 0
          let toolWidth = this.$refs.topbarTool ? this.$refs.topbarTool.clientWidth : 0
          let searchWidth = this.$refs.topbarSearch ? this.$refs.topbarSearch.clientWidth : 0
          this.navWidth = document.getElementsByClassName('h-topbar')[0].clientWidth - logoWidth - toolWidth - searchWidth - 20
          let that = this
          this.$nextTick(function (){
            // 对nav menu子元素从后往前遍历，将超出部分保存至hideNavList
            // menu总长度 that.$refs.topbarNav.children[0].children.length === that.menusRoot.length
            let menuRootWidth = document.getElementsByClassName('h-topbar-navMenu')[0].clientWidth
            // menu子元素
            let menuChildren =  document.getElementsByClassName('h-topbar-navMenu')[0].children
            if (menuChildren && menuChildren.length > 0 && that.navWidth < menuRootWidth) {
              for (let i = menuChildren.length -1; i >= 0; i--) {
                if (that.navWidth < menuRootWidth) {
                  that.hideNavList.splice(0, 0, that.menusRoot[i])
                } else {
                  break
                }
                menuRootWidth = menuRootWidth - menuChildren[i].clientWidth
              }
            }
          })
        }
      }
    },
    created () {
      // 输入其他根目录下的路径时，切换sidebar
      if (this.menusRoot && this.menusRoot.length >0) { 
        if (this.$route.path.indexOf(this.menusRoot[this.activeIndex].url) < 0) {
          let urlArr = this.$route.path.split('/')
          let curUrl ='/' + urlArr[1]
          for (let [key, value] of this.menusRoot.entries()) {
            if (curUrl === value.url) {
              this.activeSidebar(key)
              return
            }
          }
        } else {
          // 更新对应的sidebar
          this.activeSidebar(this.activeIndex)
        }
      }
      //获取内部消息
      //initMsg();
      //setInterval(initMsg, 1000 * 60 * 5);// 5分钟轮询一次获取内部消息
    },
    mounted () {
      document.getElementsByTagName('html')[0].className = this.theme;
      this.computedNavWidth()
      document.addEventListener('resize', this.computedNavWidth())
    }
  }
</script>