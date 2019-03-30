<template>
  <div>
    {{message}}
    <h-button type="primary" icon="search" @click="handle">test</h-button>
  </div>
</template>
<script>
  import { login} from '@/api/login'
  export default {
    data () {
      return {
        message: 'hello world'
      }
    },
    methods: {
      handle() {
        login('aa','aa','aa').then(res => {
          console.log(res.data)
          this.message = res.data.sessionId
        })
      }
    },
    created () {
      // login('aa','aa','aa').then(res => {
      //   console.log(res.data)
      //   this.message = res.data.sessionId
      // })
    }
  }
</script>