<template>
  <h-row>
    <h-col span="24">
      <h-form :model="formItem" :label-width="80" cols="3">
        <h-form-item label="输入框">
          <h-input v-model="formItem.input" placeholder="请输入" :style="{width: inputWidth +'px', color: 'red'}"></h-input>
            输入的值为：{{formItem.input}}
        </h-form-item>
        <h-form-item label="选择器">
            <h-select v-model="formItem.select" placeholder="请选择">
            <h-option v-for="(item, index) in list" :key="index" :value="item.value"> 
                {{ item.label }}</h-option> 
          </h-select> 
        </h-form-item> 
          <h-form-item label="单选框" v-show="isShowRadio">
          <h-radio-group v-model="formItem.radio">
              <h-radio label="male">男</h-radio>
              <h-radio label="female">女</h-radio>
          </h-radio-group>
        </h-form-item>
        <h-form-item v-if="isShowButton">
          <h-button type="primary" @click="handleSubmit">提交</h-button>
          <h-button type="ghost" style="margin-left: 8px">取消</h-button>
        </h-form-item>  
      </h-form>
    </h-col>
  </h-row>
</template>
<script>
  import HPanel from '@/components/HPanel'
  import HEcharts from '@/components/HEcharts'

  export default {
    data () {
      return  {
      	message: '我是一个双向绑定的变量',
        formItem: {
          input: '',
          select: '',
          radio: ''
        },
        list: [
          {value:'beijing', label:'北京市'},
          {value: 'shanghai', label: '上海市'},
          {value: 'hangzhou', label: '杭州市'}
        ],
        isShowRadio: true,
        isShowButton: true
      }
    },
    components: {
      HPanel,
      HEcharts
    },
    watch: {
      message (val) {
        console.log(val)
      },
      formItem : {
        handler (val) {
          console.log(val.input)
        },
        deep: true
      }
    },
    computed: {
      hasComputedMessage () {
        return '被计算过:' + this.message
      }
    },
    methods: {
      handleSubmit () {
        console.log('123')
        this.message = '改变了'
      }
    },
    created () {
      console.log('页面初始化')
      // document.getElementsByClassName('aa')
    },
    mounted () {
      console.log('页面mounted')
      console.log(document.getElementsByClassName('aa'))
    }
  }
</script>