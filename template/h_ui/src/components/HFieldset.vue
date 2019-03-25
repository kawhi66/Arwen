<template>
  <fieldset :class="fieldsetCls">
    <legend>{{title}}</legend>
    <div :class="contentCls">
      <slot></slot>
    </div>
    <div :class="[prefixCls + '-collapse-icon']" v-if="collapse" @click='handleCollapse'>
      <a href="javascript:void(0)">
        <h-icon name="unfold"></h-icon>
      </a>
    </div>
  </fieldset>
</template>
<script>
  const prefixCls = 'h-fieldset'
  export default {
    name: 'hFieldset',
    data () {
      return {
        prefixCls: prefixCls,
        isCollapse: false
      }
    },
    props: {
      title: String,
      collapse: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      fieldsetCls () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}` + '-collapse']: this.isCollapse
          }
        ]
      },
      contentCls () {
        return [
          `${prefixCls}-content`
        ]
      },
    },
    methods:{
      handleCollapse () {
        this.isCollapse = !this.isCollapse
      }
    }
  }
</script>
<style>
  .h-fieldset {
    margin-bottom: 10px;
    padding: 10px 0;
    position: relative;
  }
  .h-fieldset legend {
    font-size: 15px;
  }
  .h-fieldset-collapse-icon-line {
    border-bottom: 1px solid #ddd;
  }
  .h-fieldset-collapse-icon {
    display: inline-block;
    position: absolute;
    left: 50%;
    bottom: -15px;
  }
  .h-fieldset-collapse-icon a {
    display: inline-block;
    position: relative;
    color: #999;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid #999;
    background: #fff;
  }
  .h-fieldset-collapse-icon i {
    display: inline-block;
    position: absolute;
    top: -2px; 
    /* top: 1px; */
    transition: transform 0.2s ease-in-out;
  }
  .h-fieldset-collapse .h-fieldset-content {
    display: none;
  }
</style>