<template>
  <h-breadcrumb class= "app-levelbar" separator="/">
    <h-breadcrumb-item v-for="(item, index) in levelList" :key="item.name">
      <router-link v-if="item.redirect === 'noredirect' || index == levelList.length-1" to="" class="no-reidrect">{{item.name}}</router-link>
      <router-link v-else :to="item.path">{{item.name}}</router-link>
    </h-breadcrumb-item>
  </h-breadcrumb>
</template>
<script>
  export default {
    data () {
      return {
        levelList: null
      }
    },
    watch: {
      $route () {
        this.getBreadCrumb()
      }
    },
    methods: {
      getBreadCrumb () {
        // let curMatched = [{name: this.$route.name, path: this.$route.path}]
        // if (this.$route.meta.parent && this.$route.meta.parent.length > 0) {
        //   let parentArr = this.$route.meta.parent
        //   this.levelList = parentArr.concat(curMatched)
        // } else {
        //   this.levelList = curMatched
        // }
        let matched = this.$route.matched.filter(item => item.name);
        const first = matched[0];
        if (first && (first.name !== '首页' || first.path !== '')) {
          matched = [{ name: '首页', path: '/' }].concat(matched)
        }
        this.levelList = matched;
      }
    },
    created () {
      this.getBreadCrumb()
    }
  }
</script>
