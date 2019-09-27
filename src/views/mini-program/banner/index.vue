<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.id"
        placeholder="banner id"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="bannerInfos" border fit highlight-current-row style="width: 100%">
      <el-table-column width="180px" align="center" label="图片">
        <template slot-scope="scope">
          <img
            alt=""
            class="imageUrl"
            :src="scope.row.imageUrl"
          >
        </template>
      </el-table-column>
      <el-table-column align="center" label="跳转链接">
        <template slot-scope="scope">
          <span>{{ scope.row.jumpUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="banner Id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="banner名称">
        <template slot-scope="scope">
          <span>{{ scope.row.bannerName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否启用">
        <template slot-scope="scope">
          <span>{{ scope.row.isValid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新日期">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button v-if="scope.row.isValid" size="mini" type="danger" @click="updateBannerInfo(scope.row)">
            停用
          </el-button>
          <el-button v-if="!scope.row.isValid" size="mini" type="primary" @click="updateBannerInfo(scope.row)">
            启用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page.sync="pageNum"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="bannerName">
          <el-input v-model="temp.bannerName" />
        </el-form-item>
        <el-form-item label="图片链接" prop="imageUrl">
          <el-input v-model="temp.imageUrl" />
        </el-form-item>
        <el-form-item label="跳转链接" prop="jumpUrl">
          <el-input v-model="temp.jumpUrl" />
        </el-form-item>
        <el-form-item label="状态">
          <el-checkbox v-model="temp.isValid" label="checkbox">
            启用
          </el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="isCreate ? handleAdd() : handleUpdate()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryBannerInfos, saveBannerInfo, updateBannerInfo } from '../../../api/mini-program/banner'
import { parseTime } from '../../../utils'

export default {
  name: 'Home',
  data() {
    return {
      listLoading: false,
      bannerInfos: [
      ],
      listQuery: {
        title: ''
      },
      temp: {
        id: undefined,
        bannerName: '',
        isValid: false,
        jumpUrl: '',
        imageUrl: ''
      },
      rules: {
        bannerName: [{ required: true, message: '名称必须填写', trigger: 'change' }],
        imageUrl: [{ required: true, message: '图片链接必须填写', trigger: 'change' }],
        jumpUrl: [{ required: true, message: '跳转链接必须填写', trigger: 'change' }]
      },
      pageSize: 5,
      pageNum: 1,
      total: -1,
      dialogFormVisible: false,
      title: '',
      isCreate: false
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.queryBannerInfos()
  },
  methods: {
    queryBannerInfos() {
      this.listLoading = true
      queryBannerInfos({
        pageNo: this.pageNum,
        pageSize: this.pageSize
      }).then((data) => {
        this.listLoading = false
        this.bannerInfos = data.data.list
        this.total = data.data.total
        this.pageSize = data.data.pageSize
        this.pageNum = data.data.pageNum
      }).catch(e => {
        this.listLoading = false
      })
    },
    updateBannerInfo(row) {
      updateBannerInfo({
        id: row.id,
        isValid: !row.isValid
      }).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.isValid = !row.isValid
      }).catch(err => {
        console.log(err)
      })
    },
    handleEdit(row) {
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
      this.title = '编辑banner'
      this.isCreate = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreate() {
      this.temp = {
        id: undefined,
        bannerName: '',
        isValid: false,
        jumpUrl: '',
        imageUrl: ''
      }
      this.isCreate = true
      this.dialogFormVisible = true
      this.title = '添加banner'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateBannerInfo(this.temp)
            .then(res => {
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.queryBannerInfos()
            }).catch(e => {
              console.log(e)
            })
        }
      })
    },
    handleAdd() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveBannerInfo({
            bannerName: this.temp.bannerName,
            imageUrl: this.temp.imageUrl,
            isValid: this.temp.isValid,
            jumpUrl: this.temp.jumpUrl
          })
            .then(() => {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.queryBannerInfos()
            }).catch(e => {
              console.log(e)
            })
        }
      })
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.queryBannerInfos()
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }

  .imageUrl {
    width: 100%;
  }
</style>
