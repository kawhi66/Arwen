<template>
  <div>      
    <div class="h-sidebar-head">
      <div class="h-sidebar-head-logo" >   
        <span class="h-sidebar-head-logo-img"></span>
        <span class="h-sidebar-head-logo-span" v-show="isSidebarExpand">{{sysName}}</span>
      </div>
    </div>
    <div class="h-sidebar-menu">   
      <h-menu mode='vertical' 
              theme='dark' 
              accordion
              :collapse="!sidebar.opened"
              width='220px'>
          <sidebar-item :routes="permission_routers"></sidebar-item>  
      </h-menu>
    </div>
  </div>
</template>
<script>
  /* mapGetters工具函数会将store中的getter映射到局部计算属性中 */
  /* 使用对象扩展操作符把getter混入到computed中 */
  import { mapGetters } from 'vuex'
  import SidebarItem from './SidebarItem'
  export default {
    data () {
      return {
        isAccordion: true,
        childRoute: [],
        search: '',
        searchText: '请输入关键词',
        notFoundText: '没有匹配页面',
        menusType: window.sessionStorage.getItem('menusType'),
        sysName: this.LOCAL_CONFIG.SYS_NAME,
      }
    },
    components: {
      SidebarItem
    },
    computed: {
      ...mapGetters([
        'activeIndex',
        'permission_routers',
        'searchRoute',
        'sidebar'
      ]),
      isSidebarExpand () {
        return this.sidebar.opened
      }
    },
    watch: {
      activeIndex () {
        this.computChildRoute()
      }
    },
    methods: {
      handleSearch (path) {
        this.search = ''
        this.$refs.select.setQuery('')
        this.$nextTick(() => {
          setTimeout(() => {
            this.$router.push(path)
          }, 300)
        })
      },
      expandSiderbar () {
        this.$store.dispatch('ToggleSidebar')
      }
    },
    created () {
      // 兼容IE中路由无法跳转问题
      let that = this
      if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) { 
        // detect it's IE11
        window.addEventListener("hashchange", function(event) {
          var currentPath = window.location.hash.slice(1);
          if (that.$route.path !== currentPath) {
            that.$router.push(currentPath)
          }
        }, false)
      }
    }
  }
</script>