<template>
  <div style="margin:10px 10px 0px 10px;background-color:#fff;">
    <div class="content">
      <!--查询表单-->
      <h-panel>
        <h-form :model="formItem" :label-width="80" ref="formItem" cols="3">
          <h-form-item label="规则编号：" prop="kindCode">
            <h-input v-model="formItem.kindCode"></h-input>
          </h-form-item>
          <h-form-item label="使用状态：" prop="useType">
            <h-select v-model="formItem.useType" >
              <h-option  v-for="item in BIZ_USE_TYPE" :value="item.code" :key="item.code">{{item.text}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item label="调用次数：" prop="useCount" v-show="itemShow">
            <h-input-number :max="10" :min="1" v-model="formItem.useCount"></h-input-number>
          </h-form-item> 
          <h-form-item label="更新日期：" prop="parentCode" v-show="itemShow">
            <h-input v-model="formItem.test"></h-input>
          </h-form-item>
          <h-form-item label="使用状态：" prop="useType" v-show="itemShow">
            <h-select v-model="formItem.useType" >
              <h-option  v-for="item in BIZ_USE_TYPE" :value="item.code" :key="item.code">{{item.text}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item label="使用状态：" prop="useType" v-show="itemShow">
            <h-select v-model="formItem.useType" >
              <h-option  v-for="item in BIZ_USE_TYPE" :value="item.code" :key="item.code">{{item.text}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item v-show="itemShow"></h-form-item>
          <h-form-item v-show="itemShow"></h-form-item>
          <!--数据展示表格-->
          <h-form-item>
            <div>
              <h-button type="primary" icon="search" @click="formSearch()">查询</h-button>
              <h-button type="ghost" style="margin:0 8px" icon="arefresh" @click="formSearchReset()">重置</h-button>
              <a @click="openForm()" v-show="formShow">展开 <i class="iconfont icon-unfold"></i></a>
              <a @click="packupForm()" v-show="formHide">收起 <i class="iconfont icon-ios-arrow-up"></i></a>
            </div>
          </h-form-item>
        </h-form>
        <div class="btn_add">
            <h-button type="primary" icon="add" @click="handleAddForm('add')">新建</h-button>
        </div>
      </h-panel>
      <h-row>
        <!--数据展示表格-->
        <h-col span="24">
          <div class="tablealert_wrap">
            <div data-show="true" class="alert alert_info">
              <i class="iconfont icon_prompt h_icon"></i>
              <span class="alert_message">已选择 <a style="font-weight: 600;">0</a> 项&nbsp;&nbsp;<span style="margin-left: 8px;">服务调用次数总计&nbsp;<span style="font-weight: 600;">0 万</span></span><a style="margin-left: 24px;">清空</a></span><span class="alert-description"></span>
            </div>
          </div>
          <div class="table_detail">
            <h-table :columns="columns" :data="data1"></h-table>
          </div>
        </h-col>
      </h-row>
    </div>
  <!--底部-->
    <div class="layout-footer"> 
      <div class="globalFooter"> 
        <div class="copyright">Copyright <i class="anticon anticon-copyright"></i> 2018 恒生电子研发中心技术研发部出品</div> 
      </div> 
    </div> 
   <!--点击新增/修改弹出窗-->
   <h-msg-box v-model="addOrEditWin" width="800">
     <p slot="header">
        <span v-if="type=='add'">新增类别信息</span>
        <span v-if="type=='modify'">修改类别信息</span>
        <span v-if="type=='view'">类别详情信息</span>
     </p>
     <h-form :model="addForm" :label-width="80" ref="addForm" cols="3">
        <h-form-item label="类别编号：" prop="kindCode" required>
          <span v-if="type=='view'||type=='modify'">{{addForm.kindCode}}</span>
          <h-input v-else v-model="addForm.kindCode" :readonly="readonly"></h-input>
        </h-form-item>
        <h-form-item label="类别名称：" prop="kindName" required>
          <span v-if="type=='view'">{{addForm.kindName}}</span>
          <h-input v-else v-model="addForm.kindName"></h-input>
        </h-form-item>
         <h-form-item label="助记符：" prop="mnemonic" required>
            <span v-if="type=='view'">{{addForm.mnemonic}}</span>
            <h-input v-else v-model="addForm.mnemonic"></h-input>
         </h-form-item>
          <h-form-item label="上级分类：" prop="parentCode">
            <span v-if="type=='view'">{{addForm.parentCode}}</span>
            <h-select-tree v-else v-model="addForm.parentCode" :data="kindList" format-value="id" :first-value="setParentCode"></h-select-tree>
          </h-form-item>
         <h-form-item label="描述：" prop="remark" cols="3">
            <span v-if="type=='view'">{{addForm.remark}}</span>
            <h-input v-else v-model="addForm.remark" type="textarea"></h-input>
         </h-form-item>
     </h-form>
      <div slot="footer" v-if="type!='view'">
          <h-button type="primary"  @click="submitForm()">提交</h-button>
          <h-button type="ghost" style="margin:0 8px"  @click="addFormReset()">重置</h-button>
      </div>
   </h-msg-box>
  </div>
</template>
<script>
import HPanel from "@/components/HPanel";
import HDatagrid from "@/components/HDatagrid";

import {
  getAllKindTree,
  post
} from "@/api/bizApi/commonUtil";
export default {
  data() {
    let options = {};
    options.itemShow=false;
    options.BIZ_USE_TYPE = [{
      code: 1,
      text:"关闭"    },{
      code: 2,
      text:"运行中"
    }];
    options.formShow=true;
    options.formHide=false;
    options.kindList = [];
    options.formItem = {
      kindCode: "",
      kindName: "",
      parentCode: ""
    };
    options.pageSizeOpts = [5, 10, 15, 20];
    options.type = null;
    options.addOrEditWin = false;
    options.readonly=false;
    let addForm = {
      kindCode: "",
      kindName: "",
      mnemonic: "",
      parentCode: "",
      remark: ""
    };
    options.setParentCode = ""
    let columns = [
      {
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "规则编号",
        key: "kindCode",
        width: 150
      },
      {
        title: "描述",
        key: "desc",
        width: 200
      },
      {
        title: "服务调用次数",
        key: "serviceCalls",
        width: 150
      },
      {
        title: "状态",
        key: "states",
        width: 150,
        render: (h, params) => {
          return h('div', [
                h('span', {
                    class: {
                      'status_dot' : true,
                      'status_success' : params.row.states == '已上线',
                      'status_default' : params.row.states == '关闭',
                      'status_error' : params.row.states == '异常',
                      'status_processing' : params.row.states == '运行中'
                    }
                }),
                h('span', params.row.states)
            ]);
        }
      },
      {
        title: "更新时间",
        key: "updateTime",
        width: 200
      },
      {
        title: "操作",
        key: "action",
        fixed: 'right',
        width: 150,
        align: 'center',
        render: (h, params) => {
          return h('div', [
                h('Button', {
                   class: {
                      'render_button' : true
                    },
                    props: {
                        type: 'text',
                        size: 'small'
                    },
                    on: {
                      click: () => {
                        this.currentSelectRow = params.row;
                        this.handleAddForm("modify");
                      }
                    }
                }, '配置'),
                h('Button', {
                   class: {
                      'render_button' : true
                    },
                    props: {
                        type: 'text',
                        size: 'small'
                    },
                    on: {
                      click: () => {
                        this.currentSelectRow = params.row;
                        this.handleAddForm("view");
                      }
                    }
                }, '订阅警报')
            ]);
        }
      }
    ];
    options.columns = columns;
    let data1 = [
      {
        kindCode: 'TradeCode 0',
        desc: '这是一段描述',
        serviceCalls: '827 万',
        states: '运行中',
        updateTime: '2017-07-01 00:00:00'
      },
      {
        kindCode: 'TradeCode 1',
        desc: '这是一段描述',
        serviceCalls: '691 万',
        states: '运行中',
        updateTime: '2017-07-01 00:00:00'
      },
      {
        kindCode: 'TradeCode 2',
        desc: '这是一段描述',
        serviceCalls: '923 万',
        states: '关闭',
        updateTime: '2017-07-02 00:00:00'
      },
      {
        kindCode: 'TradeCode 3',
        desc: '这是一段描述',
        serviceCalls: '591 万',
        states: '运行中',
        updateTime: '2017-07-02 00:00:00'
      },
      {
        kindCode: 'TradeCode 4',
        desc: '这是一段描述',
        serviceCalls: '230 万',
        states: '已上线',
        updateTime: '2017-07-03 00:00:00'
      },
      {
        kindCode: 'TradeCode 5',
        desc: '这是一段描述',
        serviceCalls: '634 万',
        states: '关闭',
        updateTime: '2017-07-03 00:00:00'
      },
      {
        kindCode: 'TradeCode 6',
        desc: '这是一段描述',
        serviceCalls: '986 万',
        states: '关闭',
        updateTime: '2017-07-04 00:00:00'
      },
      {
        kindCode: 'TradeCode 7',
        desc: '这是一段描述',
        serviceCalls: '669 万',
        states: '已上线',
        updateTime: '2017-07-04 00:00:00'
      },
      {
        kindCode: 'TradeCode 8',
        desc: '这是一段描述',
        serviceCalls: '627 万',
        states: '异常',
        updateTime: '2017-07-05 00:00:00'
      },
      {
        kindCode: 'TradeCode 9',
        desc: '这是一段描述',
        serviceCalls: '185 万',
        states: '运行中',
        updateTime: '2017-07-05 00:00:00'
      }];
    options.data1 = data1;
    options.addForm = addForm;
    options.currentSelectRow = null;
    options.currentSelectList = [];
    options.pageInfo = {
      pageNo: 1,
      pageSize: 10
    };
    return options;
  },
  components: {
    HPanel,
    HDatagrid
  },
  methods: {
    openForm() {
      this.itemShow=true;
      this.formShow=false;
      this.formHide=true;
    },
    packupForm() {
      this.itemShow=false;
      this.formShow=true;
      this.formHide=false;
    },
    formSearch() {
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      this.$refs.formItem.resetFields();
    },
    addFormReset() {
      this.$refs.addForm.resetFields();
        if(this.type=='modify'){
        this.addForm.kindCode = this.currentSelectRow[0].kindCode;
      }
    },
    handleAddForm(str) {
      this.type = str;
      this.readonly = false;
      if (this.type == "modify" || this.type == "view") {
        this.addForm.kindCode = this.currentSelectRow.kindCode;
        this.addForm.kindName = this.currentSelectRow.kindName;
        this.addForm.mnemonic = this.currentSelectRow.mnemonic;
        this.addForm.parentCode = this.currentSelectRow.parentCode;
        this.setParentCode = this.currentSelectRow.parentCode;
        this.addForm.remark = this.currentSelectRow.remark;
        if(this.type == "modify"){
            this.readonly = true;
        }
        if(this.type == "view"){
            this.addForm.parentCode = this.currentSelectRow.parentName;
        }
      } else {
        this.handleResetSetDict("addForm");
      }
      //this.handleResetSetDict("setUser");
      this.addOrEditWin = true;
    },
    handleResetSetDict(name) {
      this.$refs[name].resetFields();
    },
    handleSelectClick(arr) {
      this.currentSelectList = arr;
    },
    handlelRowClick(arr) {
      this.currentSelectRow = arr;
    },
    orgSelect(data){
      this.addForm.relOrg=data.id;
    },
    submitForm() {
      if (this.type == "add") {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            post(this.addForm,'/bizframe/kind/add.json').then(res => {
              this.$hMessage.info("新增成功!");
              this.addOrEditWin = false;
              this.formItem.kindCode = this.addForm.kindCode;
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList=[];
            });
          }
        });
      } else {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            post(this.addForm,'/bizframe/kind/modify.json').then(res => {
              this.$hMessage.info("修改成功!");
              this.addOrEditWin = false;
              this.formItem.kindCode = this.addForm.kindCode;
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList=[];
            });
          }
        });
      }
    },
   handleComfirm(){
       let list = this.currentSelectList;
       if(list.length>0){
          //this.delConfirm=true;
            this.$hMsgBox.confirm({
              title: "确认",
              content: "确定要删除选中数据吗？",
              onOk: () => {
                   let ids = "";
                    for (var i = 0, count = list.length; i < count; i++) {
                      ids += list[i].kindCode;
                      if (i < list.length - 1) {
                        ids += ",";
                      }
                    }
                    post({kindCodes:ids},'/bizframe/kind/del.json').then(res => {
                      if(res){
                          let returnCode = res.data.return_code;
                          let returnInfo = res.data.return_info;
                          if(returnCode=="0"){
                              this.$hMessage.success("删除成功");
                          }else{
                              this.$hMessage.error(returnInfo);
                          }
                          
                          this.$refs.datagrid.dataChange(1);
                          this.currentSelectRow = [];
                          this.currentSelectList=[];
                      }else{
                          this.$hMessage.info("网络通信失败");
                      }
                      
                    });
              }
            })
       }else{
          this.$hMessage.info("请至少选中一条数据");
       }
      
    },
   
  },

  created() {
    getAllKindTree().then(res => {
      this.kindList = res.data;
    }).catch(error => {
      this.$hMessage.error('网络通信失败,服务器异常')
    })
  }
};
</script>
