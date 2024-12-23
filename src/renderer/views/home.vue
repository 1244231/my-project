<template>
  <div id="dataMigration"
      v-loading="loading"
      element-loading-text="数据迁移过程需要几分钟时间，期间请勿进行任何操作"
      element-loading-spinner="el-icon-loading"
    >
    <div class="title">数据迁移</div>
    <el-card>
      <div class="select">
        <el-form
          label-width="100px"
          ref="ruleForm"
          :model="dataForm"
          :rules="rules"
        >
          <el-form-item prop="dataBaseAddress" label="数据库地址:">
            <el-input
              v-model="dataForm.dataBaseAddress"
              style="width: 200px"
              size="small"
            />
          </el-form-item>
          <el-form-item prop="dataBaseName" label="数据库名称:">
            <el-input
              v-model="dataForm.dataBaseName"
              style="width: 200px"
              size="small"
            />
          </el-form-item>
          <el-form-item prop="userName" label="数据库账号:">
            <el-input
              v-model="dataForm.userName"
              style="width: 200px"
              size="small"
            />
          </el-form-item>
          <el-form-item prop="passWord" label="数据库密码:">
            <el-input
              v-model="dataForm.passWord"
              style="width: 200px"
              size="small"
            />
          </el-form-item>
          <!-- <el-form-item prop="passWord" label="版本选择:">
            <el-select
              v-model="dataForm.passWord"
              style="width: 200px"
              size="small"
            >
            </el-select> 
          </el-form-item>-->
        </el-form>
        <p>迁移选项</p>
        <el-checkbox-group v-model="checkList" @change="getCheckList">
          <div>
            <el-checkbox :label="1">商品档案</el-checkbox>
            <el-checkbox :label="1">商品分类档案</el-checkbox>
            <el-checkbox :label="2">品牌档案</el-checkbox>
          </div>
          <div>
            <el-checkbox :label="4">客户档案</el-checkbox>
            <el-checkbox :label="4">客户分类档案</el-checkbox>
            <el-checkbox :label="9">客户价格跟踪</el-checkbox>
          </div>
          <!-- <el-checkbox label="供应商分类档案"></el-checkbox> -->
          <div>
            <el-checkbox :label="6">供应商档案</el-checkbox>
            <el-checkbox :label="10">供应商价格跟踪</el-checkbox>
          </div>
          <div>
            <el-checkbox :label="8">仓库档案</el-checkbox>
            <el-checkbox :label="7">账户档案</el-checkbox>
          </div>
        </el-checkbox-group>
      </div>

      <el-button
        class="confirm_btn"
        size="small"
        type="primary"
        @click="hanleConfirm"
        >确定数据迁移</el-button
      >
    </el-card>
    <!-- <el-dialog
      title="确认数据迁移操作"
      :before-close="handleClose"
      :visible.sync="confirmDialog"
      width="30%"
    >
      <el-form
        style="display: flex; flex-direction: column; align-items: center"
        :rules="rules"
        :model="submitForm"
        ref="submitForm"
      >
      <el-form-item prop="userName" label="用户名">
          <el-input
            class="required"
            placeholder="请输入用户名"
            v-model="submitForm.userName"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="passWord" label="密码">
          <el-input
            class="required"
            placeholder="请输入用户登录密码"
            v-model="submitForm.passWord"
          >
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> -->
  </div>
</template>
<script>
import { importhhdata } from "@/api/Login";
export default {
  name: "home",
  data() {
    return {
      checkList: [],
      oldCheckList: [],
      loading:false,
      dataForm: {
        dataBaseAddress: "",
        dataBaseName: "",
        passWord: "",
        userName: "",
      },
      rules: {
        dataBaseAddress: [
          { required: true, message: "请输入数据库地址", trigger: "blur" },
        ],
        dataBaseName: [
          { required: true, message: "请输入数据库名字", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请输入数据库账号", trigger: "blur" },
        ],
        passWord: [
          { required: true, message: "请输入数据库密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    hanleConfirm() {
      try {
        this.loading=true
        this.loading=false
      } catch (error) {
        this.loading=false
      }finally{
        this.loading=false
      }
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        if (!this.checkList.length) {
          this.$message.error("请选择迁移内容");
          return;
        }
        this.$confirm("是否确认数据迁移?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(()=>{
          let param = {
          importType: this.checkList,
          ...this.dataForm,
        };
        
        await importhhdata(param);
        this.$message.success('迁移成功')
        })

      });
    },
    getCheckList(val) {
      if (val.includes(1) && !val.includes(3)) {
        this.checkList.push(3);
      } else if (!val.includes(1) && val.includes(3)) {
        this.checkList = this.checkList.filter((item) => item != 3);
      }
      if (val.includes(4) && !val.includes(5)) {
        this.checkList.push(5);
      } else if (!val.includes(4) && val.includes(5)) {
        this.checkList = this.checkList.filter((item) => item != 5);
      }
      if (val.includes(9)) {
        if (!val.includes(4)) {
          this.checkList.push(4);
          this.checkList.push(5);
        }
        if (!val.includes(1)) {
          this.checkList.push(1);
          this.checkList.push(3);
        }
      }
      if (val.includes(10)) {
        if (!val.includes(6)) {
          this.checkList.push(6);
        }
        if (!val.includes(1)) {
          this.checkList.push(1);
          this.checkList.push(3);
        }
      }
    },
  },
};
</script>
<style scoped>
#dataMigration {
  height: 100%;
}
.title {
  font-size: 20px;
  margin: 20px;
  font-weight: bold;
}
.el-card {
  height: 100%;
  position: relative;
}
.confirm_btn {
  position: absolute;
  bottom: 20px;
}
</style>
