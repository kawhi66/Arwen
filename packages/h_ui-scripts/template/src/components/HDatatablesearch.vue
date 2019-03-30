<template>
  <div class="h-datagrid">
    <div class="h-datagrid-title" v-if="title">
      <h4>{{ title }}</h4>
    </div>
    <div class="h-datagrid-toolbar" v-if="hasToolBar">
      <h-row>
        <h-col span="12">
          <slot name="toolbar"></slot>
        </h-col>
        <h-col span="12">
          <slot name="operbar" ></slot>
        </h-col>
      </h-row>
    </div>

    <h-table :data="tData" :columns="columns" 
             :border="border" 
             :size="size"
             :stripe="stripe"
             :show-header="showHeader"
             :width="width"
             :height="height"
             :canDrag="canDrag"
             :loading="loadingData"
             :disabled-hover="disabledHover"
             :highlight-row="highlightRow"
             :row-class-name="rowClassName"
             :no-data-text="onDataText"
             :no-filtered-data-text="noFilteredDataText"
             @on-row-click="onRowClick" 
             @on-row-dblclick="onRowDbClick"
             @on-current-change="onCurrentChange"
             @on-select="onSelect"
             @on-select-cancel="onSelectCancel"
             @on-select-all="onSelectAll"
             @on-selection-change="onSelectChange"
             @on-sort-change="onSortChange"
             @on-expand="onExpand"
             ref="gridContent"></h-table>        
    <h-page :current="current"
            :total="total" 
            :page-size="pageSize"
            :placement="placement"
            :simple="simple"
            :show-total="showTotal"
            :show-elevator="showElevator"
            :show-sizer="showSizer"
            :pageSizeOpts="pageSizeOpts" 
            :class-name="className"
            :styles="styles"
            @on-change="dataChange" 
            @on-page-size-change="pageSizeChange" 
            ref="gridPage" v-if="hasPage"></h-page>
  </div>
</template>
<script>
  const prefixCls = 'h-datagrid'

  import fetch from '../api/httpFetch.js'
  // import Cookies from 'js-cookie'
  import Emitter from '@/utils/emitter';
  export default {
    name: 'HDatagrid',
    data () {
      return {
        filterData:[],
        filtertotalData:0,
        tData: [],
        res: {
            "total": 10,
            "rows": [{
              "parentName": "",
              "leaf": "",
              "transCode": "BIZFRAME",
              "subTransCode": "BIZFRAME",
              "kindCode": "BIZFRAME",
              "kindName": "基础业务框架",
              "parentCode": "bizroot",
              "remark": "",
              "treeIdx": "#bizroot#BIZFRAME#",
              "menuName": "基础业务框架",
              "menuCode": "BIZFRAME",
              "parentId": "bizroot",
              "menuArg": "",
              "menuIcon": "bizframe/images/BIZFRAME.png",
              "menuUrl": "",
              "orderNo": 0,
              "indexLocation": "#bizroot#BIZFRAME#",
              "pId": "",
              "windowModel": "",
              "tip": "",
              "hotKey": "",
              "openFlag": "",
              "windowName": "子窗口",
              "name": "",
              "id": "",
              "entry": "",
              "windowType": "0"
            }, {
              "parentName": "基础业务框架",
              "leaf": "",
              "transCode": "bizMenu",
              "subTransCode": "bizMenu",
              "kindCode": "BIZFRAME",
              "kindName": "基础业务框架",
              "parentCode": "BIZFRAME",
              "remark": "",
              "treeIdx": "#bizroot#BIZFRAME#bizMenu#",
              "menuName": "系统菜单",
              "menuCode": "bizMenu",
              "parentId": "BIZFRAME",
              "menuArg": "",
              "menuIcon": "bizframe/images/bizMenu.png",
              "menuUrl": "",
              "orderNo": 0,
              "indexLocation": "#bizroot#BIZFRAME#bizMenu#",
              "pId": "",
              "windowModel": "",
              "tip": "",
              "hotKey": "",
              "openFlag": "",
              "windowName": "子窗口",
              "name": "",
              "id": "",
              "entry": "",
              "windowType": "0"
            }, {
              "parentName": "系统管理",
              "leaf": "",
              "transCode": "bizSetParam",
              "subTransCode": "bizSetParam",
              "kindCode": "BIZFRAME",
              "kindName": "基础业务框架",
              "parentCode": "bizSysManager",
              "remark": "",
              "treeIdx": "#bizroot#BIZFRAME#bizMenu#bizSysManager#bizSetParam#",
              "menuName": "系统参数设置",
              "menuCode": "bizSetParam",
              "parentId": "bizSysManager",
              "menuArg": "",
              "menuIcon": "bizframe/images/bizSetParam.png",
              "menuUrl": "/bizMenu/bizSysManager/bizSetParam",
              "orderNo": 0,
              "indexLocation": "#bizroot#BIZFRAME#bizMenu#bizSysManager#bizSetParam#",
              "pId": "",
              "windowModel": "",
              "tip": "",
              "hotKey": "",
              "openFlag": "",
              "windowName": "非单页模式窗口",
              "name": "",
              "id": "",
              "entry": "/bizMenu/bizSysManager/bizSetParam",
              "windowType": "3"
            }, {
              "parentName": "系统菜单",
              "leaf": "",
              "transCode": "bizUserManager",
              "subTransCode": "bizUserManager",
              "kindCode": "BIZFRAME",
              "kindName": "基础业务框架",
              "parentCode": "bizMenu",
              "remark": "",
              "treeIdx": "#bizroot#BIZFRAME#bizMenu#bizUserManager#",
              "menuName": "用户管理",
              "menuCode": "bizUserManager",
              "parentId": "bizMenu",
              "menuArg": "",
              "menuIcon": "bizframe/images/bizUserManager.png",
              "menuUrl": "",
              "orderNo": 0,
              "indexLocation": "#bizroot#BIZFRAME#bizMenu#bizUserManager#",
              "pId": "",
              "windowModel": "",
              "tip": "",
              "hotKey": "",
              "openFlag": "",
              "windowName": "子窗口",
              "name": "",
              "id": "",
              "entry": "",
              "windowType": "0"
            }, {
              "parentName": "消息管理",
              "leaf": "",
              "transCode": "bizEmailInbox",
              "subTransCode": "bizEmailInbox",
              "kindCode": "BIZFRAME",
              "kindName": "基础业务框架",
              "parentCode": "bizMsgManager",
              "remark": "",
              "treeIdx": "#bizroot#BIZFRAME#bizMenu#bizMsgManager#bizEmailInbox#",
              "menuName": "消息收件箱",
              "menuCode": "bizEmailInbox",
              "parentId": "bizMsgManager",
              "menuArg": "",
              "menuIcon": "bizframe/images/bizEmailInbox.png",
              "menuUrl": "/bizMenu/bizMsgManager/bizEmailInbox",
              "orderNo": 1,
              "indexLocation": "#bizroot#BIZFRAME#bizMenu#bizMsgManager#bizEmailInbox#",
              "pId": "",
              "windowModel": "",
              "tip": "",
              "hotKey": "",
              "openFlag": "",
              "windowName": "非单页模式窗口",
              "name": "",
              "id": "",
              "entry": "/bizMenu/bizMsgManager/bizEmailInbox",
              "windowType": "3"
            }, {
              "parentName": "系统管理",
              "leaf": "",
              "transCode": "bizSetDict",
              "subTransCode": "bizSetDict",
              "kindCode": "BIZFRAME",
              "kindName": "基础业务框架",
              "parentCode": "bizSysManager",
              "remark": "",
              "treeIdx": "#bizroot#BIZFRAME#bizMenu#bizSysManager#bizSetDict#",
              "menuName": "数据字典设置",
              "menuCode": "bizSetDict",
              "parentId": "bizSysManager",
              "menuArg": "",
              "menuIcon": "bizframe/images/bizSetDict.png",
              "menuUrl": "/bizMenu/bizSysManager/bizSetDict",
              "orderNo": 1,
              "indexLocation": "#bizroot#BIZFRAME#bizMenu#bizSysManager#bizSetDict#",
              "pId": "",
              "windowModel": "",
              "tip": "",
              "hotKey": "",
              "openFlag": "",
              "windowName": "非单页模式窗口",
              "name": "",
              "id": "",
              "entry": "/bizMenu/bizSysManager/bizSetDict",
              "windowType": "3"
            }, {
              "parentName": "用户管理",
              "leaf": "",
              "transCode": "bizSetUser",
              "subTransCode": "bizSetUser",
              "kindCode": "BIZFRAME",
              "kindName": "基础业务框架",
              "parentCode": "bizUserManager",
              "remark": "",
              "treeIdx": "#bizroot#BIZFRAME#bizMenu#bizUserManager#bizSetUser#",
              "menuName": "用户设置",
              "menuCode": "bizSetUser",
              "parentId": "bizUserManager",
              "menuArg": "",
              "menuIcon": "bizframe/images/bizSetUser.png",
              "menuUrl": "/bizMenu/bizUserManager/bizSetUser",
              "orderNo": 1,
              "indexLocation": "#bizroot#BIZFRAME#bizMenu#bizUserManager#bizSetUser#",
              "pId": "",
              "windowModel": "",
              "tip": "",
              "hotKey": "",
              "openFlag": "",
              "windowName": "非单页模式窗口",
              "name": "",
              "id": "",
              "entry": "/bizMenu/bizUserManager/bizSetUser",
              "windowType": "3"
            }, {
              "parentName": "系统菜单",
              "leaf": "",
              "transCode": "bizSysManager",
              "subTransCode": "bizSysManager",
              "kindCode": "BIZFRAME",
              "kindName": "基础业务框架",
              "parentCode": "bizMenu",
              "remark": "",
              "treeIdx": "#bizroot#BIZFRAME#bizMenu#bizSysManager#",
              "menuName": "系统管理",
              "menuCode": "bizSysManager",
              "parentId": "bizMenu",
              "menuArg": "",
              "menuIcon": "bizframe/images/bizSysManager.png",
              "menuUrl": "",
              "orderNo": 1,
              "indexLocation": "#bizroot#BIZFRAME#bizMenu#bizSysManager#",
              "pId": "",
              "windowModel": "",
              "tip": "",
              "hotKey": "",
              "openFlag": "",
              "windowName": "子窗口",
              "name": "",
              "id": "",
              "entry": "",
              "windowType": "0"
            }, {
              "parentName": "",
              "leaf": "",
              "transCode": "2",
              "subTransCode": "2",
              "kindCode": "0006",
              "kindName": "子系统",
              "parentCode": "BIZFRAME",
              "remark": "",
              "treeIdx": "",
              "menuName": "2",
              "menuCode": "2",
              "parentId": "BIZFRAME",
              "menuArg": "2",
              "menuIcon": "",
              "menuUrl": "",
              "orderNo": 2,
              "indexLocation": "",
              "pId": "",
              "windowModel": "",
              "tip": "",
              "hotKey": "",
              "openFlag": "",
              "windowName": "",
              "name": "",
              "id": "",
              "entry": "",
              "windowType": ""
            }]
        },
        total: 0,
        temptData:[],
        temptotal:0,
        dataInfo: {},
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        // jsessionid: Cookies.get('Admin-Token'),
        hasToolBar: true,
        loadingData: false //仅在url中生效，非URL在外部配置
      }
    },
    mixins: [Emitter],
    props: {
      title: String,//表格列表头部信息,
      gridData: Object, // 数据信息，包含表格信息rows及分页信息total
      columns: Array,
      border: {
        type: Boolean,
        default: true
      },
      size: {
        type: String,
        default: 'small'
      },
      stripe: {
        type: Boolean,
        default: true
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      width: [Number, String],
      height: [Number, String],
      canDrag: {
        type: Boolean,
        default: true
      },
      disabledHover: {
        type: Boolean,
        default: false
      },
      highlightRow: {
        type: Boolean
      },
      rowClassName: Function,
      onDataText: String,
      noFilteredDataText: String,
      onRowClick: {
        type: Function,
        default () {
          return ''
        }
      },
      onRowDbClick: {
        type: Function,
        default () {
          return ''
        }
      },
      onCurrentChange: {
        type: Function,
        default () {
          return ''
        }
      },
      onSelect:{
        type: Function,
        default () {
          return ''
        }
      },
      onSelectCancel: {
        type: Function,
        default () {
          return ''
        }
      },
      onSelectAll: {
        type: Function,
        default () {
          return ''
        }
      },
      onSelectChange: {
        type: Function,
        default () {
          return ''
        }
      },
      onSortChange: {
        type: Function,
        default () {
          return ''
        }
      },
      onExpand: {
        type: Function,
        default () {
          return ''
        }
      },
      current: Number,
      pageSize: Number,
      placement: {
        type: String,
        default: 'top'
      },
      pageSizeOpts: Array,
      simple: Boolean,
      showTotal: {
        type: Boolean,
        default: true
      },
      showElevator: {
        type: Boolean,
        default: true
      },
      showSizer: {
        type: Boolean,
        default: true
      },
      className: String,
      styles: Object,
      hasPage:{ //是否显示分页
        type: Boolean,
        default: false
      },
      getDataFunc:{ //分页获取data函数，该参数必须配gridData || 无分页情况,直接返回rows,同时配置get-data事件
        type: Boolean,
        default: false
      },
      //getData: Function, //分页获取data函数，该参数必须配gridData || 无分页情况,直接返回rows
      url: String, //参考2.0 通过url请求数据
      bindForm: Object,
      autoLoad: { //设置URL时是否自动加载数据，默认true
        type: Boolean,
        default: true
      },
      loading: { // 非url时使用
        type: Boolean,
        default: false
      }
    },
    watch: {
      current (val) {
        this.pageInfo.pageNo = val
      },
      pageSize (val) {
        this.pageInfo.pageSize = val
      },
      gridData: {
　　　　handler(newValue, oldValue) {
          if(newValue && newValue.rows && newValue.rows.length > 0) {
            this.tData = newValue.rows
          } else {
            this.tData = []
          }
          if (this.hasPage) {
            if(newValue && newValue.total) {
              this.total = newValue.total
            } else {
              this.tData = 0
            }
          }
　　　　},
　　　　deep: true
  　　},
      // bindForm: {
      //   // 对象深度观察
      //   handler: (val) => {
      //     this.pageInfo.pageNo = 1
      //     this.getDataListByUrl()
      //   },
      //   deep: true
      // }
      loading (val) {
        this.loadingData = val
      }
    },
    methods :{
      filterTable(val,key,type){
        var that = this
        that.filterData = []
        that.filtertotalData = 0
        if(type == 'cons'|| type == ''){
          that.temptData.forEach(function(item,index){
            if(item[key].indexOf(val)>-1){
                that.filterData.push(item)
                that.filtertotalData = that.filterData.length
              }
            })
            that.tData = that.filterData
            that.total = that.filtertotalData
        }else if(type == 'uncons'){
            that.temptData.forEach(function(item,index){
            if(item[key].indexOf(val)==-1){
                that.filterData.push(item)
                that.filtertotalData = that.filterData.length
              }
            })
            that.tData = that.filterData
            that.total = that.filtertotalData
        }else if(type == 'stw'){
            that.temptData.forEach(function(item,index){
            if(item[key].startsWith(val)){
                that.filterData.push(item)
                that.filtertotalData = that.filterData.length
              }
            })
            that.tData = that.filterData
            that.total = that.filtertotalData
        }else if(type == 'endw'){
            that.temptData.forEach(function(item,index){
            if(item[key].endsWith(val)){
                that.filterData.push(item)
                that.filtertotalData = that.filterData.length
              }
            })
            that.tData = that.filterData
            that.total = that.filtertotalData
        }else if(type == 'equal'){
            that.temptData.forEach(function(item,index){
            if(item[key] === val){
                that.filterData.push(item)
                that.filtertotalData = that.filterData.length
              }
            })
            that.tData = that.filterData
            that.total = that.filtertotalData
        }else{
            console.log(5)
        }
        
      },
      exportData(){
        this.$refs.gridContent.exportCsv({
            filename: '原始数据'
        })
      },
      getDataListByUrl () {
        // 是否有分页存在
        //this.loadingData = true
        // if (this.hasPage) {
        //   let query = this.pageInfo
        //   Object.assign(query, this.bindForm) 
        //   let that = this          
        //   fetch.post(this.url, query).then(res => {
        //     if (res) { //token过期判定
        //       this.loadingData = false
        //       if(res.data.total && res.data.total > 0 && res.data.rows) {
        //         this.tData = res.data.rows
        //         this.total = res.data.total
        //         this.temptData = res.data.rows
        //       } else {
        //         this.tData = []
        //         this.total = 0
        //         this.temptData = []
        //       }
        //       that.$nextTick(function () {
        //         that.dispatch('curpage','successDatagridLoad',this.tData, this.total)
        //       })
        //     }
        //   })
        // } else {
        //   let query = this.bindForm
        //   let that = this
        //   fetch.post(this.url, query).then(res => {
        //     if (res && res.data) {
        //       this.loadingData = false
        //       if (res.data.rows && res.data.rows.length > 0) {
        //         this.tData = res.data.rows
        //         this.temptData = res.data.rows
        //       } else if (res.data && res.data.length > 0) {
        //         this.tData = res.data
        //         this.temptData = res.data
        //       } else {
        //         this.tData = []
        //         this.temptData = []
        //       }
        //       that.$nextTick(function () {
        //         that.dispatch('curpage','successDatagridLoad')
        //       })
        //     }
        //   })
        // } 
        this.tData = this.res.rows
        this.total = this.res.total
        this.temptData = this.res.rows
      },
      // 赋值
      setGridData () {
        if (this.gridData.rows) {
          this.tData = this.gridData.rows
        }
        if (this.hasPage) {
          if (this.gridData.total) {
            this.total = this.gridData.total
          }
        }
      },
      getDataList () {
        if (this.url) {
          this.getDataListByUrl()
        } else if (this.getDataFunc) {
          if (this.hasPage) {
            this.$emit('getData', this.pageInfo)
          } else {
            this.$emit('getData')
          }
        } else {
          this.setGridData()
        }
      },
      // 点击上一页
      dataChange (i) {
        this.pageInfo.pageNo = i
        this.getDataList()
      },
      // 页码改变
      pageSizeChange (i) {
        this.pageInfo.pageSize = i
        this.pageInfo.pageNo = 1
        this.getDataList()
      }
    },
    created () {
      if(this.autoLoad) {
        this.getDataList()
      } else {
        if (this.gridData) {
          this.setGridData()
        }
      }
      if (!this.$slots.toolbar) {
        this.hasToolBar = false
      }
    }
   }
</script>
<style>
  .h-datagrid-title {
    padding: 5px 10px 4px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-bottom: 1px solid transparent;
    color: #fff;
    background: #515A71;
  }
  .h-datagrid-title h4 {
    margin: 0;
    line-height: 20px;
  }
  .h-datagrid-toolbar {
    padding: 5px 10px;
    border: solid #d7dde4;
    border-width: 1px 1px 0;
  }
  .h-datagrid-toolbar .h-btn {
    padding: 3px 15px;
  }
  .h-datagrid-toolbar .h-btn > .h-icon + span,
  .h-datagrid-toolbar .h-btn > span + .h-icon{
    font-size: 14px;
    color: #666;
    margin-left: 0;
  }
   .h-datagrid-toolbar .h-btn .iconfont {
    font-size: 16px;
    color: #000;
   }
  .h-datagrid-toolbar .h-btn.h-btn-disable > .h-icon + span,
  .h-datagrid-toolbar .h-btn.h-btn-disable > span + .h-icon,
  .h-datagrid-toolbar .h-btn.h-btn-disable .iconfont {
    color: inherit;    
  }
  .h-datagrid .h-table-small td {
    height: 30px;
  }
  .h-datagrid .h-select-item {
    padding: 3px 16px;
  }
  .h-datagrid .h-page {
    margin: 5px;
  }
  .h-datagrid .h-page .h-page-prev, 
  .h-datagrid .h-page .h-page-next,
  .h-datagrid .h-page .h-page-item-jump-prev,
  .h-datagrid .h-page .h-page-item-jump-next,
  .h-datagrid .h-page .h-page-item,
  .h-datagrid .h-page .h-page-options-elevator input {
    height: 26px;
    line-height: 24px;
    min-width: 24px;
  }
  .h-datagrid .h-page .h-select-single .h-select-selection,
  .h-datagrid .h-page .h-select-single .h-select-selection .h-select-placeholder,
  .h-datagrid .h-page .h-select-single .h-select-selection .h-select-selected-value {
    height: 28px;
    line-height: 26px;
  }
  </style>