<template>
  <div>
    <h-row :gutter="20">
      <h-col span="8" >
        <h-panel title="我的应用一" class="demo1">
          <div class="title text-center">
            <span>应用数量</span><h3>1</h3>
          </div>
          <div class="title text-center">
            <span>未发布</span><h3>0</h3>
            <span>成功</span><h3>0</h3>
            <span>失败</span><h3>1</h3>
          </div>
        </h-panel>
      </h-col>
      <h-col span="8">
        <h-panel title="我的应用二" class="demo2">
          <div class="title text-center">
            <span>发布物</span><h3>13</h3>
          </div>
          <div class="title text-center">
            <span>产品</span><h3>13</h3>
            <span>补丁包</span><h3>0</h3>
          </div>
        </h-panel>
      </h-col>
      <h-col span="8">
        <h-panel title="我的应用三" class="demo3">
          <div class="title text-center">
            <span>最新一月发布</span><h3>0</h3>
          </div>
          <h-row class="title text-center" style="height: 59px">
            <h-col span="4" :offset="5">
              <span>成功率</span>
            </h-col>
            <h-col span="10">
              <h-progress></h-progress>
            </h-col>
          </h-row>
        </h-panel>
      </h-col>
      <h-col span="16" style="margin-top: 10px;">
        <h-panel class="demo4" title="用户引导" icon="paper-airplane">
          <a class="create">
            <h-icon name="editor"></h-icon><div class="nav">创建应用</div>
          </a>
          <p style="text-indent:2em;margin:15px 0;">通过引导步骤实现应用的全新部署，包括安装包上传、应用创建、服务器配置、参数配置和部署</p>
        </h-panel>
      </h-col>
      <h-col span="8" style="margin-top: 10px;">
        <h-panel title="日志" class="demo5" icon="manage">
          <ul class="list">
            <li v-for="(item, index) in list" class="clearfix">
              <div class="left disInlineBlock">
                <h-icon name="android-textsms"></h-icon>
                <span>{{item.message}}</span><br>
                <h-icon name="people_fill"></h-icon>
                <span>{{item.author}}</span>
              </div>
              <div class="right disInlineBlock" style="line-height: 32px">
                <span>{{item.time}}</span>
              </div>
            </li>
          </ul>
        </h-panel>
      </h-col>
    </h-row>
  </div>
</template>
<script>
  import HPanel from '@/components/HPanel'
  export default {
    name: 'mainIndex',
    data () {
      return {
        list: [{
          message: '发布物',
          author: 'admin',
          time: '2017-11-23'
        },{
          message: '发布物',
          author: 'admin',
          time: '2017-11-23'
        },{
          message: '发布物',
          author: 'admin',
          time: '2017-11-23'
        },{
          message: '发布物',
          author: 'admin',
          time: '2017-11-23'
        },{
          message: '发布物',
          author: 'admin',
          time: '2017-11-23'
        },{
          message: '发布物',
          author: 'admin',
          time: '2017-11-23'
        },{
          message: '发布物',
          author: 'admin',
          time: '2017-11-23'
        },{
          message: '发布物',
          author: 'admin',
          time: '2017-11-23'
        }]
      }
    },
    components:{
      HPanel
    }
  }
</script>
<style>

</style>