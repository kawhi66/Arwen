
<template>
    <div>
       <p style="font-size: 1rem;line-height:1em;">{{content}}</p>
       <sub-view></sub-view>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                content: 'this is index vue'
            }
        }
    }
</script>
<style lang="less">

</style>
