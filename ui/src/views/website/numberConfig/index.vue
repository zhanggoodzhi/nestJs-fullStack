<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8" type="flex" justify="end">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >create</el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="tableData">
      <el-table-column
        label="name"
        align="center"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="introduction"
        align="center"
        prop="introduction"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="article"
        align="center"
        prop="article"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="image" align="center" prop="image">
        <template slot-scope="scope">
          <img
            class="row-img"
            :src="$utils.getImgPath(scope.row.image)"
            alt=""
          />
        </template>
      </el-table-column>
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
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >remove</el-button
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
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="name" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="introduction" prop="introduction">
          <el-input v-model="form.introduction" />
        </el-form-item>
        <el-form-item label="article" prop="article">
          <el-input v-model="form.article" type="textarea" />
        </el-form-item>
        <el-form-item label="image" prop="image">
          <el-upload
            class="avatar-uploader"
            :action="api + '/common/upload'"
            :headers="uploadHeaders"
            :file-list="fileList"
            accept=".png, .jpg"
            :limit="1"
            list-type="picture"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过5MB
            </div>
          </el-upload>
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
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
} from "@/api/website/user";

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
      listUser().then((response) => {
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
      getUser(id).then((response) => {
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
            updateUser(this.form).then((response) => {
              this.$modal.msgSuccess("update success");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then((response) => {
              this.$modal.msgSuccess("add success");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm("Are you sure to remove this row?")
        .then(function () {
          return delUser(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("remove success");
        })
        .catch(() => {});
    },
  },
};
</script>
<style>
.row-img {
  height: 50px;
}
</style>