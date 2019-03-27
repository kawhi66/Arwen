<template>
    <div>
        <div class="pageHeader">
            <div class="detail_wrap">
                <div class="main_container">
                    <div class="row_box">
                        <h1 class="title_detail">分布表单</h1>
                    </div>
                    <div class="row_box">
                        <div class="content_detail">将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pageContent">
          <div class="card card-wider-padding">
            <div class="card-head">
                <h-steps :current="current" class="card-head-step">
                    <h-step title="填写转账信息"></h-step>
                    <h-step title="确认转账信息"></h-step>
                    <h-step title="完成"></h-step>
                </h-steps>
            </div>
            <div class="card-body">
              <div class="card-body-form">
                <div v-if="current == 0">
                  <h-stepformpay :current="current" @onClickItem1="handleClick"></h-stepformpay>
                </div>
                <div v-else-if="current == 1">
                  <h-stepformdetail :current="current" @onClickItem2="handleClick"></h-stepformdetail>
                </div>
                <div v-else>
                  <h-stepformresult :current="current" @onClickItem3="handleClick"></h-stepformresult>
                </div>
              </div>
              <div v-if="current == 0">
                <div class="divider divider-horizontal" style="margin: 10px 0px 24px;"></div>
                <div class="desc_detail">
                    <h3>说明</h3>
                    <h4>转账到支付宝账户</h4>
                    <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
                    <h4>转账到银行卡</h4>
                    <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
                </div>
              </div>

            </div>
          </div>
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
    import HStepformpay from '@/components/HStepformpay'
    import HStepformdetail from '@/components/HStepformdetail'
    import HStepformresult from '@/components/HStepformresult'
    export default {
        data () {
            return {
              current: 0
            }
        },
        components:{
            HStepformpay,
            HStepformdetail,
            HStepformresult
        },
        methods:{
            handleClick(parm){
                this.current = parm;
            }
        }
    }
</script>