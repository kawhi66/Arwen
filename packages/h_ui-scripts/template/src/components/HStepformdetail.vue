<template>
    <h-form :model="formItem" :label-width="100">
        <div v-show="isSure" class="alert alert-info" style="margin-bottom: 24px;">
            <i class="anticon anticon-info-circle alert-icon"></i>
            <span class="alert-message">确认转账后，资金将直接打入对方账户，无法退回。</span>
            <span class="alert-description"></span>
            <a class="alert-close-icon" @click="handleTooltip">
                <h-icon name="android-close" color = "rgba(0,0,0,.45)" size="15"></h-icon>
            </a>
        </div>
        <h-form-item label="付款账户：">
            <span>hundsun-design@alipay.com</span>
        </h-form-item>
        <h-form-item label="收款账户：">
            <span>支付宝</span>
        </h-form-item>
        <h-form-item label="收款人姓名：">
            <span>Alex</span>
        </h-form-item>
        <h-form-item label="转账金额：">
            <span>500 (伍佰元整)</span>
        </h-form-item>
        <h-form-item label="支付密码：">
            <h-input type="password" value="1234567">
                <h-icon name="people" slot="prepend"></h-icon>
            </h-input>
        </h-form-item>
        <h-form-item>
            <h-button type="primary" @click="showNextComp" :loading="loading">提交</h-button>
            <h-button type="ghost" @click="showPreviousComp">上一步</h-button>
        </h-form-item>
    </h-form>
</template>

<script>
    export default {
        data () {
            return {
                isSure:'ture',
                loading:false,
                currentIndex:this.current
            }
        },
        props:{
            current:{
                type:Number,
                default:0
            }
        },
        methods:{
            showNextComp () {
                if (this.currentIndex == 2) {
                    this.currentIndex = 0;
                } else {
                    this.currentIndex += 1;
                }
                this.$emit("onClickItem2",this.currentIndex)
                
            },
            showPreviousComp () {
                if (this.currentIndex == 0) {
                    this.currentIndex = 2;
                } else {
                    this.currentIndex -= 1;
                }
                this.$emit("onClickItem2",this.currentIndex)
            },
            handleTooltip(){
                    this.isSure = false;
            }
        }
    }
</script>

<style>
.alert-info {
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
}

.alert {
    font-family: "Monospaced Number","Chinese Quote",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: rgba(0,0,0,.65);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    position: relative;
    padding: 8px 15px 8px 37px;
    border-radius: 4px;
}

.alert-icon {
    top: 12.5px;
    left: 16px;
    position: absolute;
}

.alert-close-icon {
    font-size: 12px;
    position: absolute;
    right: 16px;
    top: 8px;
    line-height: 22px;
    overflow: hidden;
    cursor: pointer;
}
.alert-close-icon .anticon-cross {
    color: rgba(0,0,0,.45);
    -webkit-transition: color .3s;
    transition: color .3s;
}

</style>
