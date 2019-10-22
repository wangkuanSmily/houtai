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
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="房型图片">
        <template slot-scope="scope" style="width: 100px; height: 100px">
          <img :src="scope.row.banners.split(',')[0]" class="image-small">
        </template>
      </el-table-column>
      <el-table-column align="center" label="注意事项">
        <template slot-scope="scope">
          <span class="description">{{ scope.row.attention }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系电话">
        <template slot-scope="scope">
          <span>{{ scope.row.contactPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述信息">
        <template slot-scope="scope">
          <span class="description">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设施类型">
        <template slot-scope="scope">
          <span>{{ scope.row.facilityType | matchFacilityType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="营业时间">
        <template slot-scope="scope">
          <span>{{ scope.row.openTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="摘要">
        <template slot-scope="scope">
          <span class="description">{{ scope.row.summary }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标签">
        <template slot-scope="scope">
          <span>{{ scope.row.tag }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否启用">
        <template slot-scope="scope">
          <span>{{ scope.row.valid?"启用":"禁用" }}</span>
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

    <el-dialog title="设施配置" :visible.sync="editDialogVisible">
      <el-form :model="curItem">
        <el-form-item v-if="!isAdd" label="id" :label-width="formLabelWidth">
          <el-input v-model="curItem.id" autocomplete="off" :disabled="!isAdd" />
        </el-form-item>
        <el-form-item label="设施类型" :label-width="formLabelWidth">
          <el-select v-model="curItem.couponType" placeholder="请选择设施类型">
            <el-option
              v-for="item in facilityTypeSelects"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券名称" :label-width="formLabelWidth">
          <el-input v-model="curItem.couponName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="优惠券ID" :label-width="formLabelWidth">
          <el-input v-model="curItem.couponId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch v-model="curItem.valid" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item label="列表图" :label-width="formLabelWidth">
          <pictureupload
            :img-list="listPic"
            :limit="1"
            @uploadimg="uploadPicture"
            @removeimg="uploadPictureRemove"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addOrEditItem">{{ isAdd?'新 增':'确 定' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryList, addItem, editItem } from '@/api/mini-program/facility'
import { parseTime } from '@/utils/index.js'
import pictureupload from '@/components/PictureUpload'

export default {
  name: 'Home',
  components: {
    pictureupload
  },
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return parseTime(date)
    },
    matchFacilityType(type) {
      switch (type) {
        case 0:
          return '休闲娱乐'
        case 1:
          return '餐厅'
        case 2:
          return '特色服务'
      }
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      editDialogVisible: false,
      listLoading: false,
      isAdd: true,
      currentPage: 1,
      list: [],
      listResult: {},
      listQuery: {
        title: ''
      },
      curItem: {},
      facilityTypeSelects: [
        {
          value: 0,
          label: '休闲娱乐'
        },
        {
          value: 1,
          label: '餐厅'
        },
        {
          value: 2,
          label: '特色服务'
        }
      ],
      listPic: []
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      queryList({
        pageNo: this.currentPage,
        pageSize: 10
      }).then(res => {
        this.list = res.data.list
        this.listResult = res.data
      })
    },
    handleFilter() {},
    handleCreate() {
      this.isAdd = true
      this.editDialogVisible = true
      this.curItem = {}
      this.listPic = []
      this.curItem.valid = false
      console.log(JSON.stringify(this.curItem))
    },
    handleSizeChange() {},
    handleCurrentChange() {
      this.getList()
    },
    uploadPicture(item) {
      console.log('上传成功=====>' + item)
      this.curItem.imageUrl = item
    },
    uploadPictureRemove(item) {
      this.curItem.imageUrl = ''
    },
    addOrEditItem() {
      console.log(JSON.stringify(this.curItem))
      if (this.isAdd) {
        addItem(this.curItem).then(data => {
          postMessage('添加成功')
          this.getList()
        })
      } else {
        editItem(this.curItem).then(data => {
          postMessage('修改成功')
          this.getList()
        })
      }
      this.editDialogVisible = false
    },
    editRow(item) {
      this.editDialogVisible = true
      this.isAdd = false
      this.curItem = item
      console.log('点击了编辑按钮')
      console.log(this.curItem)
      this.listPic = []
      for (var p in this.curItem.banners) {
        this.listPic.push(p)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.description {
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space: wrap;
  width: 110px;
  height: 120px;
  display: block;
}
.image-small {
  width: 150px;
  height: 80px;
}
</style>
