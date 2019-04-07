<template>
  <div>
     <h-row type="flex" justify="space-around" class="code-row-bg">
        <h-col span="18"   class="card-body">
          <div>
              <div class="headtitle">活动实时交易情况</div>
                <div class="card-container">
                <div style="display:inline-block;width:25%">
                    <div class="subTitle">今日交易总额</div>
                    <div class="subInfo">
                      <span>354,433<em class="suffix">元</em></span>
                    </div>
                </div>
              <div style="display:inline-block;width:25%">
                  <div class="subTitle">销售目标完成率</div>
                  <div class="subInfo"><span>92%</span></div>
              </div>
              <div style="display:inline-block;width:25%">
                  <div class="subTitle">活动剩余时间</div>
                  <div class="subInfo">
                    <span>01:00:00</span>
                  </div>
              </div>
              <div style="display:inline-block;width:20%">
                  <div class="subTitle">每秒交易总额</div>
                  <div class="subInfo">
                    <span>127<em class="suffix">元</em></span>
                  </div>
              </div>
            <div class="mapChart"><img  style="display: inline-block;max-width: 100%;max-height: 477px" src="https://gw.alipayobjects.com/zos/rmsportal/HBWnDEUXCnGnGrRfrpKa.png" alt="map"></div>
          </div>
          </div>
          </h-col>
        <h-col span="6"   class="card-body">
           <div>
             <div class="headtitle">券核效率</div>
                <div class="card-container">
                   <div id="chart1" style="width:320px;height:300px;position:absolute;left:-20px"></div>
                </div>
           </div>
           <div>
             <div class="headtitle" style="margin-top:250px">活动情况预测</div>
             <div class="card-container" style="position:relative" >
               <div id="minichart" style="width:230px;height:302px"></div>
               <div class="subInfo" style="position:absolute;top:20px"><span>有望达到预期值</span></div>
             </div>
           </div>
        </h-col>
     </h-row>
  </div>
</template>
<script>
import HPanel from "@/components/HPanel";
import echarts from "echarts";
export default {
  components: {
    HPanel
  },
  mounted() {
    this.initEchart1();
    this.initMiniChart();
  },
 methods: {
   initEchart1(){
      let myChart = echarts.init(document.getElementById("chart1"));
      let option = {
        color:['#749f83',  '#ca8622', '#bda29a'],
      series: [
        {
            name: '业务指标',
            type: 'gauge',
            detail: {formatter:'{value}%'},
            data: [{value: 60, name: '完成率'}],
            min: 0,
            max: 100,
            splitNumber: 10,
            radius: '80%',
            axisLine: {            
                lineStyle: {       
                    color: [[0.2,"rgb(47, 194, 91)"],[0.8, "rgb(24, 144, 255)"],[1, "rgb(47, 194, 91)"]],
                    width: 15,
                    shadowColor : '#fff', 
                    shadowBlur: 20
                }
            },
            axisTick: {            
                length: 15,      
                lineStyle: {       
                    color: 'auto'
                }
            },
            splitLine: {          
                length: 20,       
                lineStyle: {     
                    color: 'auto'
                }
            }
        }
    ]
    };
    myChart.setOption(option);
   },
   initMiniChart(){
      let  miniChart = echarts.init(document.getElementById("minichart"));
     let option = {
       color:'rgb(133, 67, 224)',
     tooltip: {
        trigger: "item",
        formatter: "{b}: {c}元/秒"
      },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['8:00', '9:00', '10:00', '11:00']
    },
    yAxis: {
        type: 'value',
        show:true
    }, 
    grid:{
        left:'35px'
    },

    series: [{
        data: [10, 30, 120, 180],
        type: 'line',
        areaStyle: {},
        smooth: true
    }]
  };
   miniChart.setOption(option);
   }
 }

};
</script>
