<template>
    <div class="result_wrap result_container">
        <div class="icon_container">
            <h-icon name="android-done" size="100" color="#52c41a"></h-icon>
        </div>
        <div class="title_detail">操作成功</div>
        <div class="description_detail">预计两小时内到账</div>
        <div class="extra_box">
            <div class="information_item">
            <div class="row">
                <div class="col-8 label_detail">付款账户：</div>
                <div class="col-16">hundsun-design@alipay.com</div>
            </div>
            <div class="row">
                <div class="col-8 label_detail">收款账户：</div>
                <div class="col-16">test@example.com</div>
                </div>
            <div class="row">
                <div class="col-8 label_detail">收款人姓名：</div>
                <div class="col-16">Alex</div>
            </div>
            <div class="row">
                <div class="col-8 label_detail">转账金额：</div>
                <div class="col-16">
                <span>500</span> 元
                </div>
            </div>
            </div>
        </div>
        <div class="actions_box">
            <h-button type="primary" @click="showParentComp">再转一笔</h-button>
            <h-button type="ghost">查看账单</h-button>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
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
            showParentComp () {
                if (this.currentIndex == 2) {
                    this.currentIndex = 0;
                } else {
                    this.currenindext += 1;
                }
                this.$emit("onClickItem3",this.currentIndex)

            }
        }
    }
</script>

<style>
.result_wrap {
    text-align: center;
    width: 72%;
    margin: 0 auto;
}

.result_container {
    margin: 0 auto;
    max-width: 560px;
    padding: 24px 0 8px;
}

.result_wrap .icon_container {
    font-size: 72px;
    line-height: 72px;
    margin-bottom: 24px;
}

.result_wrap .icon_container>.success___2q7O4 {
    color: #52c41a;
}

.result_wrap .title_detail {
    font-size: 24px;
    color: rgba(0,0,0,.85);
    font-weight: 500;
    line-height: 32px;
    margin-bottom: 16px;
}

.result_wrap .description_detail {
    font-size: 14px;
    line-height: 22px;
    color: rgba(0,0,0,.45);
    margin-bottom: 24px;
}

.result_wrap .extra_box {
    background: #fafafa;
    padding: 24px 40px;
    border-radius: 2px;
    text-align: left;
    width:506px;
    height: 200px;
    margin-left: -70px;
}

.information_item {
    line-height: 22px;
}

.information_item .row:not(:last-child) {
    margin-bottom: 24px;
}

.row {
    position: relative;
    margin-left: 0;
    margin-right: 0;
    height: auto;
    zoom: 1;
    display: block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.information_item .label_detail {
    color: rgba(0,0,0,.85);
    text-align: right;
    padding-right: 8px;
}

.col-8 {
    display: block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 33.33333333%;
}

.col-16 {
    display: block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 66.66666667%;
}

.col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col-13, .col-14, .col-15, .col-16, .col-17, .col-18, .col-19, .col-20, .col-21, .col-22, .col-23, .col-24 {
    float: left;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
}

.row:after {
    clear: both;
    visibility: hidden;
    font-size: 0;
    height: 0;
}

.row:after, .row:before {
    content: " ";
    display: table;
}

.result_wrap .actions_box {
    margin-top: 32px;
}

.result_wrap .actions_box button:not(:last-child) {
    margin-right: 8px;
}
</style>


