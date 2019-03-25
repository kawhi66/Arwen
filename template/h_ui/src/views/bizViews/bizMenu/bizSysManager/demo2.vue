<template>
  <h-row>
    <h-col span="24">
      <h-panel>
        <h-form :model="formItem" :label-width="80" cols="3">
          <h-form-item label="输入框">
            <h-input v-model="formItem.input" placeholder="请输入" :style="{width: inputWidth +'px', color: 'red'}"></h-input>
          </h-form-item>
          <h-form-item label="选择器">
             <h-select v-model="formItem.select" placeholder="请选择">
              <h-option v-for="(item, index) in list" :key="index" :value="item.value"> 
                 {{ item.label }}
              </h-option> 
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
      </h-panel>
    </h-col>
    <h-col span="24">
      <div style="height: 150px">
        <h-echarts ></h-echarts>
      </div>
    </h-col>
    <h-col span="24">
      <h-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="250" label-position='left' :showMessage=true>
        <h-form-item label="姓名" prop="name" :label-width="50" :showMessage=true>
          <h-input v-model="formValidate.name" ></h-input>
        </h-form-item>   
        <h-form-item label="姓名" prop="name" :label-width="50" :showMessage=true>
          <h-select-tree  v-model="formValidate.name" ></h-select-tree>
        </h-form-item>    
        <h-form-item :showMessage=true>
            <h-button type="primary" @click="handleSubmit('formValidate')">提交</h-button>
            <h-button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</h-button>
        </h-form-item>
       </h-form>
    </h-col>
    <h-col span="24">
      <h-select></h-select>
    </h-col>
  </h-row>
</template>
<script>
  import HPanel from '@/components/HPanel'
  import HEcharts from '@/components/HEcharts'
  import Demo2 from '@/mixins/demo2'
  export default {
    data () {
      return  {
        list: [
          {value:'beijing', label:'北京市test'},
          {value: 'shanghai', label: '上海市test'},
          {value: 'hangzhou', label: '杭州市test'}
        ],
        formValidate: {
            name: ''
        },
        ruleValidate: {
          name: [
              { required: true, message: '姓名不能为空', trigger: 'none' }
          ]
        }
      }
    },
    mixins: [Demo2],
    components: {
      HPanel,
      HEcharts
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.$hMessage.success('提交成功!');
            } else {
                this.$hMessage.error('表单验证失败!');
            }
        })
      },
      handleReset (name) {
          this.$refs[name].resetFields();
      },
    }
  }
</script>