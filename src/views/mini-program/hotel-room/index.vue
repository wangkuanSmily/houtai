<template>
  <div class="dashboard-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="height: 100%; width: 100%"
    >
      <el-table-column align="center" width="170px" label="客房图片">
        <template slot-scope="scope">
          <img :src="scope.row.roomImage" class="image-small" alt="">
        </template>
      </el-table-column>
      <el-table-column align="center" width="170px" label="客房视频缩略图">
        <template slot-scope="scope">
          <img :src="scope.row.roomVideoThumbnail" class="image-small" alt="">
        </template>
      </el-table-column>
      <el-table-column align="center" width="320px" label="客房视频">
        <template slot-scope="scope">
          <video controls width="300px" :autoplay="false" preload="metadata">
            <source
              :src="scope.row.roomVideo"
            >
          </video>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客房名称" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="客房面积">
        <template slot-scope="scope">
          <span>{{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="客房种类">
        <template slot-scope="scope">
          <span>{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="200px" label="客房总结">
        <template slot-scope="scope">
          <span>{{ scope.row.roomSummary }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="200px" label="入住人数">
        <template slot-scope="scope">
          <span>{{ scope.row.peopleCount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="320px" label="客房描述">
        <template slot-scope="scope">
          <span style="max-height: 25px">{{ scope.row.body }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="是否可预定">
        <template slot-scope="scope">
          <span>{{ scope.row.roomCanReserve ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="320px" label="客房设施">
        <template slot-scope="scope">
          <span>{{ scope.row.roomFacility }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="客房ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否可用">
        <template slot-scope="scope">
          <span>{{ scope.row.valid ? "已启用" : "已禁用" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click.native.prevent="editRow(scope.row)">编辑</el-button>
          <el-button
            :type="scope.row.valid ? 'danger' : 'primary'"
            size="small"
            @click.native.prevent="updateRow(scope.row)"
          >{{ scope.row.valid ? '禁用' : '启用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryList, editItem } from '@/api/mini-program/room'

export default {
  name: 'Home',
  data() {
    return {
      currentPage: 1,
      list: [],
      listLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      queryList({
        pageNo: this.currentPage,
        pageSize: 10
      }).then(data => {
        this.list = data.data.list
      })
    },
    updateRow(row) {
      editItem({
        id: row.id,
        valid: !row.valid
      }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.valid = !row.valid
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
  .image-small {
    width: 150px;
    height: 80px;
  }
</style>
