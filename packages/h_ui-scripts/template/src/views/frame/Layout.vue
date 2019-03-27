<template>
	<div class="app-wrapper">
    <!-- 页面顶部 -->
    <!-- <div class="h-topbar-wrapper">
      <topbar></topbar>
    </div> -->
    <div class="main-wrapper" :class="{hideSidebar : !sidebar.opened, fullScreen: fullScreen}">
      <!-- 侧边栏 -->
      <sidebar class="h-sidebar-wrapper" v-show="!fullScreen"></sidebar>  
      <!-- 中间区域 -->
      <div class="main-container">
        <!-- 顶部 -->
        <div class="h-topbar-wrapper" v-show="!fullScreen">
          <topbar></topbar>
        </div>
        <!-- 面包屑导航栏 -->
        <navbar v-show="!fullScreen"></navbar>
        <!-- 内容 -->
        <app-main></app-main>
		  </div>
    </div>
	</div>
</template>
<script>
  import { Navbar, Sidebar, AppMain, Topbar } from './index'
  import { mapGetters } from 'vuex'
  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
      Topbar
    },
    computed: {
      sidebar () {
        return this.$store.state.app.sidebar
      },
      ...mapGetters([
        'activeIndex',
        'fullScreen'
      ])
    }
  }
</script>