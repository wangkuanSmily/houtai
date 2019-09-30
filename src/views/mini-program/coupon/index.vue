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
      <el-table-column align="center" label="优惠券图片">
        <template slot-scope="scope" style="width: 100px; height: 100px">
          <img :src="scope.row.imageUrl" class="image-small">
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠券名称">
        <template slot-scope="scope">
          <span>{{ scope.row.couponName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠券ID">
        <template slot-scope="scope">
          <span>{{ scope.row.couponId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠券类型">
        <template slot-scope="scope">
          <span>{{ scope.row.couponType | filterCouponTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否启用">
        <template slot-scope="scope">
          <span>{{ scope.row.isValid?"启用":"禁用" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新日期">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click.native.prevent="editRow(scope.row)">编辑</el-button>
          <!-- <el-button type="primary" size="small" @click.native.prevent="approveRow(scope.row.productId)" v-if="scope.row.productStatus.statusId==0">审核</el-button> -->
          <!-- <el-button type="primary" size="small" @click.native.prevent="offShop(scope.row.productId)" v-if="scope.row.productStatus.statusId==1">下架</el-button> -->
          <el-button
            type="danger"
            size="small"
            @click.native.prevent="disableRow(scope.row)"
          >{{ scope.row.isValid?'禁用':'启用' }}</el-button>
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

    <el-dialog title="优惠券配置" :visible.sync="editDialogVisible">
      <el-form :model="curCouponItem">
        <el-form-item v-if="!isAddCoupon" label="id" :label-width="formLabelWidth">
          <el-input v-model="curCouponItem.id" autocomplete="off" :disabled="!isAddCoupon" />
        </el-form-item>
        <el-form-item label="优惠类型" :label-width="formLabelWidth">
          <el-select v-model="curCouponItem.couponType" placeholder="请选择优惠类型">
            <el-option
              v-for="item in couponTypeSelects"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券名称" :label-width="formLabelWidth">
          <el-input v-model="curCouponItem.couponName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="优惠券ID" :label-width="formLabelWidth">
          <el-input v-model="curCouponItem.couponId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch
            v-model="curCouponItem.isValid"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="优惠券图片" :label-width="formLabelWidth">
          <pictureupload
            :img-list="couponPics"
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
import { queryList, editCoupon, addCoupon } from '@/api/mini-program/coupon'
import { parseTime } from '@/utils/index.js'
import pictureupload from '@/components/PictureUpload'
export default {
  name: 'Coupon',
  components: {
    pictureupload
  },
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
      isAddCoupon: true,
      list: [],
      listQuery: {
        title: ''
      },
      activeName: 'CN',
      createdTimes: 0,
      currentPage: 1,
      curCouponItem: {
        couponType: 'MALL',
        couponName: '',
        couponId: '',
        imageUrl: '',
        isValid: true
      },
      formLabelWidth: '120px',
      couponTypeSelects: [
        {
          value: 'MALL',
          label: '好品质商城'
        },
        {
          value: 'FOLIDAY',
          label: '复游旅行'
        },
        {
          value: 'FHOTO',
          label: '复游拍'
        }
      ],
      couponPics: [],
      listResult: {}
    }
  },
  watch: {},
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {},
    handleCreate() {
      this.isAddCoupon = true
      this.editDialogVisible = true
      this.curCouponItem = {}
      this.curCouponItem.isValid = false
      console.log(JSON.stringify(this.curCouponItem))
    },
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
    editRow(couponItem) {
      this.editDialogVisible = true
      this.isAddCoupon = false
      this.curCouponItem = couponItem
      console.log('点击了编辑按钮')
      console.log(this.curCouponItem)
      this.couponPics = []
      this.couponPics.push(this.curCouponItem.imageUrl)
    },
    disableRow(item) {
      this.curCouponItem = item
      this.$confirm(
        this.curCouponItem.isValid
          ? '确定要禁用此条数据吗?'
          : '确定要启用此条数据吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.curCouponItem.isValid = !this.curCouponItem.isValid
          this.isAddCoupon = false
          this.addOrEditCoupon()
        })
        .catch(() => {})
    },
    addOrEditCoupon() {
      console.log(JSON.stringify(this.curCouponItem))
      if (this.isAddCoupon) {
        addCoupon(this.curCouponItem).then(data => {
          postMessage('添加成功')
          this.getList()
        })
      } else {
        editCoupon(this.curCouponItem).then(data => {
          postMessage('修改成功')
          this.getList()
        })
      }
      this.editDialogVisible = false
    },
    uploadCouponPicture(item) {
      this.curCouponItem.imageUrl = item
    },
    uploadPictureRemove(item) {
      this.curCouponItem.imageUrl = ''
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
