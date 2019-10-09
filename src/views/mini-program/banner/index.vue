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
      <el-table-column align="center" label="Banner图片">
        <template slot-scope="scope" style="width: 100px; height: 100px">
          <img :src="scope.row.imageUrl" class="image-small">
        </template>
      </el-table-column>
      <el-table-column align="center" label="BannerName">
        <template slot-scope="scope">
          <span>{{ scope.row.bannerName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="跳转链接">
        <template slot-scope="scope">
          <el-link :href="scope.row.jumpUrl" target="_blank" type="primary">{{ scope.row.jumpUrl }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="BannerID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
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

    <el-dialog title="Banner配置" :visible.sync="editDialogVisible">
      <el-form :model="curBannerItem">
        <el-form-item v-if="!isAddBanner" label="id" :label-width="formLabelWidth">
          <el-input v-model="curBannerItem.id" autocomplete="off" :disabled="!isAddBanner" />
        </el-form-item>
        <el-form-item label="Banner名称" :label-width="formLabelWidth">
          <el-input v-model="curBannerItem.bannerName" autocomplete="off" />
        </el-form-item>
        <!-- <el-form-item label="跳转类型" :label-width="formLabelWidth">
          <el-input v-model="curBannerItem.jumpUrl" autocomplete="off" />
        </el-form-item>-->
        <el-form-item label="跳转链接" :label-width="formLabelWidth">
          <el-input v-model="curBannerItem.jumpUrl" autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch
            v-model="curBannerItem.isValid"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="Banner图片" :label-width="formLabelWidth">
          <pictureupload
            :img-list="bannerPics"
            :limit="1"
            img-path="bannerServer"
            @uploadimg="uploadPicture"
            @removeimg="uploadPictureRemove"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addOrEditItem">{{ isAddBanner?'新 增':'确 定' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryList, editBanner, addBanner } from '@/api/mini-program/banner'
import { parseTime } from '@/utils/index.js'
import pictureupload from '@/components/PictureUpload'

export default {
  name: 'Home',
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return parseTime(date)
    }
  },
  components: {
    pictureupload
  },
  data() {
    return {
      formLabelWidth: '120px',
      editDialogVisible: false,
      listLoading: false,
      isAddBanner: true,
      currentPage: 1,
      list: [],
      listResult: {},
      listQuery: {
        title: ''
      },
      curBannerItem: {},
      bannerPics: []
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
      }).then(data => {
        this.list = data.data.list
        this.listResult = data.data
      })
    },
    updateBanner(bannerItem) {
      editBanner(bannerItem).then(res => {})
    },
    handleFilter() {},
    handleCreate() {
      this.isAddBanner = true
      this.editDialogVisible = true
      this.curBannerItem = {}
      this.bannerPics = []
      this.curBannerItem.isValid = false
      console.log(JSON.stringify(this.curBannerItem))
    },
    handleSizeChange() {},
    handleCurrentChange() {
      this.getList()
    },
    uploadPicture(item) {
      console.log('上传成功=====>' + item)
      this.curBannerItem.imageUrl = item
    },
    uploadPictureRemove(item) {
      this.curBannerItem.imageUrl = ''
    },
    addOrEditItem() {
      console.log(JSON.stringify(this.curBannerItem))
      if (this.isAddCoupon) {
        addBanner(this.curBannerItem).then(data => {
          postMessage('添加成功')
          this.getList()
        })
      } else {
        editBanner(this.curBannerItem).then(data => {
          postMessage('修改成功')
          this.getList()
        })
      }
      this.editDialogVisible = false
    },
    editRow(item) {}
  }
}
</script>

<style scoped>
.image-small {
  width: 150px;
  height: 80px;
}
</style>
