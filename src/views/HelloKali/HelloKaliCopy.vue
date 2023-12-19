<template>
  <div>
    <el-form
      :inline="true"
      ref="ruleForm"
      :model="formInline"
      class="demo-form-inline"
      :rules="rules"
    >
      <el-form-item label="设备名称" prop="deviceId">
        <el-select
          @change="handleProductChange"
          v-model="formInline.deviceId"
          placeholder="请选择设备名称"
        >
          <el-option
            v-for="item in deviceOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测点名称" prop="productFunId">
        <el-select
          v-model="formInline.productFunId"
          placeholder="请选择测点名称"
        >
          <el-option
            v-for="item in productOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          type="date"
          placeholder="选择开始时间"
          v-model="formInline.startTime"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          type="date"
          placeholder="选择结束时间"
          v-model="formInline.endTime"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="resetForm('ruleForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div ref="mychart" id="demoDiv"></div>
  </div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
import axios from "axios";
import { BaseUrl } from "../../utils/baseUrl.js";
export default {
  name: "HelloKali",
  data() {
    return {
      rules: {
        deviceId: [
          { required: true, message: "请选择设备名称", trigger: "change" },
        ],
        productFunId: [
          { required: true, message: "请选择测点名称", trigger: "change" },
        ],
        startTime: [
          {
            type: "date",
            required: true,
            message: "请选择开始日期",
            trigger: "change",
          },
        ],
        endTime: [
          {
            type: "date",
            required: true,
            message: "请选择结束日期",
            trigger: "change",
          },
        ],
      },
      formInline: {
        deviceId: "",
        productFunId: "",
        startTime: null,
        endTime: null,
      },
      deviceOptions: [],
      productOptions: [],
      zheOption: {
        title: {
          text: "卡莱测点数据图",
          x: "center",
        },
        legend: {
          show: true,
          top: "10%",
          itemWidth: 10,
          itemHeight: 20,
        },
        xAxis: {
          data: [],
        },
        yAxis: {},
        series: {
          name: "卡莱测点数据图",
          type: "line",
          smooth: true,
          data: [],
        },
      },
    };
  },
  created() {
    axios.get(`${BaseUrl}/linechart/queryDeviceList`, {}).then((res) => {
      console.log(res, "res.data");
      if (res.status === 200) {
        this.deviceOptions = res.data.data;
      }
    });
  },
  methods: {
    handleProductChange(ProductId) {
      axios
        .get(
          `${BaseUrl}/linechart/queryDeviceProductFunc?deviceId=${ProductId}`,
          {}
        )
        .then((res) => {
          if (res.status === 200) {
            this.productOptions = res.data.data;
          }
        });
    },
    //渲染dom节点
    showZheData() {
      let myEchart = echarts.init(this.$refs.mychart);
      myEchart.setOption(this.zheOption, true);
    },
    //获取折线图数据
    getZheData(formInlineData) {
      const { deviceId, productFunId, startTime, endTime } = formInlineData;
      axios
        .get(
          `${BaseUrl}/linechart/querylinechart?deviceId=${deviceId}&productFunId=${productFunId}&startTime=${startTime.getTime()}&endTime=${endTime.getTime()}`
        )
        .then((res) => {
            console.log(res,"111111")
          if (res.status === 200) {
            this.setZheData(res.data);
            this.showZheData();
          }
        });
    },
    //处理数据
    setZheData(datas) {
      const Datax = [];
      const DataY = [];
      datas &&
        datas.map((item, index) => {
          Datax.push(item.x);
        });
      datas &&
        datas.map((item, index) => {
          DataY.push(item.y);
        });
      this.zheOption.xAxis.data = Datax;
      this.zheOption.series.data = DataY;
    },
    //查询表单
    submitForm(formName) {
      console.log(this.$refs[formName], "formName");
      this.$refs[formName].validate((valid) => {
        console.log(this.formInline, "valid");
        if (valid) {
          this.getZheData(this.formInline);
        } else {
          return false;
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style  scoped>
#demoDiv {
  width: 100%;
  height: 600px;
  /* background-color: pink; */
}
</style>