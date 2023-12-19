<template>
  <div>
    <div>
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-success="handleChange"
        :file-list="fileList"
        class="el-upload"
        >上传文件</el-upload
      >
      <el-table :data="arr" style="width: 100%">
        <el-table-column prop="time" label="时间" width="180">
        </el-table-column>
        <el-table-column prop="temperature" label="温度" width="180">
        </el-table-column>
      </el-table>
    </div>
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
import { read, utils } from "xlsx";
import * as echarts from "echarts";
import moment from "moment";
export default {
  name: "HelloKali",
  data() {
    return {
      fileList: [],
      tableData: [],
      tableHead: [],
      flag: true,
      arr: [],
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
          //   text: "卡涞IOT测点曲线图",
          x: "center",
        },
        tooltip: {
          trigger: "axis",
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
          //   name: "卡涞IOT测点曲线图",
          type: "line",
          smooth: true,
          data: [],
        },
      },
    };
  },
  created() {},
  methods: {
    // 导入成功时执行
    handleChange(res, file, fileList) {
      // 将文件放入
      for (let i = 0; i < fileList.length; i++) {
        if (file.name != fileList[i].name) {
          this.fileList &&
            this.fileList.push({
              name: file.name,
              url: "",
              uid: file.uid,
            });
        }
      }
      const files = { 0: file };
      this.readExcel(files);
    },
    //处理数据的格式
    getFormatDate(serial) {
      var utc_days = Math.floor(serial - 25569);
      var utc_value = utc_days * 86400;
      var date_info = new Date(utc_value * 1000);
      var fractional_day = serial - Math.floor(serial) + 0.0000001;
      var total_seconds = Math.floor(86400 * fractional_day);
      var seconds = total_seconds % 60;
      total_seconds -= seconds;
      var hours = Math.floor(total_seconds / (60 * 60));
      var minutes = Math.floor(total_seconds / 60) % 60;
      var d = new Date(
        date_info.getFullYear(),
        date_info.getMonth(),
        date_info.getDate(),
        hours,
        minutes,
        seconds
      );
      return d;
    },
    readExcel(file) {
      const fileReader = new FileReader();

      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = read(data, { type: "binary" });
          //建立临时变量存放数值
          const arrItem = [];
          const tableDataItem = [];
          // 取对应表生成json表格内容
          workbook.SheetNames.forEach((item) => {
            this.tableData.push(utils.sheet_to_json(workbook.Sheets[item]));
          });
          this.tableData[0] &&
            this.tableData[0].map((item) => {
              arrItem.push({
                time: moment(this.getFormatDate(item.time)).format(
                  "YYYY-MM-DD"
                ),
                temperature: item.temperature,
              });
            });
          // 该算法仅针对表头无合并的情况
          if (this.tableData.length > 0) {
            // 获取excel中第一个表格数据tableData[0][0]，并且将表头提取出来
            for (const key in this.tableData[0][0]) {
              this.tableHead.push(key);
              //给数据表单赋值
            }
          }
          this.arr = arrItem;
          // 重写数据
        } catch (e) {
          console.log("error:" + e);
          return false;
        }
      };
      fileReader.readAsBinaryString(file[0].raw);
    },
    handleProductChange(ProductId) {},
    //渲染dom节点
    showZheData() {
      let myEchart = echarts.init(this.$refs.mychart);
      myEchart.setOption(this.zheOption, true);
    },
    //获取折线图数据
    getZheData(formInlineData) {
      const { deviceId, productFunId, startTime, endTime } = formInlineData;
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
.demoNull {
  width: 100%;
  height: 600px;
  text-align: center;
}
</style>