<template>
  <div>
    <div class="content"> 
        <div class="card card-wider-padding"> 
          <div class="card-body"> 
            <div class="result" style="margin-top: 48px; margin-bottom: 16px;"> 
              <h-icon name="success_fill" size="72" color="#52c41a"></h-icon> 
              <div class="title">提交成功</div> 
              <div class="description">提交结果页用于反馈一系列操作任务的处理结果， 如果仅是简单操作，使用 Message 全局提示反馈即可。 本文字区域可以展示简单的补充说明，如果有类似展示 “单据”的需求，下面这个灰色区域可以呈现比较复杂的。</div> 
              <div class="extra"> 
                <div style="font-size: 16px; color: rgba(0, 0, 0, 0.85098); font-weight: 500; margin-bottom: 20px;">项目名称</div> 
                <h-row style="margin-bottom: 16px;"> 
                  <h-col span="8"><span style="color: rgba(0, 0, 0, 0.85098);">项目 ID：</span>23421</h-col> 
                  <h-col span="6"><span style="color: rgba(0, 0, 0, 0.85098);">负责人：</span>曲丽丽</h-col> 
                  <h-col span="10"><span style="color: rgba(0, 0, 0, 0.85098);">生效时间：</span>2016-12-12 ~ 2017-12-12</h-col> 
                </h-row> 
                <h-steps :current="1">
                    <h-step title="创建项目" icon="person-add"></h-step>
                    <h-step title="部门初审" icon="camera"></h-step>
                    <h-step title="财务复核" icon="email"></h-step>
                </h-steps>
              </div> 
              <h-row> 
                <h-button type="primary"><span>返回列表</span></h-button> 
                <h-button><span>查看项目</span></h-button> 
                <h-button><span>打 印</span></h-button> 
              </h-row> 
            </div> 
          </div> 
        </div> 
      </div>
      <!--底部-->
      <div class="layout-footer" style="padding: 0px;"> 
        <div class="globalFooter"> 
          <div class="copyright">Copyright <i class="anticon anticon-copyright"></i> 2018 恒生电子研发中心技术研发部出品</div> 
        </div> 
      </div> 
  </div>
</template>