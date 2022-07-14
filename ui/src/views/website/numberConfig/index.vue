<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="tableData">
      <el-table-column
        label="userCount"
        align="center"
        prop="userCount"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="PredictionCount"
        align="center"
        prop="PredictionCount"
        :show-overflow-tooltip="true"
      /><el-table-column
        label="AlertCount"
        align="center"
        prop="AlertCount"
        :show-overflow-tooltip="true"
      /><el-table-column
        label="DashboardCount"
        align="center"
        prop="DashboardCount"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="operation"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >edit</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="userCount" prop="userCount">
          <el-input v-model="form.userCount" />
        </el-form-item>
        <el-form-item label="PredictionCount" prop="PredictionCount">
          <el-input v-model="form.PredictionCount" />
        </el-form-item>
        <el-form-item label="AlertCount" prop="AlertCount">
          <el-input v-model="form.AlertCount" />
        </el-form-item>
        <el-form-item label="DashboardCount" prop="DashboardCount">
          <el-input v-model="form.DashboardCount" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">ok</el-button>
        <el-button @click="cancel">cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

import {
  listConfig,
  getConfig,
  delConfig,
  addConfig,
  updateConfig,
} from "@/api/website/numberConfig";

export default {
  data() {
    return {
      api: process.env.VUE_APP_BASE_API,

      uploadHeaders: { Authorization: "Bearer " + getToken() },
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 参数表格数据
      tableData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      fileList: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, trigger: "blur" }],
        introduction: [{ required: true, trigger: "blur" }],
        article: [{ required: true, trigger: "blur" }],
        image: [{ required: true, trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleAvatarSuccess(res, file, fileList) {
      this.$set(this.form, "image", res.fileName);
      this.fileList = fileList;

      this.$refs.form.clearValidate("image");
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isLt2M;
    },
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listConfig().then((response) => {
        this.tableData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        introduction: undefined,
        article: undefined,
        image: null,
      };
      this.fileList = [];
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "add";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getConfig(id).then((response) => {
        this.form = response.data;
        this.fileList = [
          {
            name: row.image,
            url: this.$utils.getImgPath(row.image),
            response: {
              fileName: row.image,
            },
          },
        ];
        this.open = true;
        this.title = "update";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateConfig(this.form).then((response) => {
              this.$modal.msgSuccess("update success");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
  },
};
</script>
<style>
.row-img {
  height: 50px;
}
</style>