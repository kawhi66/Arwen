<template>
  <div class="standardList" style="margin-top:10px;">
    <div class="card card-wider-padding card-padding-transition">
      <div class="card-body">
        <h-row>
          <h-col span="8">
            <div class="headerInfo" style="border-right: solid 1px #ccc;">
              <span>我的待办</span><p>8个任务</p><em></em>
            </div>
          </h-col>
          <h-col span="8">
            <div class="headerInfo" style="border-right: solid 1px #ccc;">
              <span>本周任务平均处理时间</span><p>32分钟</p><em></em>
            </div>
          </h-col>
          <h-col span="8">
              <div class="headerInfo">
                <span>本周完成任务数</span><p>24个任务</p>
              </div>
          </h-col>
        </h-row>
      </div> 
    </div>
      <div class="card listCard card-wider-padding card-padding-transition" style="margin-top: 24px;">
        <div class="card-head">
          <div class="card-head-wrapper" style="display: block">
            <h-panel>
              <h-form cols="3" :label-width="100">
                <h-form-item><div class="card-head-title-t">标准列表</div></h-form-item>
                <h-form-item>
                  <h-button-group>
                      <h-button type="ghost">全部</h-button>
                      <h-button type="ghost">进行中</h-button>
                      <h-button type="ghost">等待中</h-button>
                  </h-button-group>
                </h-form-item>
                <h-form-item style="margin-left:-140px;">
                  <h-input></h-input>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
        </div>
          <h-row style="border-bottom: 1px solid rgb(232, 232, 232);">
            <h-col>
              <div class="list-item">
                <div class="list-item-meta">
                  <div class="list-item-meta-avatar">
                    <span class="avatar avatar-lg avatar-square avatar-image">
                      <img src="../../../assets/pic1.png" alt="">
                    </span>
                  </div>
                  <div class="list-item-meta-content">
                    <h4 class="list-item-meta-title"><a href="#">Alipay</a></h4>
                    <div class="list-item-meta-description">那是一种内在的东西， 他们到达不了，也无法触及的</div>
                  </div>
                </div>
                <div style="width:250px;">
                    <div style="float:left">
                      <span>Owner</span><p>付小小</p>
                    </div>
                    <div class="listContentItem_desc" style="float:left;margin-left:30px;">
                      <span>开始时间</span><p>2018-05-07 10:00</p>
                    </div>
                    <div class="listContentItem_desc">
                       <h-progress :percent="25"></h-progress>
                    </div>
                </div>
                <ul class="list-item-action">
                  <li><a>编辑</a><em class="list-item-action-split"></em></li>
                  <li><a class="dropdown-trigger">更多 <i class="anticon anticon-down"></i></a></li>
                </ul>
              </div>
            </h-col>
          </h-row>
          <h-row style="border-bottom: 1px solid rgb(232, 232, 232);">
            <h-col>
              <div class="list-item">
                <div class="list-item-meta">
                  <div class="list-item-meta-avatar">
                    <span class="avatar avatar-lg avatar-square avatar-image">
                      <img src="../../../assets/pic2.png" alt="">
                    </span>
                  </div>
                  <div class="list-item-meta-content">
                    <h4 class="list-item-meta-title"><a href="#">Alipay</a></h4>
                    <div class="list-item-meta-description">希望是一个好东西，也许是最好的，好东西是不会消亡的</div>
                  </div>
                </div>
                <div style="width:250px;">
                    <div style="float:left">
                      <span>Owner</span><p>曲丽丽</p>
                    </div>
                    <div class="listContentItem_desc" style="float:left;margin-left:30px;">
                      <span>开始时间</span><p>2018-05-07 08:00</p>
                    </div>
                    <div class="listContentItem_desc">
                       <h-progress :percent="65" status="wrong"></h-progress>
                    </div>
                </div>
                <ul class="list-item-action">
                  <li><a>编辑</a><em class="list-item-action-split"></em></li>
                  <li><a class="dropdown-trigger">更多 <i class="anticon anticon-down"></i></a></li>
                </ul>
              </div>
            </h-col>
          </h-row>
          <h-row style="border-bottom: 1px solid rgb(232, 232, 232);">
            <h-col>
              <div class="list-item">
                <div class="list-item-meta">
                  <div class="list-item-meta-avatar">
                    <span class="avatar avatar-lg avatar-square avatar-image">
                      <img src="../../../assets/pic3.png" alt="">
                    </span>
                  </div>
                  <div class="list-item-meta-content">
                    <h4 class="list-item-meta-title"><a href="#">Hundsun Design</a></h4>
                    <div class="list-item-meta-description">生命就像一盒巧克力，结果往往出人意料</div>
                  </div>
                </div>
                <div style="width:250px;">
                    <div style="float:left">
                      <span>Owner</span><p>林东东</p>
                    </div>
                    <div class="listContentItem_desc" style="float:left;margin-left:30px;">
                      <span>开始时间</span><p>2018-05-07 06:00</p>
                    </div>
                    <div class="listContentItem_desc">
                       <h-progress :percent="92"></h-progress>
                    </div>
                </div>
                <ul class="list-item-action">
                  <li><a>编辑</a><em class="list-item-action-split"></em></li>
                  <li><a class="dropdown-trigger">更多 <i class="anticon anticon-down"></i></a></li>
                </ul>
              </div>
            </h-col>
          </h-row>
          <h-row style="border-bottom: 1px solid rgb(232, 232, 232);">
            <h-col>
              <div class="list-item">
                <div class="list-item-meta">
                  <div class="list-item-meta-avatar">
                    <span class="avatar avatar-lg avatar-square avatar-image">
                      <img src="../../../assets/pic4.png" alt="">
                    </span>
                  </div>
                  <div class="list-item-meta-content">
                    <h4 class="list-item-meta-title"><a href="#">Hundsun Design Pro</a></h4>
                    <div class="list-item-meta-description">城镇中有那么多的酒馆，她却偏偏走进了我的酒馆</div>
                  </div>
                </div>
                <div style="width:250px;">
                    <div style="float:left">
                      <span>Owner</span><p>周星星</p>
                    </div>
                    <div class="listContentItem_desc" style="float:left;margin-left:30px;">
                      <span>开始时间</span><p>2018-05-07 04:00</p>
                    </div>
                    <div class="listContentItem_desc">
                       <h-progress :percent="56"></h-progress>
                    </div>
                </div>
                <ul class="list-item-action">
                  <li><a>编辑</a><em class="list-item-action-split"></em></li>
                  <li><a class="dropdown-trigger">更多 <i class="anticon anticon-down"></i></a></li>
                </ul>
              </div>
            </h-col>
          </h-row>
          <h-row style="border-bottom: 1px solid rgb(232, 232, 232);">
            <h-col>
              <div class="list-item">
                <div class="list-item-meta">
                  <div class="list-item-meta-avatar">
                    <span class="avatar avatar-lg avatar-square avatar-image">
                      <img src="../../../assets/pic5.png" alt="">
                    </span>
                  </div>
                  <div class="list-item-meta-content">
                    <h4 class="list-item-meta-title"><a href="#">Bootstrap</a></h4>
                    <div class="list-item-meta-description">那时候我只会想自己想要什么，从不想自己拥有什么</div>
                  </div>
                </div>
                <div style="width:250px;">
                    <div style="float:left">
                      <span>Owner</span><p>吴加好</p>
                    </div>
                    <div class="listContentItem_desc" style="float:left;margin-left:30px;">
                      <span>开始时间</span><p>2018-05-07 02:00</p>
                    </div>
                    <div class="listContentItem_desc">
                       <h-progress :percent="65" status="wrong"></h-progress>
                    </div>
                </div>
                <ul class="list-item-action">
                  <li><a>编辑</a><em class="list-item-action-split"></em></li>
                  <li><a class="dropdown-trigger">更多 <i class="anticon anticon-down"></i></a></li>
                </ul>
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
  </div>
</template>
<script>
  import HPanel from '@/components/HPanel'
  import HDatagrid from '@/components/HDatagrid'
  import { post, getDicts, getKindTree } from '@/api/bizApi/commonUtil'  
  export default {
    name: 'curpage',
    data () {
      return {
        
      }
    },
    components: {
      HPanel,
      HDatagrid
    },
    methods: {
      
    }
  }
</script>