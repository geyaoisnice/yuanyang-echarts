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
  name: "HelloTooltip",

  data() {
    return {};
  },

  mounted() {
    let myEchart = echarts.init(this.$refs.mychart);
    myEchart.setOption({
      title: {
        text: "hello world",
        backgroundColor: "pink",
        borderColor: "red",
        borderWidth: 5,
        x: "center",
        subtext: "你好",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        backgroundColor: "pink",
        borderColor: "red",
        borderWidth: 5,
        textStyle: {
          color: "yellow",
        },
        formatter(params) {
          console.log(params);
          for (var i = 0; i < params.length; i++) {
            return (
              "名字" +
              params[i].name +
              "--价格:" +
              params[i].data.value +
              "--日期:" +
              params[i].data.date
            );
          }
        },
      },
      xAxis: {
        data: ["苹果", "西瓜", "香蕉", "橘子"],
      },
      yAxis: {},
      series: {
        name: "LOL人物大全",
        type: "bar",
        data: [
          { value: "5", date: "2020-1-1" },
          { value: "6", date: "2020-1-1" },
          { value: "9", date: "2020-1-1" },
          { value: "7", date: "2020-1-1" },
        ],
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