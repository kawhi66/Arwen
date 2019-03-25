<template>
<div>
    <h-panel>
    <h-row type="flex" justify="space-around" class="code-row-bg">
        <h-col span="5"   class="card-body">
          <div class="card-container" style="padding: 10px 24px 8px;">
              <div class="chartTop">
                    <div>
                      <span>总销售额</span>
                      <span><h-tooltip content="指标提示" style="float: right;"><h-icon name="help" ></h-icon></h-tooltip></span>
                    </div>
                    <div class="total"><span>¥ 135,012</span></div>
                </div>
                  <div class="contentFixed" style="height: 46px;">
                    <div  style="margin-right: 16px;">
                      <span>周同比<span>12%</span></span> <span class="up___2EwY8"><i class="anticon anticon-caret-up"></i></span>
                    </div>
                   <div>
                    <span>日环比<span class="trendText___HsrVC">11%</span></span><span class="down___35xDq"><i class="anticon anticon-caret-down"></i></span>
                   </div>
                </div>
              <div class="footer">
                <div class="field"><span>日均销售额</span><span>￥12,423</span></div>
              </div>
            </div>
          </h-col>
        <h-col span="5" class="card-body">
          <div class="card-container" style="padding: 10px 24px 8px;">
              <div class="chartTop">
                    <div>
                      <span>访问量</span>
                      <span><h-tooltip content="指标提示" style="float: right;"><h-icon name="help" ></h-icon></h-tooltip></span>
                    </div>
                    <div class="total"><span>5671</span></div>
                </div>
                  <div class="contentFixed" style="height: 46px;position:relative">
                    <div id="mini_chart1" style="width:230px;height:102px;position:absolute;top:-55px;left:-38px"></div>
                  </div>
              <div class="footer">
                <div class="field"><span>日访问量</span><span>1,234</span></div>
              </div>
            </div>
        </h-col>
        <h-col span="5" class="card-body">
          <div class="card-container" style="padding: 10px 24px 8px;">
              <div class="chartTop">
                    <div>
                      <span>支付笔数</span>
                      <span><h-tooltip content="指标提示" style="float: right;"><h-icon name="help" ></h-icon></h-tooltip></span>
                    </div>
                    <div class="total"><span>4,168</span></div>
                </div>
                <div class="contentFixed" style="height: 46px;position:relative">
                    <div id="mini_chart2" style="width:225px;height:102px;position:absolute;top:-55px;left:-30px"></div>
                </div>
              <div class="footer">
                <div class="field"><span>转化率</span><span>60%</span></div>
              </div>
            </div>
        </h-col>
        <h-col span="5" class="card-body">
          <div class="card-container" style="padding: 10px 24px 8px;">
              <div class="chartTop">
                    <div>
                      <span>运营活动效果</span>
                      <span><h-tooltip content="指标提示" style="float: right;"><h-icon name="help" ></h-icon></h-tooltip></span>
                    </div>
                    <div class="total"><span>¥ 135,012</span></div>
                </div>
                    <div class="contentFixed" style="height: 46px;position:relative">
                    <div id="mini_chart3" style="width:230px;height:100px;position:absolute;top:-55px;left:-30px"></div>
                </div>
              <div class="footer">
                <div class="field">
                  <span>周同比<span>12%</span></span> <span class="up___2EwY8"><i class="anticon anticon-caret-up"></i></span>
                  <span>日环比<span class="trendText___HsrVC">11%</span></span><span class="down___35xDq"><i class="anticon anticon-caret-down"></i></span>
               </div>
             </div>
            </div>
        </h-col>
    </h-row>
    <h-row style="margin-top:20px">
         <h-col span="24">
           <h-tabs value="tab1">
            <h-tab-pane label="销售额" name="tab1">
              <h-row>
                <h-col span="16">
                  <div id="tbchart1" style="width:800px;height:400px;display:inline-block"></div>
                </h-col>
                <h-col span="8">
                <div style="display:inline-block;padding: 0px 32px 32px 32px;vertical-align: top;" >
                 <h4 class="rankingTitle" >门店访问量排名</h4>
                 <ul class="rankingList">
                   <li><span class="active___1ofOu">1</span><span>hundsun杭州</span><span>358,201</span></li>
                   <li><span class="active___1ofOu">2</span><span>hundsun北京</span><span>323,234</span></li>
                   <li><span class="active___1ofOu">3</span><span>hundsun上海</span><span>323,234</span></li>
                   <li><span class="">4</span><span>hundsun杭州</span><span>323,234</span></li>
                   <li><span class="">5</span><span>hundsun杭州</span><span>323,234</span></li>
                   <li><span class="">6</span><span>hundsun杭州</span><span>323,234</span></li>
                   <li><span class="">7</span><span>hundsun杭州</span><span>323,234</span></li>
                   </ul>
                  </div>
                </h-col>
              </h-row>
               
              
            </h-tab-pane>
            <h-tab-pane label="访问量" name="tab2">
              <h-row>
                <h-col span="16">
                   <div id="tbchart2" style="width:800px;height:400px;display:inline-block"></div>
                </h-col>
                <h-col span="8">
                <div style="display:inline-block;padding: 0px 32px 32px 32px;vertical-align: top;" >
                 <h4 class="rankingTitle" >门店访问量排名</h4>
                 <ul class="rankingList">
                   <li><span class="active___1ofOu">1</span><span>hundsun杭州</span><span>358,201</span></li>
                   <li><span class="active___1ofOu">2</span><span>hundsun北京</span><span>323,234</span></li>
                   <li><span class="active___1ofOu">3</span><span>hundsun上海</span><span>323,234</span></li>
                   <li><span class="">4</span><span>hundsun杭州</span><span>323,234</span></li>
                   <li><span class="">5</span><span>hundsun杭州</span><span>323,234</span></li>
                   <li><span class="">6</span><span>hundsun杭州</span><span>323,234</span></li>
                   <li><span class="">7</span><span>hundsun杭州</span><span>323,234</span></li>
                   </ul>
              </div>
                </h-col>
              </h-row>
            </h-tab-pane>
          </h-tabs>
         </h-col>
    </h-row>
    <h-row type="flex" justify="space-around">
      <h-col span="11">
        <h4 class="pietitle">线上热门搜索</h4>
        <h-row>
          <h-col span="4"><h-button type="ghost">近一周</h-button></h-col>
          <h-col span="5"><h-button type="ghost">近一个月</h-button></h-col>
          <h-col span="7"><h-date-picker  format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期"></h-date-picker></h-col>
        </h-row>
        <div style="padding-top: 10px; margin-top: 12px;border-top: 1px solid rgb(232, 232, 232);">
          <div style="padding: 0px 12px 12px 12px;vertical-align: top;">         
            <h-table stripe :columns="columns1" :data="data1"></h-table>
            <h-row style="margin-top:5px;">
              <h-page :total="7"  show-elevator show-total :page-size="7"></h-page>
            </h-row>
          </div>
        </div>
      </h-col>
      <h-col span="11">
        <div >
          <h4 class="pietitle">销售额类别占比</h4>
          <h-button type="ghost">全部</h-button>
          <h-button type="ghost">线上</h-button>
           <h-button type="ghost">门店</h-button>
          <div style="padding-top: 9px; margin-top: 8px;border-top: 1px solid rgb(232, 232, 232);">
            <div id="pieChart"  style="width:510px;height:400px"></div>
          </div>
        </div>
      </h-col>
    </h-row>
    <h-row style="margin-top:20px">
        <h-col span="24" class="tabstyle">
            <h-tabs type="card">
                <h-tab-pane label="门店一">
                   <div id="lineChart"  style="width:100%;height:400px"></div>
                </h-tab-pane>
                <h-tab-pane label="门店二">
                  <div id="lineChart1"  style="width:100%;height:400px"></div>
                </h-tab-pane>
                <h-tab-pane label="门店三">
                  <div id="lineChart2"  style="width:100%;height:400px"></div>
                </h-tab-pane>
            </h-tabs>
        </h-col>
    </h-row>
   </h-panel>
</div>
</template>
<script>
import HPanel from "@/components/HPanel";
import echarts from "echarts";
export default {
  data() {
    let option = {};
    option.copyForm = {
      roleCode: "",
      roleName: ""
    };
    let columns1 = [
      {
        title: "排名",
        key: "range",
         width:65
      },
      {
        title: "关键词",
        key: "keyword"
      },
      {
        title: "用户数",
        key: "users"
      },
      {
        
        title: "周涨幅",
        key: "rise"
      
      }
    ];
    let data1 = [
      {
        range: 1,
        keyword: "hundsun",
        users:5480,
        rise:"15%"

      },
      {
        range: 2,
        keyword: "恒生电子",
        users:3651,
        rise:"10%"
      },
      {
         range: 3,
        keyword: "hundsun杭州",
        users:2450,
        rise:"17%"
      },
      {
         range: 4,
        keyword: "hundsun1",
        users:1548,
        rise:"10%"
      },
      {
        range: 5,
        keyword: "hundsun2",
        users:1420,
        rise:"12%"
      },
      {
         range: 6,
        keyword: "hundsun3",
        users:1201,
        rise:"13%"
      },
       {
         range: 7,
        keyword: "hundsun4",
        users:1024,
        rise:"8%"
      }
    ];
    option.data1 = data1;
    option.columns1 = columns1;
    return option;
  },
  components: {
    HPanel
  },
  mounted() {
    this.initEchart();
    this.initpieChart();
    this.initMiniChart();
    this.initLineChart();
  },
  methods: {
    initEchart() {
      let myChart = echarts.init(document.getElementById("tbchart1"));
      let chart2 = echarts.init(document.getElementById("tbchart2"));
      let option = {
        title: {
          text: ""
        },
        tooltip: {},
        legend: {
          show: false
        },
        xAxis: {
          data: ["1月","2月","3月","4月","5月","6月", "7月","8月", "9月","10月","11月","12月"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            itemStyle: {
              color: "rgb(24, 144, 255)"
            },
            barWidth: 25,
            data: [180, 220, 460, 375, 550, 580, 620, 830, 760, 420, 640, 720]
          }
        ]
      };
      myChart.setOption(option);
      chart2.setOption(option);
    },
    initpieChart() {
      let pieChart = echarts.init(document.getElementById("pieChart"));
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: [
          "rgb(24, 144, 255)",
          "rgb(19, 194, 194)",
          "rgb(47, 194, 91)",
          "rgb(250, 204, 20)",
          "rgb(240, 72, 100)",
          "rgb(133, 67, 224)"
        ],
        legend: {
          orient: "vertical",
          x: "right",
          data: ["家用电器", "饮料食品", "个护美妆", "箱包服饰", "母婴用品", "其他"]
        },
        series: [
          {
            name: "销售额",
            type: "pie",
            radius: ["55%", "70%"],
            label: {
              normal: {
                show: true,
                position: "outside"
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: [
              { value: 245, name: "家用电器" },
              { value: 298, name: "饮料食品" },
              { value: 234, name: "个护美妆" },
              { value: 135, name: "箱包服饰" },
              { value: 154, name: "母婴用品" },
              { value: 210, name: "其他" }
            ]
          }
        ]
      };
      pieChart.setOption(option);
    },
    initMiniChart() {
      let  miniChart = echarts.init(document.getElementById("mini_chart1"));
      let  miniChart2 = echarts.init(document.getElementById("mini_chart2"));
      let  miniChart3 = echarts.init(document.getElementById("mini_chart3"));
     let option = {
       color:'rgb(133, 67, 224)',
    xAxis: {
        type: 'category',
        boundaryGap: false,
        show:false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','aa','bb']
    },
    yAxis: {
        type: 'value',
        show:false
    },
    grid:{
       height:'90%',
       width:'90%'
    },
    series: [{
        data: [820, 732, 801, 934, 750, 730, 920,710,810],
        type: 'line',
        areaStyle: {},
        smooth: true
    }]
};

   let options2={
      color:'rgb(19, 194, 194)',
    xAxis: {
        type: 'value',
        boundaryGap: false,
        show:false,
        data: ['Mon', 'Tue']
    },
    yAxis: {
        type: 'category',
        show:false
    },
    grid:{
       height:'90%',
       width:'90%'
    },
    series: [{
        data: [820, 732],
        type: 'bar',
        barWidth:12
    }]
   }
      miniChart.setOption(option);
      let options=option;
      options.color= 'rgb(24, 144, 255)';
      options.series[0].type='bar';
      options.series[0].barWidth=12;
      miniChart2.setOption(options);
      miniChart3.setOption(options2);
    },
    initLineChart(){
      let lineChart = echarts.init(document.getElementById("lineChart"));
      let lineChart1 = echarts.init(document.getElementById("lineChart1"));
      let lineChart2 = echarts.init(document.getElementById("lineChart2"));
      let option = {
        legend: {
            data:['客流量','支付笔数']
        },
        color:["rgb(47, 194, 91)","rgb(24, 144, 255)"],
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一','周二','周三','周四','周五','周六','周日']
        },
        yAxis: {
            type: 'value'
        },
        series: [
          {
            name:'客流量',
            type:'line',
            data:[120, 132, 181, 134, 140, 260, 210]
        },
        {
            name:'支付笔数',
            type:'line',
            data:[220, 182, 131, 234, 190, 230, 310]
        }],
            dataZoom: [
        {
            show: true,
            realtime: true,
            start: 0,
            end: 100
        }
      ]
      }
         lineChart.setOption(option);
         lineChart1.setOption(option);
         lineChart2.setOption(option);
      }
     
  },
  created() {
    //this.initEchart()
  }
};
</script>
