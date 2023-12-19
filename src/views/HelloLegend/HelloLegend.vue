<template>
  <div>
    <div>1111</div>
    <div ref="mychart" id="demoDiv"></div>
  </div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
export default {
  name: "HelloLegend",
  data() {
    return {};
  },

  mounted() {
    let myEchart = echarts.init(this.$refs.mychart);
    myEchart.setOption({
      title: {
        text: "hello world",
        backgroundColor:"pink",
        borderColor:"red",
        borderWidth:5,
        x:"center",
        subtext:"你好"
      },
      legend:{
        show:true,
        top:"10%",
        itemWidth:10,
        itemHeight:20
      },
      xAxis: {
        data: ["EZ", "VN", "GEYAO", "MF"],
      },
      yAxis: {},
      series: {
        name: "LOL人物大全",
        type:"bar",
        data:[6300,4800,3200,600]
      },
    });
  },

  methods: {},
};
</script>

<style  scoped>
#demoDiv {
  width: 500px;
  height: 500px;
  background-color: pink;
}
</style>