<template>
    <div class="h-tree-search" ref="leftPage">
      <div class="h-tree-search-input">
        <h-input v-model="search"
                @on-enter="handleSearch"
                @on-change="handleSearch" 
                @keyup.up.native.stop="handleSearchPrev"
                @keyup.down.native.stop="handleSearchNext"
                ref = "treeSearch">
            <div slot="append">
              <h-icon name="search" @click.native.stop="handleSearch"></h-icon>
            </div>
        </h-input>
      </div>
      <h-tree :data="treeData" :render="renderSearchTree" ref='tree' @on-select-change="handleTreeSelect" :style="{height: treeHeight + 'px',overflow: 'auto'}"></h-tree>
    </div>
</template>
<script>

  import { post, getDicts, getKindTree } from '@/api/bizApi/commonUtil'  
  export default {
    name: 'curpage',
    data () {
      return {
        search: '',
        treeData:[],
        searchReault: [], // 查询结果数组
        searchReaultEl: [], // 查询结果对应el
        curentSearchIndex: 0, // 当前检索index
        searchTotal: 0, // 查询结果数量
        treeHeight: null,
        formItem:{
          menuName: '',
          parentCode: '',
          kindCode: ''
        }
      }
    },
    props:{
      url:{
        type:String
      }
    },

    methods: {
      // 输入框输入值进行查询
      handleSearch () {
        this.searchReault = []
        this.filterSearch(this.treeData)
        this.searchReault = this.getSearchNodes()
        if (this.searchReault.length > 0) {
          this.searchTotal = this.searchReault.length
          this.$nextTick(function () {
            this.searchReaultEl = this.$refs.tree.$el.getElementsByClassName('h-tree-title-search')
            this.curentSearchIndex = 1
          })
        }
      },
      // 过滤查询值
      filterSearch (arr) {
        let that = this
        let isExpand = false 
        for (let item of arr){
          if (this.search != '' && item.title.indexOf(this.search) >= 0) {
            that.$set(item, 'search', true)
            isExpand = true
          } else {
            that.$set(item, 'search', false)
          }
          if (item.children && item.children.length > 0) {
            if(this.filterSearch(item.children)) {
              that.$set(item, 'expand', true)
              isExpand = true
            } else {
              that.$set(item, 'expand', false)
            }
          }
        }
        return isExpand
      },
      // 获取左边树结构
      getLeftTreeList () {
        // post({}, this.url).then(res => {
        //   if (res && res.data) {
        //     this.treeData = res.data
        //   }
        // }).catch(error => {
        //   this.$hMessage.error("网络通信失败！" + error)
        // })
        this.treeData = [{
            "url": null,
            "parentId": "BIZFRAME",
            "expand": true,
            "id": "bizMenu",
            "title": "业务查询",
            "icon": "home",
            "children": [
              {
                "url": null,
                "parentId": "bizMenu",
                "expand": true,
                "id": "bizSysManager",
                "title": "份额资料查询",
                "icon": "home",
                "children": null
              },
              {
                "url": null,
                "parentId": "bizMenu",
                "expand": true,
                "id": "bizSysManager",
                "title": "份额信息查询",
                "icon": "home",
                "children": null
              },
              {
                "url": null,
                "parentId": "bizMenu",
                "expand": true,
                "id": "bizSysManager",
                "title": "产品信息查询",
                "icon": "home",
                "children": null
              },
              {
                "url": null,
                "parentId": "bizMenu",
                "expand": true,
                "id": "bizSysManager",
                "title": "交易通用查询",
                "icon": "home",
                "children": null
              },
              {
                "url": null,
                "parentId": "bizMenu",
                "expand": true,
                "id": "bizSysManager",
                "title": "CRS查询",
                "icon": "home",
                "children": null
              },
              {
                "url": null,
                "parentId": "bizMenu",
                "expand": true,
                "id": "bizSysManager",
                "title": "账户资金查询",
                "icon": "home",
                "children": null
              },
              {
                "url": null,
                "parentId": "bizMenu",
                "expand": true,
                "id": "bizSysManager",
                "title": "分红信息查询",
                "icon": "home",
                "children": null
              },
              {
                "url": null,
                "parentId": "bizMenu",
                "expand": true,
                "id": "bizSysManager",
                "title": "资金清单查询",
                "icon": "home",
                "children": null
              },
              {
                "url": null,
                "parentId": "bizMenu",
                "expand": true,
                "id": "bizSysManager",
                "title": "份额对账查询",
                "icon": "home",
                "children": null
              },
              {
                "url": null,
                "parentId": "bizMenu",
                "expand": true,
                "id": "bizSysManager",
                "title": "风控问卷调查查询",
                "icon": "home",
                "children": null
              },
              {
                "url": null,
                "parentId": "bizMenu",
                "expand": true,
                "id": "bizSysManager",
                "title": "警示信息查询",
                "icon": "home",
                "children": null
              },
              {
                "url": null,
                "parentId": "bizMenu",
                "expand": true,
                "id": "bizSysManager",
                "title": "赎回转购异常查询",
                "icon": "home",
                "children": null
              },
              {
                "url": null,
                "parentId": "bizMenu",
                "expand": true,
                "id": "bizSysManager",
                "title": "定期定额协议查询",
                "icon": "home",
                "children": null
              },
              {
                "url": null,
                "parentId": "bizMenu",
                "expand": true,
                "id": "bizSysManager",
                "title": "电子合同查询",
                "icon": "home",
                "children": null
              },
              {
                "url": null,
                "parentId": "bizMenu",
                "expand": true,
                "id": "bizSysManager",
                "title": "档案查询",
                "icon": "home",
                "children": null
              }
            ]
          }]
      },

      handleSearchPrev () {
        if (this.curentSearchIndex > 1) {
          this.curentSearchIndex = this.curentSearchIndex - 1
        } else {
          this.$hMessage.info('已经是第一个了')
        }
      },
      handleSearchNext () {
        if (this.curentSearchIndex < this.searchTotal) {
          this.curentSearchIndex = this.curentSearchIndex + 1
        } else {
          this.$hMessage.info('已经是最后一个了')
        }
      },
      // 重置查询结果
      resetSearch () {
        if (this.searchTotal > 0 && this.curentSearchIndex > 0) {
          this.searchReaultEl[this.curentSearchIndex].style.background = ''
        }
      },
      handleTreeSelect (arr) {
        // if (this.searchTotal > 0 && this.curentSearchIndex > 0) {
        //   this.searchReaultEl[this.curentSearchIndex-1].style.background = ''
        // }
        //this.formItem.parentCode = this.$refs.tree.getSelectedNodes()[0].id
        //console.log(arr[0].nodeKey)
        this.handleMenuSearch(arr)
      },
      // 重新渲染
      renderSearchTree (h, { root, node, data }) {
        return h("span", {
          class: {
            'h-tree-title': true,
            'h-tree-title-search': data.search,
            'h-tree-title-selected': data.selected,
            'h-tree-title-filterable': data.filterable
          },
          on: {
            click: () => {
              this.handleRenderClick(data)
            }
          }
        },[
          h('h-icon',{
            props: {
              name: data.children ? 'folder' : 'document-text'
            }
          }),
          h('span',data.title)
        ])
      },
      // 重新渲染--点击
      handleRenderClick (data) {
        if (data.disabled) return;
        this.$refs.tree.handleSelect(data.nodeKey)
      },
      // 获取查询节点
      getSearchNodes () {
        return this.$refs.tree.flatState.filter(obj => obj.node.search).map(obj => obj.node);
      },
      // 获取系统菜单类别
      getMenuType () {
        // 5代表子系统
        getKindTree('5').then(res => {
          if (res && res.data && res.data.length > 0) {
            this.kindTree = res.data          
          }
        })
      },
      // 查询
      handleMenuSearch (arr) {
        this.$emit('handleTreeClick',arr[0].nodeKey)
      },
      // 下拉树点击时设置id,通用
      setSelectTreeId (event, objName, prop) {
        if(event && event.length > 0) {
          this[objName][prop] = event[0].id
        }
      }
    },
    created(){
      this.getLeftTreeList();
    }
  }
</script>
<style scoped>
  /* .h-tree-search {
    padding-right: 15px !important;
  } */
  /* .h-tree-search-input{
    display: flex;
    align-items:center;
  }
  .h-remove-bar{
    display: flex;
    align-items:center;
    justify-content: center;
    margin:0 5px 0 5px; 
  } */
</style>