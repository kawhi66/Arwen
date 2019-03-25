<template>
  <div class="h-navbar-wrapper">
    <!-- 已打开标签 -->
    <!-- <tabs-view></tabs-view>  -->
    <!-- 面包屑 -->
    <Levelbar></Levelbar>
  </div>
</template>
<script>
  import Levelbar from './Levelbar'
  import TabsView from './TabsView'
  export default {
    components: {
      TabsView,
      Levelbar
    }
  }
</script>