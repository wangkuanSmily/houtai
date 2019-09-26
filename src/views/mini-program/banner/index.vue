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
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="bannerInfos" border fit highlight-current-row style="width: 100%">
      <el-table-column width="180px" align="center" label="图片">
        <template slot-scope="scope">
          <span>{{ scope.row.imageUrl }}</span>
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
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page.sync="pageNum"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryBannerInfos } from '../../../api/mini-program/banner'

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
      pageSize: 20,
      pageNum: 1,
      total: -1
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
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
