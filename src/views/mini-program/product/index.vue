<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="Title"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
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
      style="width: 100%"
    >
      <el-table-column width="180px" align="center" label="图片">
        <!-- <span>{{ scope.row.imageUrl }}</span> -->
        <template slot-scope="scope" style="width: 100px; height: 100px">
          <img :src="scope.row.imageUrl" class="image-small">
        </template>
      </el-table-column>
      <el-table-column align="center" label="跳转链接">
        <template slot-scope="scope">
          <span>{{ scope.row.jumpUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="跳转类型">
        <template slot-scope="scope">
          <span>{{ scope.row.jumpType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品Id">
        <template slot-scope="scope">
          <span>{{ scope.row.productId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
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
        :current-page.sync="currentPage"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="1000"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { queryList } from '@/api/mini-program/product'
export default {
  name: 'Tab',
  data() {
    return {
      listLoading: false,
      list: [],
      listQuery: {
        title: ''
      },
      activeName: 'CN',
      createdTimes: 0,
      currentPage: 1
    }
  },
  watch: {},
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {},
    handleCreate() {},
    getList() {
      queryList({
        pageNo: 1,
        pageSize: 10
      }).then(data => {
        this.list = data.data.list
      })
    },
    handleSizeChange() {},
    handleCurrentChange() {
      this.getList()
    },
    uploadPicture(item) {
      this.curCouponItem.imageUrl = item
    },
    uploadPictureRemove(item) {
      this.curCouponItem.imageUrl = ''
    },
    addOrEditItem() {}
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
.image-small {
  width: 150px;
  height: 80px;
}
</style>
