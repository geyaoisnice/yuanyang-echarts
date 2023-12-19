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
  name: "HelloWorld",

  data() {
    return {};
  },

  mounted() {
    let myEchart = echarts.init(this.$refs.mychart);
    myEchart.setOption({
      title: {
        text: "hello world",
      },
      xAxis: {
        data: ["EZ", "VN", "GEYAO", "MF"],
      },
      yAxis: {},
      series: {
        name: "LOL英雄大全",
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