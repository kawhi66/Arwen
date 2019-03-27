<template>
    <div>
        <div class="pageHeader">
            <div class="detail_wrap">
                <div class="main_container">
                    <div class="row_box">
                        <h1 class="title_detail">基础表单</h1>
                    </div>
                    <div class="row_box">
                        <div class="content_detail">表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pageContent">
            <div class="card card-wider-padding">
                <div class="card-body">
                    <div class="card-body-form">
                        <h-form :model="formItem" ref="formItem" :label-width="100">
                            <h-form-item v-for="(field,index) in feildList" :prop="feildList[index].code" :label="field.label" :key="field.code" required>
                                <h-input v-model="formItem[feildList[index].code]" placeholder="给目标起个名字"></h-input>
                            </h-form-item>
                            <h-form-item label="标题">
                                <h-input v-model="formItem.input" placeholder="给目标起个名字"></h-input>
                            </h-form-item>
                            <h-form-item label="起止日期">
                                <h-row>
                                    <h-col span="11">
                                        <h-date-picker type="date" placeholder="开始日期" v-model="formItem.date"></h-date-picker>
                                    </h-col>
                                    <h-col span="2" style="text-align: center">-</h-col>
                                    <h-col span="11">
                                        <h-time-picker type="time" placeholder="结束日期" v-model="formItem.time"></h-time-picker>
                                    </h-col>
                                </h-row>
                            </h-form-item>
                            <h-form-item label="目标描述">
                                <h-input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入你的阶段性工作目标"></h-input>
                            </h-form-item>
                            <h-form-item label="衡量标准">
                                <h-input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入衡量标准"></h-input>
                            </h-form-item>
                            <h-form-item label="客户（选填）">
                                <h-input v-model="formItem.input" placeholder="请描述你服务的客户，内部客户直接@姓名/工号"></h-input>
                            </h-form-item>
                            <h-form-item label="邀评人（选填）">
                                <h-input v-model="formItem.input" placeholder="请直接@姓名/工号，最多可邀请5人"></h-input>
                            </h-form-item>
                            <h-form-item label="权重（选填）">
                                    <h-input v-model="formItem.input" placeholder="请输入...">
                                    <span slot="append">%</span>
                                    </h-input>
                            </h-form-item>

                            <h-form-item label="目标公开">
                                <h-radio-group v-model="disabledGroup">
                                    <h-radio label="公开"></h-radio>
                                    <h-radio label="部分公开"></h-radio>
                                    <h-radio label="不公开"></h-radio>
                                </h-radio-group>
                                <h-select v-model="formItem.select" placeholder="请选择" v-if="disabledGroup == '部分公开'">
                                    <h-option value="beijing">北京市</h-option>
                                    <h-option value="shanghai">上海市</h-option>
                                    <h-option value="shenzhen">深圳市</h-option>
                                </h-select>
                                <div class="form-explain">客户、邀评人默认被分享</div>
                            </h-form-item>
                            <h-form-item>
                                <h-button type="primary" @click="submitFn">提交</h-button>
                                <h-button type="ghost" style="margin-left: 8px">取消</h-button>
                            </h-form-item>
                        </h-form>                       
                    </div>
                </div>
            </div>
        </div>
      <!--底部-->
      <div class="layout-footer"> 
        <div class="globalFooter"> 
          <div class="copyright">Copyright <i class="anticon anticon-copyright"></i> 2018 恒生电子研发中心技术研发部出品</div> 
        </div> 
      </div> 
    </div>
</template>
<script>
    export default {
        data () {
            return {
                disabledGroup: '公开',
                userId:'',
                userName:'',
                formItem: {
                    input: '',
                    select: '',
                    radio: 'male',
                    checkbox: [],
                    switch: true,
                    date: '',
                    time: '',
                    slider: [20, 50],
                    textarea: ''
                },
                feildList:[]//自定义表单列表
            }
        },
        methods: {
            submitFn(){
                console.log(this.formItem);
                this.$refs.formItem.validate((valid) => {
                    if (valid) {
                       alert('提交成功!');
                    //    this.$refs.formItem.resetFields();//提交成功后，就清空表单
                    } else {
                       alert('表单验证失败!');
                    }
                })
            }
        },
        created() {
            //模拟后台返回的自定义表单列表
            let feilds = [{code:"userId",label:"用户id",type:1},{code:"userName",label:"用户名",type:2}]
            this.feildList = feilds
            feilds.forEach((element, index) => {
                this.$set(this.formItem, element.code, '')
            })
        },
    }
</script>

