<template>
  <section class="app-main">
    <!-- <transition name="fade" mode="out-in"> -->
      <router-view :key="key"></router-view>
    <!-- </transition> -->
  </section>
</template>
<script>
  export default {
    name: 'AppMin',
    computed: {
      key () {
        return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
      }
    }
  }
</script>