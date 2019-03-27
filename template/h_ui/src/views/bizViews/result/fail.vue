<template>
  <div>
    <div class="content"> 
        <div class="card card-wider-padding"> 
          <div class="card-body"> 
            <div class="result" style="margin-top: 48px; margin-bottom: 16px;"> 
              <h-icon name="delete_fill" size="72" color="#f5222d"></h-icon> 
              <div class="title">提交失败</div> 
              <div class="description">请核对并修改以下信息后，再重新提交。</div> 
              <div class="extra"> 
                <div style="font-size: 16px;font-weight: 500; margin-bottom: 16px;">您提交的内容有如下错误：</div>
                <div style="margin-bottom: 16px;"><h-icon name="delete_fill" style="color:red"></h-icon>您的账户已被冻结<a style="margin-left: 16px;">立即解冻 <h-icon name="enter"></h-icon></a></div>
                <div><h-icon name="delete_fill" style="color:red"></h-icon>您的账户还不具备申请资格<a style="margin-left: 16px;">立即升级 <h-icon name="enter"></h-icon></a></div>
               
              </div> 
              <h-row> 
                <h-button type="primary"><span>返回修改</span></h-button> 
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