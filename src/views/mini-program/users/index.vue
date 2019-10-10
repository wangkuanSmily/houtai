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
        v-if="false"
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
      <el-table-column align="center" label="头像">
        <template slot-scope="scope" style="width: 100px; height: 100px">
          <img :src="scope.row.avatarUrl" class="image-small">
        </template>
      </el-table-column>
      <el-table-column align="center" label="积分">
        <template slot-scope="scope">
          <span>{{ scope.row.bonus }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员等级">
        <template slot-scope="scope">
          <span>{{ scope.row.cardLevel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册渠道">
        <template slot-scope="scope">
          <span>{{ scope.row.channel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="国家">
        <template slot-scope="scope">
          <span>{{ scope.row.country }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="国家Code">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTimes | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="复游会卡号">
        <template slot-scope="scope">
          <span>{{ scope.row.fcrmCardNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="复游会ID">
        <template slot-scope="scope">
          <span>{{ scope.row.fcrmId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.gender }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否为老用户">
        <template slot-scope="scope">
          <span>{{ scope.row.isOld }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员卡等级索引值">
        <template slot-scope="scope">
          <span>{{ scope.row.levelIndex }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="foliday会员Id">
        <template slot-scope="scope">
          <span>{{ scope.row.memberId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="openId">
        <template slot-scope="scope">
          <span>{{ scope.row.openId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话号码">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="平台">
        <template slot-scope="scope">
          <span>{{ scope.row.platform }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="省份">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="unionId">
        <template slot-scope="scope">
          <span>{{ scope.row.unionId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="userId">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="饮品券Id">
        <template slot-scope="scope">
          <span>{{ scope.row.voucherCode }}</span>
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
  </div>
</template>

<script>
import { userList } from '@/api/mini-program/user'
import { parseTime } from '@/utils/index.js'
export default {
  name: 'Coupon',
  components: {},
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return parseTime(date)
    }
  },
  data() {
    return {
      listLoading: false,
      list: [],
      listQuery: {
        title: ''
      },
      activeName: 'CN',
      createdTimes: 0,
      formLabelWidth: '120px',
      listResult: {},
      currentPage: 1
    }
  },
  watch: {},
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {},
    handleSizeChange() {},
    handleCurrentChange() {
      this.getList()
    },
    getList() {
      userList({
        pageNo: this.currentPage,
        pageSize: 10
      }).then(data => {
        this.list = data.data.list
        this.listResult = data.data
      })
    }
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
