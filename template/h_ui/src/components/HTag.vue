<template>
    <transition name="fade">
        <div :class="classes">
            <span :class="dotClasses" v-if="showDot"></span><span :class="textClasses"><slot></slot></span>
            <h-icon v-if="closable" name="close" @click.native.stop="close"></h-icon>
        </div>
    </transition>
</template>
<script>
  import { oneOf } from '@/utils/index'
  const prefixCls = 'h-tag'
  export default {
    name: 'HTag',
    props: {
      closable: {
        type: Boolean,
        default: false
      },
      color: {
        type: String,
        default: 'default'
      },
      type: {
        validator (value) {
          return oneOf(value, ['border', 'dot']);
        }
      },
      name: {
        type: [String, Number]
      }
    },
    computed: {
      classes () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-${this.color}`]: !!this.color,
            [`${prefixCls}-${this.type}`]: !!this.type,
            [`${prefixCls}-closable`]: this.closable
          }
        ]
      },
      textClasses () {
        return `${prefixCls}-text`;
      },
      dotClasses () {
        return `${prefixCls}-dot-inner`;
      },
      showDot () {
        return !!this.type && this.type === 'dot';
      }
    },
    methods: {
      close (event) {
        if (this.name === undefined) {
            this.$emit('on-close', event);
        } else {
            this.$emit('on-close', event, this.name);
        }
      }
    }
  }
</script>
