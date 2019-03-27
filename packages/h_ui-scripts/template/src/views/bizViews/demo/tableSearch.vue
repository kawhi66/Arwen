<template>
  <div>
    <h-row>
        <h-col :span="leftSpan" class="h-tree-search-wrapper" v-if="isShowTree" v-show="!fullScreen">
          <h-datatree :url="url1" @handleTreeClick="handleTreeClick"></h-datatree>
        </h-col>
        <h-col span="1" class="h-tree-remove-bar" v-show="!fullScreen">
          <h-tooltip content="折叠面板" placement="top-start">
            <a href="#">
              <h-icon name="ios-settings-strong" color="#666" @click.native.stop="handleRemoveBar"></h-icon>
            </a>
          </h-tooltip>
        </h-col>
        <h-col :span="rightSpan">
          <h-datagroup :url2="url2" ref="rightPage">
          </h-datagroup>
        </h-col>
    </h-row>
  </div>
</template>
<script>
  import HDatatree from '@/components/HDatatree'
  import HDatagroup from '@/components/HDatagroup'
  import { mapGetters } from 'vuex'
  export default {
    name: 'curpage',
    data () {
      return {
        url1:'/getMenuList',
        url2:'/getTabledatatest',
        isShowTree:true,
        leftSpan:4,
        rightSpan:19
      }
    },
    components: {
      HDatatree,
      HDatagroup,
    },
    watch: {
      fullScreen (val) {
        if (val) {
          this.rightSpan = 24
        }
      }
    },
    computed: {
       ...mapGetters([
        'fullScreen'
      ]),
      parentCodeList () {
        return this.treeData
      }
    },
    methods: {
      handleRemoveBar(e){
        if(this.isShowTree){
          this.isShowTree = !this.isShowTree
          this.rightSpan = 23
        }else{
          this.isShowTree = !this.isShowTree
          this.rightSpan = 19
        }
      },
      handleTreeClick(val){
        this.$refs.rightPage.$refs.datagrid.dataChange(1)
      }
    },
    created () {

    }
  }
</script>
<style>
  .h-tree-remove-bar{
    padding:5px 15px 0 0;
    width: 25px;
  }
  .removeTreeBar {
    position: absolute;
    left: 20px;
    top: 100px;
    width: 5px;
  }
  .h-tree-search-wrapper {
    padding-right: 15px !important;
  }
  .h-tree-search-wrapper .h-btn {
    padding: 3px 10px;
  }
  .h-tree-search-wrapper .h-btn .h-icon {
    font-size: 13px;
  }
  .h-tree-search-wrapper .h-btn > .h-icon + span{
    margin-left: 0;
  }
  .h-tree-title-search {
    color: rgb(51, 51, 51);
    font-weight: bold;
  }

  .h-select-dropdown ul .h-dropdown-menu {
    min-width: 20px;
  }

</style>