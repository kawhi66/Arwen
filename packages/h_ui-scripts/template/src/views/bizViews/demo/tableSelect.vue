<template>
  <div class="rightPage">
    <h-datatablesearch has-page 
            :pageSizeOpts="pageSizeOpts" 
            :columns="columns" 
            :bindForm="formItem"
            url="/getTabledatatest"
            ref="datagrid">
      <div slot="toolbar">
        <h-button type="ghost" icon="social-buffer" @click="handleselfdefines">自定义列表项</h-button>
        <h-button type="ghost" icon="android-print" @click="handleexportData">导出</h-button>
        <h-button type="ghost" icon="order_fill" @click="handledel()">分组显示</h-button>
      </div> 
      <div slot="operbar" style="display:flex;align-items:center;flex-direction:row-reverse;">
        <a href="#" style="display:inline-flex;align-items:center;padding-right:35px" @click="handlefullScreen">
          <h-icon name="arrow-expand" size="18" color="#657180"></h-icon>
        </a>
        <a href="#" style="display:inline-flex;align-items:center;padding-right:15px" @click="handlemultiple">
          <h-icon name="crop" size="20" color="#657180"></h-icon>
        </a>
      </div>  
    </h-datatablesearch>
    <h-msgBox
        v-model="selfDefine"
        title="列选择"
        width="60%">
        <div class="displaygroupwrap" >
          <div class="displaygroupleft" style="float:left;">
            <p>显示列</p>
          </div>
          <div class="displaygroupright" style="float:right;">
            <p>提示：拖动【显示列】可进行排序；单击将此列设为冻结列，取消冻结；在显示列中单击隐藏该列，在隐藏列中单击显示该列</p>
          </div>
        </div>
        <div>
            <!-- 显示列上侧 -->
            <ul class="h-msg-wrap">
              <li class="displaygroup" v-for="(item,index,key) in lockItems">
                <!-- 其他列 -->
                <span class="h-msg-group">
                  <span class="h-msg-group-header" >{{item.title}}</span>
                  <div class="h-msg-icon-group" style="float:right;margin-left:10px;">
                      <a href="#">
                          <h-icon name="unlocked" style="margin-right:5px;color:#F4C787;" @click.native.stop="handleunlock(index)"></h-icon>
                          <h-icon name="error" style="color:#F4C787;" @click.native.stop="handledisplayremove(index)"></h-icon>
                      </a>
                  </div>
                </span>
              </li>
            </ul>
            <!-- 显示列 -->
            <ul class="h-msg-wrap">
              <li class="itemSelectGroup" v-for="(item,index,key) in items">
                <!-- 其他列 -->
                <span class="h-msg-group">
                  <span class="h-msg-group-header" >{{item.title}}</span>
                  <div class="h-msg-icon-group" style="float:right;margin-left:10px;">
                      <a href="#">
                          <h-icon name="locked" style="margin-right:5px" @click.native.stop="handleLock(index)"></h-icon>
                          <h-icon name="error" @click.native.stop="handleremove(index)"></h-icon>
                      </a>
                  </div>
                </span>
              </li>
            </ul>
        </div>
        <div>
          <div class="displaygroupleft"style="float:left;">
            <p>隐藏列</p>
          </div>
          <!-- 隐藏列 -->
          <ul class="h-msg-wrap">
              <li class="hiddengroup" v-for="(item,index,key) in hiddenItems">
                <!-- 其他列 -->
                <span class="h-msg-group">
                  <span class="h-msg-hidden-item" >{{item.title}}</span>
                  <div class="h-msg-hidden-icon-group">
                      <a href="#">
                          <h-icon name="android-add" style="margin-right:5px;" @click.native.stop="handlehiddenlock(index)"></h-icon>
                      </a>
                  </div>
                </span>
              </li>
            </ul>
        </div>
        <div slot="footer">
          <h-button type="info" icon="addition" @click="resetAll">全部重置</h-button>
          <h-button type="ghost" icon="addition" @click="cancel">取消</h-button>
          <h-button type="primary" style="margin-left: 8px" @click="ok">确认</h-button> 
      </div>
    </h-msgBox>
    <h-msgBox v-model="details"
        title="详情"
        width="80%"
        :styles="{top: '20px'}">
        <div>
          <ul class="h-details-wrap">
              <li class="h-details-contains" v-for="(item,key,index) in detailRows">
                <div class="h-details-box">
                  <div class="h-details-key">
                    <span class="h-details-span">{{key}}</span>
                  </div>
                  <div class="h-details-item" >
                    <span class="h-details-span">{{item}}</span>
                  </div>
                </div>
              </li>
            </ul>
        </div>
        <div slot="footer">
            <h-button type="primary" style="margin-left: 8px" @click="closeDetail">关闭</h-button> 
        </div>
    </h-msgBox>
    <div v-show="this.visible2" class="h-table-checkBox-container">
        <h-checkbox-group class="h-table-checkBox-group" v-model="selectGroup" v-for="(item,index,key) in columns" :key="item.key" @on-change="checkAllGroupChange(index)">
            <h-checkbox :label="item.key">
                <span class="h-table-checkBox-item" >{{item.title}}</span>
            </h-checkbox>
        </h-checkbox-group>    
    </div>
  </div>
</template>
<script>
  import HPanel from '@/components/HPanel'
  import HDatatablesearch from '@/components/HDatatablesearch'
  import { post, getDicts, getKindTree } from '@/api/bizApi/commonUtil' 
  import { mapGetters } from 'vuex' 
  export default {
    name: 'curpage',
    data () {
      let columns = [
        {
          title: "菜单编号",
          key: "menuCode",
          ellipsis:true,
          fixed: "",
          width:150,
          sortable: true,
          hiddenCol:false,
          renderHeader: (h, params) => {
                            var that = this
                            return [h('div', {
                                        
                                        style :{
                                                display: 'inline-block',
                                                float: 'right',
                                                marginRight: '2px',
                                                fontWeight:'normal',
                                        }
                                    }, [
                                      h('h-dropdown', {
                                        props:{
                                          trigger:'custom',
                                          visible:this.visible,
                                          placement:'right-end'
                                        },
                                      },[
                                        h('a',{
                                          props:{
                                            href:'javascript:void(0)',
                                          },
                                          on:{
                                            'click'(event){
                                              that.visible = !that.visible
                                            }              
                                          }
                                        },[
                                          h('h-icon',{
                                            props:{
                                              name:'android-menu'
                                            },
                                            class: {
                                              'h-table-search-icon': true
                                            }                
                                          })
                                        ]),
                                        h('h-dropdown-menu',{
                                          slot: 'list'
                                        },[
                                          h('h-dropdown-item',[
                                            h('div',[
                                              h('span',{
                                                style:{
                                                  display:'block',
                                                  padding:'5px 0px'
                                                }
                                              },'筛选本页查询结果'),
                                              h('div',{
                                                style:{
                                                    display:'flex',
                                                    border:'1px solid #e2e2e2'
                                                  }
                                              },[
                                                h('div',{
                                                    style:{
                                                        display:'flex',
                                                        alignItems:'center'
                                                      },
                                                },[
                                                  h('a',{
                                                    props:{
                                                      href:'javascript:void(0)',
                                                    },
                                                    class:{
                                                      'h-table-unfold-icon':true
                                                    },
                                                    style:{
                                                      display:'flex',
                                                      alignItems:'center'
                                                    },
                                                    on:{
                                                      'click'(event){
                                                        if(event.target.parentNode.parentNode.nextSibling.style.display=='block'){
                                                          event.target.parentNode.parentNode.nextSibling.style.display='none'
                                                        }else{
                                                          event.target.parentNode.parentNode.nextSibling.style.display='block'
                                                        }
                                                        let list =  event.target.parentNode.parentNode.nextSibling.childNodes
                                                        //console.log(list)
                                                          //给每个li绑定事件
                                                        for(let i = 0;i<list.length;i++){
                                                            list[i].index=i;
                                                            list[i].onclick = function(eve){
                                                              //弹出对应的li节点里面的内容
                                                              that.tempIcon = that.searchTypeName[this.index]
                                                              // console.log(that.tempIcon)
                                                              // console.log(this.index)
                                                              that.tempSearchtype = that.searchType[this.index]
                                                              //console.log(that.tempSearchtype)
                                                              event.target.parentNode.parentNode.nextSibling.style.display='none'
                                                          }
                                                        }
                                                      }              
                                                    }
                                                  },[
                                                    h('h-icon',{
                                                      props:{
                                                        name:that.tempIcon,
                                                        size:'20',
                                                        // color:'#657180'
                                                      },
                                                    style:{
                                                      display:'inline-block', 
                                                      paddingLeft:'2px'
                                                    },
                                                    }),
                                                    h('h-icon',{
                                                      props:{
                                                        name:'unfold',
                                                        size:'5',
                                                        // color:'#657180'
                                                      },
                                                    style:{
                                                      display:'inline-block',
                                                      paddingRight:'2px'
                                                     
                                                    },
                                                    })
                                                  ]),
                                                ]),
                                                h('ul',{
                                                    style:{
                                                      zIndex:'9999',
                                                      display:'none',
                                                      position:'absolute',
                                                      top:'62px',
                                                      background:'#fff',
                                                      color:'#666',
                                                      padding:'5px',
                                                      borderLeft:'1px solid #e2e2e2',
                                                      borderRight:'1px solid #e2e2e2',
                                                      borderBottom:'1px solid #e2e2e2',
                                                      fontWeight:'normal',
                                                      fontFamily:'Arial, Microsoft Yahei, sans-serif, Verdana'
                                                    },
                                                    class:{
                                                      'h-table-type-search': true
                                                    },
                                                    on:{
                                                      'click'(event){
                                                        
                                                      }
                                                    }
                                                  },[
                                                    h('li',[
                                                      h('h-icon',{
                                                        props:{
                                                          name:that.searchTypeName[0]
                                                        },
                                                        style:{
                                                          paddingRight:'5px'
                                                        }                  
                                                      }),
                                                      h('span','包含')
                                                    ]),
                                                    h('li',[
                                                      h('h-icon',{
                                                        props:{
                                                          name:that.searchTypeName[1]
                                                        },
                                                        style:{
                                                          paddingRight:'5px'
                                                        }                  
                                                      }),
                                                      h('span','不包含')
                                                    ]),
                                                    h('li',[
                                                      h('h-icon',{
                                                        props:{
                                                          name:that.searchTypeName[2]
                                                        },
                                                        style:{
                                                          paddingRight:'5px'
                                                        }                  
                                                      }),
                                                      h('span','以...开始')
                                                    ]),
                                                    h('li',[
                                                      h('h-icon',{
                                                        props:{
                                                          name:that.searchTypeName[3]
                                                        },
                                                        style:{
                                                          paddingRight:'5px'
                                                        }                  
                                                      }),
                                                      h('span','以...结束')
                                                    ]),
                                                    h('li',[
                                                      h('h-icon',{
                                                        props:{
                                                          name:that.searchTypeName[4]
                                                        },
                                                        style:{
                                                          paddingRight:'5px'
                                                        }                  
                                                      }),
                                                      h('span','等于')
                                                    ]),
                                                    h('li',[
                                                      h('h-icon',{
                                                        props:{
                                                          name:that.searchTypeName[5]
                                                        },
                                                        style:{
                                                          paddingRight:'5px'
                                                        }                  
                                                      }),
                                                      h('span','重置')
                                                    ])
                                                ]),
                                                h('h-input',{
                                                  props:{
                                                    autofocus:true,
                                                    placeholder:'过滤查询条件...'
                                                  },
                                                  style:{
                                                    flex:'1',
                                                  },
                                                  on: {
                                                    'on-enter' (event){
                                                      that.$refs.datagrid.filterTable(event.target.value,params.column.key,that.tempSearchtype)
                                                      that.visible = !that.visible
                                                    }
                                                  }
                                                }),
                                              ]),
                                              h('div',{
                                                  style:{
                                                    borderTop: '1px solid #e2e2e2',
                                                    marginTop:'8px',
                                                    padding: '5px 0'
                                                  },
                                                  class:{
                                                    'h-table-type-footer':true
                                                  }
                                              },[
                                                h('span',{
                                                  style:{
                                                    display:'inline-flex',
                                                    lineHeight: '18px',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    marginLeft:'10px',
                                                    borderRight:'1px solid #e2e2e2',
                                                    paddingRight:'5px',

                                                    alignItems:'center'
                                                    
                                                  }
                                                },[
                                                  h('h-icon',{
                                                    props:{
                                                      name:'android-options'
                                                    },
                                                    style:{
                                                      paddingRight:'5px'
                                                    },
                                                    on:{
                                                      'click'(event){
                                                        
                                                      }
                                                    }
                                                  }),
                                                  h('a',{
                                                    style:{
                                                      // color: '#666'
                                                    }
                                                  },'清除该列条件')
                                                ]),
                                                h('span',{
                                                  style:{
                                                    display:'inline-flex',
                                                    lineHeight: '18px',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    marginLeft:'10px',
                                                    borderRight:'1px solid #e2e2e2',
                                                    paddingRight:'5px',
                                                    alignItems:'center'
                                                  }
                                                },[
                                                  h('h-icon',{
                                                    props:{
                                                      name:'brush'
                                                    },
                                                    style:{
                                                      paddingRight:'5px'
                                                      
                                                    }
                                                  }),
                                                  h('a',{
                                                    style:{
                                                      // color: '#666'
                                                    },
                                                    on:{
                                                      'click'(event){
                                                        
                                                      }
                                                    }
                                                  },'清除其他列条件')
                                                ]),
                                                h('span',{
                                                  style:{
                                                    display:'inline-flex',
                                                    lineHeight: '18px',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    marginLeft:'10px',
                                                    borderRight:'1px solid #e2e2e2',
                                                    alignItems:'center'
                                                  }
                                                },[
                                                  h('h-icon',{
                                                    props:{
                                                      name:'trash-a'
                                                    },
                                                    style:{
                                                      paddingRight:'5px'
                                                    },
                                                    on:{
                                                      'click'(event){
                                                        
                                                      }
                                                    }
                                                  }),
                                                  h('a',{
                                                    style:{
                                                      // color: '#666'
                                                    }
                                                  },'清除所有列条件')
                                                ])
                                              ])
                                            ])
                                          ])
                                        ])
                                      ])
                                    ]),
                                    h('span',params.column.title)
                                    ]
                                    
            }
        },
        {
          title: "菜单名称",
          key: "menuName",
          width: 150,
          fixed: "",
          ellipsis:true,
          sortable: true,
          hiddenCol:false,
          renderHeader: (h, params) =>{
                        var that =this
                        return [
                            h('div', {
                                    style :{
                                            display: 'inline-block',
                                            float: 'right',
                                            marginRight: '2px',
                                            fontWeight:'normal',
                                    }
                                    }, [
                                      h('h-dropdown', {
                                        props:{
                                          trigger:'custom',
                                          visible:this.visible2,
                                          placement:'right-end'
                                        },
                                      },[
                                        h('a',{
                                          props:{
                                            href:'javascript:void(0)',
                                          },
                                          on:{
                                            'click'(event){
                                                that.visible2 = !that.visible2
                                                let e = event || window.event;
                                                let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
                                                let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
                                                let x = e.pageX || e.clientX + scrollX;
                                                let y = e.pageY || e.clientY + scrollY;
                                                // console.log(document.getElementsByClassName('h-select-container'))
                                                document.getElementsByClassName('h-table-checkBox-container')[0].style.top = (y-100)+"px"
                                                document.getElementsByClassName('h-table-checkBox-container')[0].style.left = (x-283)+"px"
                                            }              
                                          }
                                        },[
                                          h('h-icon',{
                                            props:{
                                              name:'unfold'
                                            },
                                            class: {
                                              'h-table-search-icon': true
                                            }                
                                          })
                                        ])
                                      ])
                                    ]),
                            h('span',params.column.title)
                        ]
          }
        },
        {
          title: "菜单选项",
          key: "menuSelect",
          width: 150,
          fixed: "",
          hiddenCol:true,
          sortable: true,
          hiddenCol:false,
        },
                {
          title: "类别id",
          key: "kindCode",
          width: 150,
          fixed: "",
          hiddenCol:true,
          sortable: true,
          hiddenCol:false,
        },
        {
          title: "上级菜单",
          key: "parentName",
          width: 150,
          fixed: "",
          ellipsis:true,
          sortable: true,
          hiddenCol:false,
        },
        {
          title: "菜单URL",
          key: "menuUrl",
          ellipsis:true,
          fixed: "",
          sortable: true,
          hiddenCol:false,
        },
        {
          title: "类别名称",
          key: "kindName",
          width: 150,
          fixed: "",
          ellipsis:true,
          sortable: true,
          hiddenCol:false,
        },
        {
          title: '排序',
          key: 'orderNo',
          align: 'center',
          fixed: "",
          sortable: true,
          hiddenCol:false,
        },
        {
          title: '操作',
          key: 'operater',
          align: 'center',
          fixed: 'right',
          sortable: true,
          hiddenCol:false,
          render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    style: {
                                        marginRight: '5px',
                                        display:"inline-block",
                                        width: '20px',
                                        height: '20px'
                                    },
                                    on: {
                                        click: () => {
                                            //console.log(params.column)
                                            // console.log(params.row)
                                            this.detailRows = params.row
                                            this.details = true
                                        }
                                    }
                                },[
                                  h('h-icon',{
                                    props:{
                                      size:'20',
                                      name:'ios-compose-outline'
                                    }
                                  })
                                ])
                            ]);
                        }
        }
      ]
      return {
        isShowSearchGroup:true,
        tempIcon:'search',
        searchType:['cons','uncons','stw','endw','equal','reset'],
        tempSearchtype:'',
        searchTypeName:['ios-compose-outline','flashlight','integral','manage','send','android-menu'],
        visible:false,
        visible2:false,
        search: '',
        treeData: [],
        searchReault: [], // 查询结果数组
        searchReaultEl: [], // 查询结果对应el
        curentSearchIndex: 0, // 当前检索index
        searchTotal: 0, // 查询结果数量
        selfDefine:false,
        details:false,
        detailRows:{},
        items:columns.concat([]),
        columnsTotal:columns.length,
        lockItems:[],
        hiddenItems:[],
        indeterminate: true,
        checkAll: false,
        selectGroup:["menuCode","menuName","menuSelect","kindCode","parentName","menuUrl","kindName","orderNo","operater"],
        formItem: {
          menuName: '',
          parentCode: '',
          kindCode: ''
        },
        formItemMsg: {
          menuCode: '',
          menuName: '',
          parentCode: '',
          kindCode: '',
          menuArg: '',
          menuIcon: '',
          menuUrl: '',
          remark: '',
          kindType:'4'
        },
        kindTree: [],
        columns: columns,
        pageSizeOpts: [5,10,15,20],
        // pageHeight: null,
        tableDatalength: null,     
        treeHeight: null,
        currentRowIdx: null,
        currentRowData: null,
        currentSelectRow: [],
        addMenuMsg: false,
        advancedQuery:false
      }
    },
    components: {
      HPanel,
      HDatatablesearch
    },
    watch: {
      curentSearchIndex (curIndex, oldVal) {
        if (curIndex <= this.searchTotal && curIndex > 0 && this.searchReaultEl && this.searchReaultEl.length > 0) {
          this.searchReaultEl[curIndex - 1].style.background = '#a8d6fe'
          if (oldVal > 0) {
            this.searchReaultEl[oldVal - 1].style.background = ''
          }
        } 
      },
      addMenuMsg (val) {
        if (!val) {
          this.$refs.formItemMsg.resetFields()
          this.currentSelectRow = []
        }
      },
      tableDatalength (curIndex, oldVal) {
        if (this.tableDatalength >= 0) {
          this.treeHeight = document.getElementsByClassName('rightPage')[0].clientHeight - 32
        }
      }    
    },
    computed: {
      parentCodeList () {
        return this.treeData
      },
      ...mapGetters([
        'activeIndex',
        'fullScreen'
      ])
    },
    methods: {
      handlehiddenSearchGroup(){
        this.isShowSearchGroup = !this.isShowSearchGroup
      },
     //高级查询
      handleAdvancedSearch(){
        this.advancedQuery = !this.advancedQuery 
      },
      handleexportData(){
        this.$refs.datagrid.exportData()
      },
      handleselfdefines(){
        this.selfDefine = true
      },
      handleLock(index){
        this.lockItems.push(this.items[index])
        this.items.splice(index, 1)
      },
      handleremove(index){
        this.hiddenItems.push(this.items[index])
        this.items.splice(index, 1)
      },
      handleunlock(index){
        this.items.push(this.lockItems[index])
        this.lockItems.splice(index, 1)
      },
      handledisplayremove(index){
        this.hiddenItems.push(this.lockItems[index])
        this.lockItems.splice(index, 1)
      },
      handlehiddenlock(index){
        this.lockItems.push(this.hiddenItems[index])
        this.hiddenItems.splice(index, 1)
        this.columns[index].hiddenCol = false
      },
      resetAll(){
        this.lockItems = []
        this.items = this.columns.concat([])
        this.hiddenItems = []
      },
      cancel(){
        this.selfDefine = false
      },
      ok(){
        for(let i = 0; i < this.columns.length; i++){
            this.columns[i].hiddenCol = false
            this.columns[i].fixed = ''
        }
        for(let i = 0; i < this.columns.length; i++){
            let obj = this.columns[i];
            let num = obj.title;
            for(let j = 0; j < this.lockItems.length; j++){
                let aj = this.lockItems[j];
                let n = aj.title;
                if(n == num){
                    this.columns[i].fixed = 'left'
                    break;
                }
            }
        }
        for(let i = 0; i < this.columns.length; i++){
            let obj = this.columns[i];
            let num = obj.title;
            this.columns[i].hiddenCol = false
            for(let j = 0; j < this.hiddenItems.length; j++){
                let aj = this.hiddenItems[j];
                let n = aj.title;
                if(n == num){
                    this.columns[i].hiddenCol = true
                    break;
                }
            }
        }
        this.selfDefine = false
    },
    closeDetail(){
        this.details = false
    },
    checkAllGroupChange (currentValue) {
        this.columns[currentValue].hiddenCol = !this.columns[currentValue].hiddenCol
    },
    handlemultiple(){
        let that = this
        that.visible2 = !that.visible2
        let e = event || window.event;
        let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        let x = e.pageX || e.clientX + scrollX;
        let y = e.pageY || e.clientY + scrollY;
        document.getElementsByClassName('h-table-checkBox-container')[0].style.top = (y-100)+"px"
        document.getElementsByClassName('h-table-checkBox-container')[0].style.left = (x-283)+"px"
    },

      handlefullScreen () {
        if(this.fullScreen){
          this.$store.dispatch('unfullscreen')
        } else {
          this.$store.dispatch('fullscreen')
        }
        console.log(this.fullScreen)
      }
      
    },
    created () {
      // 监测右边表格数据条数，来自适应左边高度
      this.$on('successDatagridLoad', function () {
        this.tableDatalength = this.$refs.datagrid.tData.length
      })
    }
  }
</script>

<style>
  .h-search-group-bar{
    height: 10px;
  }
  .imgtoggle{
    position:absolute;
    clip:rect(100px 50px 20px);
  }
 .h-search-group-bar{
   display: flex;
   align-items:center;
   justify-content:center;
 }
  .h-table-search-icon{
    color: #c3cbd6
  }
  .h-table-search-icon:hover {
    color:#0275d8
  }
  .h-table-unfold-icon{
    color:#657180
  }
  .h-table-unfold-icon:hover{
    color:#0275d8
  }
  .h-table-type-search li:hover{
    color:#0275d8
  }
  .h-table-type-footer span a{
    color: #666
  }
    .h-table-type-footer span:hover{
    color:#0275d8
  }
  .h-table-type-footer span:hover a{
    color:#0275d8
  }

  .displaygroupleft{
    margin: 5px;
    padding-left: 10px;
    border-left: 2px solid #3da1fc;
  }
  .displaygroupright{
    margin: 5px;
    padding-left: 10px;
    color: #f78c68;
  }
  .displaygroup{
    border: 1px dashed #F7AB40;
    width:20%;
    margin:5px 10px;
    padding:2px 5px;
    border-radius: 5px;
  }
  .displaygroup:hover{
    background-color: #F4ECE1;
    border: 1px solid #F7AB40;
  }
  .itemSelectGroup{
    border: 1px dashed #b9d9f2;
    width:20%;
    margin:5px 10px;
    padding:2px 5px;
    border-radius: 5px;
  }
  .itemSelectGroup:hover{
    background-color: #ebf4fa;
    border: 1px solid #b9d9f2;
  }

  .itemSelectGroup a {
    color: #657180;
  }
  .itemSelectGroup:hover a {
    color: #0275d8;
  }
  .hiddengroup{
    width:20%;
    margin:5px 10px;
    padding:2px 5px;
    border-radius: 5px;
    border:none;
  }
  .hiddengroup a{
    display: none;
  }
  .hiddengroup:hover{
    background-color: #b3b3b3;
  }

  .hiddengroup:hover a{
    display: inline-block;
  }
  .h-msg-wrap{
    display:flex;
    align-items:center;
    width:100%;
    flex-wrap: wrap
  }
  .h-msg-group{
    display:inline-flex;
    width:100%;
    align-items:center;
  }
  .h-msg-group-header{
    display:inline-block;
    width:60%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .h-msg-icon-group{
    float:right;
    margin-left:10px;
  }
  .h-msg-hidden-item{
    display:inline-block;
    width:60%;
    height:100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .h-msg-hidden-icon-group{
    float:right;
    margin-left:40px;
  }
  .h-details-wrap{
    display:flex;
    align-items:center;
    width:100%;
    flex-wrap: wrap;
  }
  .h-details-contains{
    width:30%;
    margin:5px 10px;
    padding:2px 5px;
  }
  .h-details-box{
    display:flex;
    align-items:center;
  }
  .h-details-key{
    display:flex;
    align-items:center; 
    width:130px;
    height:30px;
    margin-right:10px;
    background:#f5f5f5;
    padding-left:5px;
  }
  .h-details-span{
    display:inline-block;
    width:130px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .h-details-item{
    display:flex;
    align-items:center;
    width:200px;
    height:30px;
    background:#f5f5f5;
    padding-left:5px;
  }
  .h-table-checkBox-container{
    position:absolute;
    padding: 5px 0px;
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 0 0 8px #ccc;
    height:200px;
    width: 150px;
    overflow:auto;
    z-index:9999;
  }
  .h-table-checkBox-group{
    padding:5px 20px;
  }
  .h-table-checkBox-group:hover{
    background: rgb(243, 243, 243);
  }
  .h-table-checkBox{

  }
  .h-table-checkBox-item{
    display: inline-block;
    margin-left: 10px;
  }
</style>


