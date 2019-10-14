<template>
  <div class="dashboard-container">
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

    <el-dialog title="酒店客房配置" :visible.sync="editDialogVisible">
      <el-form ref="dataForm" :rules="rules" :model="currentRoomModal" label-position="left">
        <el-form-item v-if="!isAddRoomModal" label="客房id" :label-width="formLabelWidth">
          <el-input v-model="currentRoomModal.id" autocomplete="off" :disabled="!isAddRoomModal" />
        </el-form-item>
        <el-form-item label="客房名称" :label-width="formLabelWidth" prop="bannerName">
          <el-input v-model="currentRoomModal.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="客房图片" :label-width="formLabelWidth" prop="roomImage">
          <pictureupload
            :img-list="currentRoomModal.roomImage ? [...currentRoomModal.roomImage] : []"
            :limit="1"
            @uploadimg="uploadRoomImage"
            @removeimg="uploadRoomImageRemove"
          />
        </el-form-item>
        <el-form-item label="客房视频缩略图" :label-width="formLabelWidth" prop="roomVideoThumbnail">
          <pictureupload
            :img-list="currentRoomModal.roomVideoThumbnail ? [...currentRoomModal.roomVideoThumbnail] : []"
            :limit="1"
            @uploadimg="uploadRoomVideoThumbnail"
            @removeimg="uploadRoomVideoThumbnailRemove"
          />
        </el-form-item>
        <el-form-item label="客房banners列表" :label-width="formLabelWidth" prop="roomBanners">
          <pictureupload
            :img-list="JSON.parse(currentRoomModal.roomBanners)"
            :limit="15"
            @uploadimg="uploadRoomBanners"
            @removeimg="uploadRoomBannersRemove"
          />
        </el-form-item>
        <el-form-item label="客房视频" :label-width="formLabelWidth" prop="roomVideo">
          <videoupload
            img-path="hotel-room"
            :video-src-url="currentRoomModal.roomVideo"
            @uploadSuccess="uploadVideoSuccess"
            @removeVideo="removeVideo"
          />
        </el-form-item>
        <el-form-item label="客房面积" :label-width="formLabelWidth" prop="area">
          <el-input v-model="currentRoomModal.area" autocomplete="off" />
        </el-form-item>
        <el-form-item label="客房种类" :label-width="formLabelWidth" prop="typeName">
          <el-input v-model="currentRoomModal.typeName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="客房总结" :label-width="formLabelWidth" prop="roomSummary">
          <el-input v-model="currentRoomModal.roomSummary" autocomplete="off" />
        </el-form-item>
        <el-form-item label="入住人数" :label-width="formLabelWidth" prop="peopleCount">
          <el-input v-model="currentRoomModal.peopleCount" autocomplete="off" />
        </el-form-item>
        <el-form-item label="客房描述" :label-width="formLabelWidth" prop="body">
          <el-input v-model="currentRoomModal.body" :autosize="{ minRows: 4, maxRows: 8}" type="textarea" autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否可预定" :label-width="formLabelWidth">
          <el-switch
            v-model="currentRoomModal.roomCanReserve"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="客房设施" :label-width="formLabelWidth" prop="roomFacility">
          <el-input v-model="currentRoomModal.roomFacility" :autosize="{ minRows: 4, maxRows: 8}" type="textarea" autocomplete="off" />
        </el-form-item>
        <el-form-item label="客房设施列表" :label-width="formLabelWidth" prop="roomFacilitys">
          <el-input v-model="currentRoomModal.roomFacilitys" :autosize="{ minRows: 4, maxRows: 8}" type="textarea" autocomplete="off" />
        </el-form-item>
        <el-form-item label="客房图片描述" :label-width="formLabelWidth" prop="roomImageMessages">
          <el-input v-model="currentRoomModal.roomImageMessages" :autosize="{ minRows: 4, maxRows: 8}" type="textarea" autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch
            v-model="currentRoomModal.valid"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addOrEditItem">{{ isAddRoomModal ? '新 增' : '确 定' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryList, editItem, addItem } from '@/api/mini-program/room'
import pictureupload from '@/components/PictureUpload'
import videoupload from '@/components/VideoUpload'

export default {
  name: 'Home',
  components: {
    pictureupload,
    videoupload
  },
  data() {
    return {
      currentPage: 1,
      list: [],
      rules: {},
      listLoading: false,
      editDialogVisible: false,
      currentRoomModal: {
        roomBanners: '[]'
      },
      isAddRoomModal: false,
      formLabelWidth: '120px',
      roomPics: [], // 客房图片
      videoThumbnails: [],
      listResult: {}
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
        console.log(data.data.list)
        this.list = data.data.list
        this.listResult = data.data
      })
    },
    handleCreate() {
      this.isAddRoomModal = true
      this.editDialogVisible = true
      this.roomPics = []
      this.videoThumbnails = []
      this.currentRoomModal = {
        roomBanners: '[]'
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    },
    addOrEditItem(item) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isAddRoomModal) {
            console.log(this.currentRoomModal)
            addItem(this.currentRoomModal).then(() => {
              this.$message('添加成功')
              this.getList()
            })
          } else {
            editItem(this.currentRoomModal).then(data => {
              this.$message('修改成功')
              this.getList()
            })
          }
        }
      })
      this.editDialogVisible = false
    },
    editRow(item) {
      this.isAddRoomModal = false
      this.editDialogVisible = true
      this.currentRoomModal = Object.assign({}, item)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSizeChange() {},
    handleCurrentChange() {
      this.getList()
    },
    uploadRoomImage(item) {
      this.currentRoomModal.roomImage = item
    },
    uploadRoomImageRemove() {
      this.currentRoomModal.roomImage = ''
    },
    uploadRoomVideoThumbnail(item) {
      this.currentRoomModal.roomVideoThumbnail = item
    },
    uploadRoomVideoThumbnailRemove() {
      this.currentRoomModal.roomVideoThumbnail = ''
    },
    uploadVideoSuccess(item) {
      this.currentRoomModal.roomVideo = item
    },
    removeVideo() {
      this.currentRoomModal.roomVideo = ''
    },
    uploadRoomBanners(item) {
      console.log(item)
      let parsedBanners = JSON.parse(this.currentRoomModal.roomBanners)
      parsedBanners = [...parsedBanners, item]
      this.currentRoomModal.roomBanners = JSON.stringify(parsedBanners)
    },
    uploadRoomBannersRemove(newList) {
      console.log(newList)
      this.currentRoomModal.roomBanners = JSON.stringify(newList)
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
