<template>
  <div class="h-datagrid">
    <div class="h-datagrid-title" v-if="title">
      <h4>{{ title }}</h4>
    </div>
    <div class="h-datagrid-toolbar" v-if="hasToolBar">
      <slot name="toolbar"></slot>
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
  import Emitter from '@/utils/emitter';
  export default {
    name: 'HDatagrid',
    data () {
      return {
        tData: [],
        total: 0,
        dataInfo: {},
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        hasToolBar: true,
        loadingData: false //仅在url中生效，非URL在外部配置
      }
    },
    mixins: [Emitter],
    props: {
      title: String,//表格列表头部信息,
      gridData: Object, // 数据信息，包含表格信息rows及分页信息total[可以通过property自定义rows字段]
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
      // getData: Function, //分页获取data函数，该参数必须配gridData || 无分页情况,直接返回rows
      url: String, //参考2.0 通过url请求数据
      bindForm: Object,
      autoLoad: { //设置URL时是否自动加载数据，默认true
        type: Boolean,
        default: true
      },
      loading: { // 非url时使用
        type: Boolean,
        default: false
      },
      property: {
        type: Object,
        default() { // 自定义返回字段
          return {
            total: 'total',
            rows: 'rows',
            pageNo: 'pageNo',
            pageSize: 'pageSize',
            responseType: 'data'
          }
        }
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
          if(newValue && newValue[this.property.rows] && newValue[this.property.rows].length > 0) {
            this.tData = newValue[this.property.rows]
          } else {
            this.tData = []
          }
          if (this.hasPage) {
            if(newValue && newValue[this.property.total]) {
              this.total = newValue[this.property.total]
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
      getDataListByUrl () {
        // 是否有分页存在
        this.loadingData = true
        if (this.hasPage) {
          let query = this.pageInfo
          Object.assign(query, this.bindForm) 
          let that = this          
          fetch.post(this.url, query).then(res => {
            if (res) { //token过期判定
              this.loadingData = false
              if(res[this.property.responseType][this.property.total] && res[this.property.responseType][this.property.total] > 0 && res[this.property.responseType][this.property.rows]) {
                this.tData = res[this.property.responseType][this.property.rows]
                this.total = res[this.property.responseType][this.property.total]
              } else {
                this.tData = []
                this.total = 0
              }
              that.$nextTick(function () {
                that.dispatch('curpage','successDatagridLoad',this.tData, this.total)
              })
            }
          })
        } else {
          let query = this.bindForm
          let that = this
          fetch.post(this.url, query).then(res => {
            if (res && res[this.property.responseType]) {
              this.loadingData = false
              if (res[this.property.responseType][this.property.rows] && res[this.property.responseType][this.property.rows].length > 0) {
                this.tData = res[this.property.responseType][this.property.rows]
              } else if (res[this.property.responseType] && res[this.property.responseType].length > 0) {
                this.tData = res[this.property.responseType]
              } else if(res[this.property.responseType] && res[this.property.responseType][this.property.rows] && res[this.property.responseType][this.property.rows].length > 0){
                this.tData = res[this.property.responseType][this.property.rows]
              } else {
                this.tData = []
              }
              that.$nextTick(function () {
                that.dispatch('curpage','successDatagridLoad')
              })
            }
          })
        } 
      },
      // 赋值
      setGridData () {
        if (this.gridData[this.property.rows]) {
          this.tData = this.gridData[this.property.rows]
        }
        if (this.hasPage) {
          if (this.gridData[this.property.total]) {
            this.total = this.gridData[this.property.total]
          }
        }
      },
      getDataList () {
        if (this.url) {
          this.getDataListByUrl()
        } else if (this.getDataFunc) {
          if (this.hasPage) {
            debugger
            this.$emit('get-data', this.pageInfo)
          } else {
            this.$emit('get-data')
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
      },
      // 反选某行的选中状态，仅多选
      toggleTableSelect (index) {
        if (this.$refs.gridContent.selectType) {
          this.$refs.gridContent.toggleSelect(index)
        } else (
          this.$hMessage.info('仅支持表格多选')
        )
      },
      // 表格导出功能
      exportCsv (params) {
        /* {
          filename:  '' // 文件名
          columns: []// 导出表格列
          data: [] // 导出表格数据
          noHeader: false //是否导出表格头
        } */
        this.$refs.gridContent.exportCsv(params)
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