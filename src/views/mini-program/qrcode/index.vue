<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="height: 100%; width: 100%"
    >
      <el-table-column align="center" label="渠道码" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.channelCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="二维码图片">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" class="image-small" alt="">
        </template>
      </el-table-column>
      <el-table-column align="center" label="path">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="场景名">
        <template slot-scope="scope">
          <span>{{ scope.row.sceneName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否可用">
        <template slot-scope="scope">
          <span>{{ scope.row.isValid ? "已启用" : "已禁用" }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="listResult.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog title="新增小程序码配置" :visible.sync="editDialogVisible">
      <el-form :model="currentQRCodeModal" label-position="left">
        <el-form-item label="场景名" :label-width="formLabelWidth" prop="sceneName">
          <el-input v-model="currentQRCodeModal.sceneName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="渠道码" :label-width="formLabelWidth" prop="channelCode">
          <el-input v-model="currentQRCodeModal.channelCode" autocomplete="off" />
        </el-form-item>
        <el-form-item label="path" :label-width="formLabelWidth" prop="path">
          <el-input v-model="currentQRCodeModal.path" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addItem">新 增</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addQRCodeConfig, fetchQRCodeConfigs } from '../../../api/mini-program/qrcode'

export default {
  name: 'Qrcode',
  data() {
    return {
      editDialogVisible: false,
      currentQRCodeModal: {},
      list: [],
      currentPage: 1,
      listLoading: false,
      formLabelWidth: '120px',
      listResult: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchQRCodeConfigs({
        pageNo: this.currentPage,
        pageSize: 10
      }).then(data => {
        this.list = data.data.list
        this.listResult = data.data
      })
    },
    handleCreate() {
      this.editDialogVisible = true
      this.currentQRCodeModal = {}
    },
    handleCurrentChange() {
      this.getList()
    },
    handleSizeChange() {

    },
    addItem() {
      console.log(this.currentQRCodeModal)
      addQRCodeConfig(this.currentQRCodeModal).then(() => {
        this.$message('添加成功')
        this.getList()
      })
      this.editDialogVisible = false
    }
  }
}
</script>

<style scoped>
.image-small {
  width: 85%;
}
</style>
