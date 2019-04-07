<template>
    <h-form :label-width="100">
        <h-form-item label="付款账户">
            <h-select :setDefSelect="true">
                <h-option value="Hundsun">hundsun-design@alipay.com</h-option>
            </h-select>
        </h-form-item>
        <h-form-item label="收款账户">
            <h-row>
                <h-col span="6">
                    <h-select :setDefSelect="true">
                        <h-option value="Alipay">支付宝</h-option>
                        <h-option value="Bankcard">银行卡</h-option>
                    </h-select>
                </h-col>
                <h-col span="18">
                    <h-input value="test@example.com"></h-input>
                </h-col>
            </h-row>
        </h-form-item>
        <h-form-item label="收款人姓名">
            <h-input value="Alex"></h-input>
        </h-form-item>
        <h-form-item label="转账金额">
            <h-input  value="500">
                <h-icon name="social-yen" slot="prepend"></h-icon>
            </h-input>
        </h-form-item>
        <h-form-item>
            <h-button type="primary" @click="showNextComp">下一步</h-button>
        </h-form-item>
    </h-form>
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
                type:Number
            }
        },
        methods:{
            showNextComp () {
                if (this.currentIndex == 2) {
                    this.currentIndex = 0;
                } else {
                    this.currentIndex += 1;
                }
                // alert(this.currentIndex)
                this.$emit("onClickItem1",this.currentIndex)

            }
        }
    }
</script>

<style scoped>

</style>

