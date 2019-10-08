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
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="配置Id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="配置Key">
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="配置类型">
        <template slot-scope="scope">
          <span>{{ scope.row.keyType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="配置值">
        <template slot-scope="scope" style="width: 100px; height: 100px">
          <img v-if="scope.row.keyType==='URL'" :src="scope.row.value" class="image-small">
          <span v-if="!(scope.row.keyType==='URL')">{{ scope.row.value }}</span>
        </template>
        <!-- <template v-if="!(scope.row.keyType=='URL')" slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>-->
      </el-table-column>
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click.native.prevent="editRow(scope.row)">编辑</el-button>
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

    <el-dialog title="全局配置项" :visible.sync="editDialogVisible">
      <el-form :model="configItem">
        <el-form-item label="配置类型" :label-width="formLabelWidth">
          <el-select v-model="configItem.keyType" placeholder="请选择配置类型">
            <el-option
              v-for="item in keyTypeSelects"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券名称" :label-width="formLabelWidth">
          <el-input v-model="configItem.couponName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="优惠券图片" :label-width="formLabelWidth">
          <pictureupload
            :img-list="configPics"
            :limit="1"
            @uploadimg="uploadCouponPicture"
            @removeimg="uploadPictureRemove"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="addOrEditCoupon"
        >{{ isAddCoupon?'新 增':'确 定' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/index.js'
import { queryList } from '@/api/mini-program/appconfig'

export default {
  name: 'AppConfig',
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return parseTime(date)
    },
    filterCouponTypeName(couponType) {
      switch (couponType) {
        case 'MALL':
          return '好品质商城'
        case 'FOLIDAY':
          return '复游旅行'
        case 'FHOTO':
          return '复游拍'
      }
    }
  },
  data() {
    return {
      editDialogVisible: false,
      listLoading: false,
      currentPage: 1,
      list: [],
      listQuery: {
        title: ''
      },
      listResult: {},
      configPics: [],
      configItem: {},
      configConstants: {
        'CUSTOMER_PHONE': {

        }
      }
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
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
      queryList({
        pageNo: this.currentPage,
        pageSize: 10
      }).then(data => {
        this.list = data.data.list
        this.listResult = data.data
      })
    },
    editRow(configItem) {
      this.editDialogVisible = true
      this.configItem = configItem
      console.log(this.configItem)
      this.configPics = []
      this.configPics.push(this.configItem.imageUrl)
    },
    uploadCouponPicture(item) {
      this.configItem.imageUrl = item
    },
    uploadPictureRemove(item) {
      this.configItem.imageUrl = ''
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
