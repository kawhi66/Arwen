<template>
    <div>
        <div class="pageHeader">
            <div class="detail_wrap">
                <div class="main_container">
                    <div class="row_box">
                        <h1 class="title_detail">基础表单</h1>
                    </div>
                    <div class="row_box">
                        <div class="content_detail">有时候会遇到下拉选择返回的数据比较大，一次性渲染时会很卡的情况，我们select提供了监听滚动条事件，来请求后台功能，以下是实现例子。</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pageContent">
            <div class="card card-wider-padding">
                <div class="card-body">
                    <h-form :model="formItem" :label-width="100" cols="1">
                        <h-form-item label="大数据下拉实现">
                          <h-tooltip content="滚动条滚动底部会去后台请求数据">
                              <h-select v-model="model" style="width:300px" @on-scroll='selectScroll'>
                                <h-option v-for="item in data" :value="item.code" :key="item.code">{{ item.text }}</h-option>
                              </h-select>
                          </h-tooltip>
                        </h-form-item>
                    </h-form>
                </div>
            </div>
        </div>
      <!--底部-->
      <div class="layout-footer"> 
        <div class="globalFooter"> 
          <div class="copyright">Copyright <i class="anticon anticon-copyright"></i> 2018 恒生电子研发中心技术研发部出品</div> 
        </div> 
      </div>
      <h-spin size="large" fix v-if="spinShow">正在加载数据...</h-spin> 
    </div>
</template>
<script>
import {
  get
} from "@/api/bizApi/commonUtil";
export default {
  data() {
    return {
      model:'',
      column:[
        {
          title: '编码',
          key: 'code',
          width:400,
        },
        {
          title: '省份',
          key: 'text',
        }],
      data:[],
      pageNo:1,
      pageNo1:1,
      pageSize:50,
      canDrag:true,
      canPage:true,
      spinShow:false
    }
  },  
  methods: {
    selectScroll(num){
      if (num<=1 && this.canPage) {
        this.spinShow = true;
        this.canPage = false;
        this.pageNo1++;
        let params ={
          pageNo:this.pageNo1,
          pageSize:this.pageSize
        }
        get(params,'http://118.31.148.129:8080/demo/demo/dict/bigDictList.json').then(res=>{
          this.data = this.data.concat(res.data);
          this.canPage = true;
          this.spinShow = false;
        }).catch(error=>{
          this.$hMessage.error('网络通信失败,服务器异常');
        });
      }
    }
  },
  created() {
    let params ={
      pageNo:this.pageNo,
      pageSize:this.pageSize
    }
    get(params,'http://118.31.148.129:8080/demo/demo/dict/bigDictList.json').then(res=>{
     
      this.data = res.data;
    }).catch(error=>{
      this.$hMessage.error('网络通信失败,服务器异常');
    });
   
  }
};

</script>