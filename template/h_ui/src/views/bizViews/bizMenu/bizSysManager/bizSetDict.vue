<template>
  <div>
    <h-panel>
      <h-form :model="formItem" :label-width="80" ref="formItem" cols="3">
        <h-form-item label="条目编号" prop="dictEntryCode">
          <h-input v-model="formItem.dictEntryCode"></h-input>
        </h-form-item>
        <h-form-item label="条目名称" prop="dictEntryName">
          <h-input v-model="formItem.dictEntryName"></h-input>
        </h-form-item>
        <h-form-item label="字典类别" prop="kindCode">
          <h-select-tree v-model="formItem.kindCode" :data="kindCodeList" format-value='id'></h-select-tree>
        </h-form-item> 
         <h-form-item label="类别名称" prop="kindName">
          <h-input v-model="formItem.kindName"></h-input>
        </h-form-item> 
      </h-form>
      <div slot="panelFooter">
        <h-button type="primary" icon="search" @click="handleSearch">查询</h-button>
        <h-button type="ghost" style="margin-left: 8px" icon="arefresh" @click="handleReset">取消</h-button>
      </div>
    </h-panel>
    <h-row>
      <h-col span="14">
        <h-datagrid title="字典条目列表" 
                    hasPage 
                    :pageSizeOpts="pageSizeOpts" 
                    :columns="columnsLeft" 
                    :bindForm="formItem"
                    :gridData="gridData"
                    getDataFunc
                    @get-data="getDictList"
                    :onRowClick="handlelRowClick"
                    :onSelectChange="handleSelectClick"
                    ref="datagrid">
          <div slot="toolbar">
            <h-button type="ghost" icon="addition_fill" @click="handleSetDict('add')">增加</h-button>
            <h-button type="ghost" icon="ios-compose-outline"  @click="handleSetDict('revise')">修改</h-button>
            <h-button type="ghost" icon="delete_fill" @click="handleDelDict()">删除</h-button>
          </div> 
        </h-datagrid>
      </h-col>
      <h-col span="10" style="padding-left:15px;">
        <div class="h-datagrid">
          <div class="h-datagrid-title">
            <h4>字典项</h4>
          </div>
          <div class="h-datagrid-toolbar">
            <h-button type="ghost" icon="addition" @click="addDictItem">增加</h-button>
            <h-button type="ghost" icon="ios-compose-outline" @click='saveDictItem'>保存</h-button>
            <h-button type="ghost" icon="delete" @click='delDictItem'>删除</h-button>
          </div>
          <h-edit-gird :data="rightGridData" 
                       :columns="columnsRight" 
                       size="small" stripe canDrag show-header
                       @on-selection-change='handleSelectRightClick'
                       ref="rightGird"
          ></h-edit-gird>        
        </div>
      </h-col> 
    </h-row>
    <h-msg-box v-model="setDictMsg" width="700" @on-ok="handleSetDictItem" @on-cancel="handleSetDictCancle">
      <p slot="header">
        <span v-if="type=='add'">新增字典条目</span>
        <span v-if="type=='revise'">修改字典条目</span>
      </p>
      <h-form :model="setDict" :label-width="70" ref="setDict" cols="3">
        <h-form-item label="条目编号" prop="dictEntryCode" required>
          <h-input v-model="setDict.dictEntryCode"  v-if="type=='add'"></h-input>
          <h-input v-model="setDict.dictEntryCode" readonly v-else-if="type=='revise'"></h-input>
        </h-form-item>
        <h-form-item label="条目名称" prop="dictEntryName" required>
          <h-input v-model="setDict.dictEntryName"></h-input>
        </h-form-item>
        <h-form-item label="字典类别" prop="kindCode">
          <h-select-tree v-model="setDict.kindCode" :data="kindCodeList" format-value='id' :first-value="setKindCode"></h-select-tree>
        </h-form-item>
        <h-form-item label="备注" prop="remark" cols="3">
          <h-input v-model="setDict.remark" type="textarea"></h-input>
        </h-form-item>
      </h-form>
      <div slot="footer">
        <h-button type="primary" icon="search" @click="handleSetDictItem">确定</h-button>
        <h-button type="ghost" style="margin-left: 8px" icon="refresh" @click="handleSetDictCancle">取消</h-button>
      </div>
    </h-msg-box>
  </div>
</template>
<script>
  import HPanel from '@/components/HPanel'
  import HDatagrid from '@/components/HDatagrid'
  import { post, getKindTree} from '@/api/bizApi/commonUtil'
  import { getDict} from '@/api/bizApi/bizSysManager/bizSetDict'
  export default {
    data () {
      let columnsLeft = [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          title:'123',
          render: (h, params) => {
            // 渲染成其他文字
            return h("a", {
              style: {
                display: "inline-block"
              },
              on: {
                click: (event) => {
                  event.stopPropagation()
                }
              }
            }, code)
          }
        },
        {
          title: "条目编号123",
          key: "dictEntryCode",
          width: 150,
          ellipsis:true,
          render: (h, params) => {
            // 渲染成其他文字
            let code = "123 " +  ' \n ' + " 234"
            return h("a", {
              style: {
                display: "inline-block"
              },
              on: {
                click: (event) => {
                  event.stopPropagation()
                }
              }
            }, code)
          }
        },{
          title: "条目名称",
          key: "dictEntryName",
        },{
          title: "类别名称",
          key: "kindName",
          width: 120,
          ellipsis:true
        }
      ]
      let columnsRight = [
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          type: 'text',
          title: "字典项编号",
          key: "dictItemCode",
          width: 120,
          ellipsis:true
        },
        {
          type: 'text',
          title: "字典名称",
          key: "dictItemName",
          width: 120,
          ellipsis:true
        },
        {
          type: 'text',
          title: "排序",
          key: "dictItemOrder"
        }
      ]
      return{
        formItem: {
          dictEntryCode: null,
          dictEntryName: null,
          kindCode: '',
          kindName:''
        },
        columnsLeft: columnsLeft,
        columnsRight: columnsRight,
        pageSizeOpts: [5,10,15,20],
        totalNum: 0,
        currentRowIdx: null,
        currentRowData: null,
        currentSelectRow: [],
        rightCurrentId: '',
        setDictMsg: false,
        type: null,
        setDict: {
          dictEntryCode: '',
          dictEntryName: '',
          kindCode: '',
          remark: ''
        },
        setKindCode: '',
        rightForm: {
          id: ''
        },
        kindCodeList: [],
        rightGridData: [],
        currentRightSelectRow: [],
        gridData: {}
      }
    },
    components: {
      HPanel,
      HDatagrid
    },
    methods: {
      // 获取Dictlist
      getDictList (pageinfo) {
        debugger
        console.log('表格数据')
        this.gridData={
          "total": 33,
          "rows": [
            {
              "lifecycle": "",
              "leaf": "",
              "dictEntryCode": "121",
              "dictEntryName": "12",
              "kindCode": "0001",
              "kindName": "数据字典",
              "parentCode": "",
              "remark": "",
              "ctrlFlag": "",
              "platform": "0",
              "kindId": "0001",
              "entryCode": "121",
              "pId": "",
              "platformName": "应用",
              "name": "",
              "id": "",
              "entryName": "12"
            }
            
          ]
        }
        // getDict().then(res => {
        //   if (res) {
        //     this.gridData = res.data
        //   }
        // })
      },
      getDictItem (id) {
        this.rightForm.id = id
        post(this.rightForm ,'/bizframe/dict/dictItemList.json').then(res => {
          if(res.data && res.data.length > 0) {
            this.rightGridData = res.data
          } else {
            this.rightGridData = []
          }
        }).catch(error => {
          this.$hMessage.error('网络通信失败,服务器异常')
        })
      },
      // 查询
      handleSearch () {
        this.$refs.datagrid.dataChange(1)
      },
      // 重置
      handleReset () {
        this.$refs.formItem.resetFields()
      },
      // 行点击
      handlelRowClick (arr) {
        this.currentRowIdx = arr[1]
        this.currentRowData = arr[0]
        this.rightCurrentId = this.currentRowData['dictEntryCode']
        this.getDictItem(this.rightCurrentId)
        this.currentRightSelectRow = []
      },
      // 行选中
      handleSelectClick (arr) {
        this.currentSelectRow = arr
      },
      // 新增/修改数据弹出框
      handleSetDict (str) {
        this.type = str
        // 修改需选中一条数据
        if (this.type == "revise") {
          if (this.currentSelectRow && this.currentSelectRow.length == 1) {
            // this.setDict.kindCode = this.currentSelectRow[0].kindCode
            this.setKindCode = this.currentSelectRow[0].kindCode
            console.log(this.setKindCode)
            this.setDict.dictEntryCode = this.currentSelectRow[0].dictEntryCode
            this.setDict.dictEntryName = this.currentSelectRow[0].dictEntryName
            this.setDict.remark = this.currentSelectRow[0].remark
          } else {
            this.$hMessage.info("请选中一条数据")
            return
          }
        } else {
          this.handleResetSetDict('setDict')
        }
        this.setDictMsg = true
        this.currentSelectRow = []
        this.setDictMsgloading = true        
      },
      // 删除某行数据
      handleDelDict () {
        // 仅支持删除一条数据
        if (this.currentSelectRow && this.currentSelectRow.length > 0) {
          this.$hMsgBox.confirm({
            title: '删除',
            content: '确认要删除吗？' ,
            onOk: () => {
              let obj = {}
              obj.codes = ''
              this.currentSelectRow.forEach((item, key) => {
                obj.codes += item.dictEntryCode
                if (key < this.currentSelectRow.length -1) {
                  obj.codes += '#'
                }
              })
              post(obj, '/bizframe/dict/remove.json').then(res => {
                if (res.data && res.data[this.LOCAL_CONFIG.SUCCESS_KEY] == '0') {
                  this.$hMessage.info('删除成功')
                  this.$refs.datagrid.dataChange(1)
                } else {
                  this.$hMessage.info('删除失败[' + res.data.return_info + ']')
                }
              }).catch(error => {
                this.$hMessage.error('网络通信失败,服务器异常')
              })
            }
          })
        } else {
           this.$hMessage.info("请选中要删除的数据")
        }
      },
      // 重置
      handleResetSetDict (name) {
        this.$refs[name].resetFields()
        this.setKindCode = ''
      },
      // 新增/修改确认按钮
      handleSetDictItem () {
        this.$refs.setDict.validate(valid => {
          if (valid) {
            if (this.type == 'add') {
              post(this.setDict, '/bizframe/dict/doAdd.json').then(res => {
                // 可以对res进行是否新增成功的判断，以下是新增成功后进行表格更新
                if (res && res.data[this.LOCAL_CONFIG.SUCCESS_KEY] == '0') {
                  this.setDictMsg = false
                  this.$hMessage.success('新增成功')
                  this.$refs.datagrid.dataChange(1)
                } else {
                  this.$hMessage.error(res.data.return_info)
                }
              }).catch(error => {
                this.$hMessage.error('新增出错')
              }) 
            } else if (this.type == 'revise') {
              post(this.setDict, '/bizframe/dict/doModify.json').then(res => {
                // 可以对res进行是否修改成功的判断，以下是修改成功后进行表格更新
                if (res && res.data[this.LOCAL_CONFIG.SUCCESS_KEY] == '0') {
                  this.setDictMsg = false     
                  this.$refs.datagrid.dataChange(1)
                } else {
                  this.$hMessage.error(res.data.return_info)
                }
              }).catch(error => {
                this.$hMessage.error('修改出错')
              }) 
            }
          }
        })
      },
      // 新增/修改取消按钮      
      handleSetDictCancle () {
        this.handleResetSetDict('setDict')
        this.setDictMsg = false   
      },
      // 新增字典项
      addDictItem () {
        this.rightGridData = this.$refs.rightGird.cloneData
        this.rightGridData.push({
          dictItemCode: '',
          dictItemName: ''
        })
      },
      handleSelectRightClick (arr) {
        this.currentRightSelectRow = arr
      },
      // 保存
      saveDictItem () {
        this.rightGridData = this.$refs.rightGird.cloneData
        let obj = {}
        obj.ids = '',
        obj.dictEntryCode = this.rightCurrentId,
        obj.orderNos = ''
        obj.names = ''
        this.rightGridData.forEach((item, key) => {
          let dictItemCode = item.dictItemCode ? item.dictItemCode : ''
          let dictItemName = item.dictItemName ? item.dictItemName : ''
          let dictItemOrder = item.dictItemOrder ? item.dictItemOrder : ''
          obj.ids += dictItemCode
          obj.names += dictItemName
          obj.orderNos += dictItemOrder
          if (key < this.rightGridData.length - 1) {
            obj.ids += ','
            obj.names += ','
            obj.orderNos += ','
          }
        })
        post(obj, 'bizframe/dict/addDictItem.json').then(res => {
          if (res.data && res.data[this.LOCAL_CONFIG.SUCCESS_KEY] == '0') {
            this.$hMessage.info('保存成功')
            this.getDictItem(this.rightCurrentId)
          } else {
             this.$hMessage.info('保存失败[' + res.data.return_info + ']')
          }
        }).catch(error => {
          this.$hMessage.error('网络通信失败,服务器异常')
        })
      },
      // 去掉已选
      filterDictItem (item) {
        for (let dictItem of this.currentRightSelectRow) {
          if (item.dictItemCode == dictItem.dictItemCode) {
            return false
          }
        }
        return true
      },
      // 删除字典项
      delDictItem () {
        if (this.currentRightSelectRow.length > 0) {
          this.$hMsgBox.confirm({
            title: '删除',
            content: '确认要删除吗？' ,
            onOk: () => {
              this.rightGridData = this.$refs.rightGird.cloneData.filter(this.filterDictItem)
              this.currentRightSelectRow = []
            }
          })
        } else {
          this.$hMessage.info('请选择数据')
        }
      }
    },
    created () {
      getKindTree('0').then(res => {
        if (res.data && res.data.length > 0) {
          this.kindCodeList = res.data
        } else {
          this.kindCodeList = []
        }
      }).catch(error => {
        this.$hMessage.error('获取字典类别数据加载出错')
      })

    }
  }
</script>