<template>
  <div :class="panelCls">
     <div :class="[prefixCls + '-header']" v-if="isHeader">
      <slot name="header">
        <h-icon v-if="icon" :name="icon"></h-icon>
        <h3>{{title}}</h3>
      </slot>
    </div>
    <div :class="contentCls">
      <slot></slot>
    </div>
    <div :class="footerCls">
      <slot name="panelFooter"></slot>
    </div>
    <div :class="[prefixCls + '-collapse-icon']" v-if="collapse" @click='handleCollapse'>
      <a href="javascript:void(0)">
        <h-icon name="unfold"></h-icon>
      </a>
    </div>
    <div :class="[prefixCls + '-collapse-icon-line']"  v-if="collapse"></div>
  </div>
</template>
<script>
  const prefixCls = 'h-panel'
  import {oneOf} from  '../utils/index'
  export default {
    name: 'HPanel',
    data () {
      return {
        prefixCls: prefixCls,
        isCollapse: false
      }
    },
    props: {
      title: String,
      footerPos: {
        validator (value) {
          return oneOf(value, ['left', 'center', 'right']);
        },
        default: 'center'
      },
      collapse: {
        type: Boolean,
        default: false
      },
      icon: String
    },
    computed: {
      panelCls () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}` + '-collapse']: this.isCollapse
          }
        ]
      },
      contentCls () {
        return [
          `${prefixCls}-content`,
          'clearfix'
        ]
      },
      footerCls () {
        return [
          `${prefixCls}-footer`,
          {
            ['text-' + this.footerPos]: this.footerPos,
            ['disNone']: !this.$slots.panelFooter
          }
        ]
      },
      isHeader () {
        return this.title || this.$slots.header
      }
    },
    methods: {
      handleCollapse () {
        this.isCollapse = !this.isCollapse
      }
    }
  }
</script>
<style>
  .clearfix:after {
    display: block;
    content: "";
    clear: both;
    visibility: hidden;
    height: 0;
  }
  .clearfix {
    zoom: 1;
  }
  .disNone {
    display: none;
  }
  .text-left {
    text-align: left;
  }
  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }
  .h-panel {
    margin-bottom: 5px;
    position: relative;
  }
  .h-panel-header {
    padding: 5px 10px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-bottom: 1px solid transparent;
    color: #fff;
    background: #4C5C6F;
  }
  .h-panel-header h3 {
    display: inline-block;
    line-height: 20px;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 13px;
    font-weight: 600;
  }
  .h-panel-header i{
    display: inline-block;
    line-height: 1;
  }
  .h-panel-content {
    padding: 5px;
    background: #fff;
  }
  .h-panel-collapse-icon-line {
    border-bottom: 1px solid #ddd;
  }
  .h-panel-collapse-icon {
    display: inline-block;
    position: absolute;
    left: 50%;
    bottom: -15px;
  }
  .h-panel-collapse-icon a {
    display: inline-block;
    position: relative;
    color: #999;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid #999;
    background: #fff;
  }
  .h-panel-collapse-icon i {
    display: inline-block;
    position: absolute;
    top: -2px; 
    /* top: 1px; */
    transition: transform 0.2s ease-in-out;
  }
  .h-panel-collapse-icon ~.h-panel-footer{
    padding-bottom: 15px;
  }
  .h-panel-footer {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    padding: 10px 0;
    background: #fff;
  }
  .h-panel-collapse .h-panel-content,
  .h-panel-collapse .h-panel-footer {
    display: none;
  }
  .h-panel-collapse .h-panel-collapse-icon i {
    top: -5px; 
    /* top: -2px; */
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg); 
  }
  /* panel内组件布局的调整 */
  .h-panel .h-form-item {
    margin-bottom: 0;
    padding: 5px;
  }
  .h-panel .h-form-item .h-col{
    padding: 0;
  }
  .h-slider-wrap{
    margin: 14px 0;
  }
  .h-panel .h-input-wrapper,
  .h-panel .h-select,
  .h-panel .h-date-picker,
  .h-panel .h-checkbox-wrapper,
  .h-panel .h-radio-group,
  .h-panel .h-radio-wrapper {
    vertical-align: top;
  }
  /* .h-panel-cell.h-panel-cell-ly-4 {
    width: 25%
  } */
</style>