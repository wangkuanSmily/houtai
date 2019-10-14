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
    <el-dialog title="酒店客房配置" :visible.sync="editDialogVisible">
      <el-form ref="dataForm" :rules="rules" :model="currentRoomModal" label-position="left">
        <el-form-item v-if="!isAddRoomModal" label="id" :label-width="formLabelWidth">
          <el-input v-model="currentRoomModal.id" autocomplete="off" :disabled="!isAddRoomModal" />
        </el-form-item>
        <el-form-item label="客房名称" :label-width="formLabelWidth" prop="bannerName">
          <el-input v-model="currentRoomModal.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="客房图片" :label-width="formLabelWidth" prop="roomImage">
          <pictureupload
            :img-list="roomPics"
            :limit="1"
            @uploadimg="uploadRoomImage"
            @removeimg="uploadRoomImageRemove"
          />
        </el-form-item>
        <el-form-item label="客房视频缩略图" :label-width="formLabelWidth" prop="roomVideoThumbnail">
          <pictureupload
            :img-list="videoThumbnails"
            :limit="1"
            @uploadimg="uploadRoomVideoThumbnail"
            @removeimg="uploadRoomVideoThumbnailRemove"
          />
        </el-form-item>
        <el-form-item label="客房视频" :label-width="formLabelWidth" prop="roomVideo">
          <videoupload
            img-path="hotel-room"
            @uploadSuccess="uploadVideoSuccess"
            @removeVideo="removeVideo"
          />
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
import { queryList, editItem } from '@/api/mini-program/room'
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
      currentRoomModal: {},
      isAddRoomModal: false,
      formLabelWidth: '120px',
      roomPics: [], // 客房图片
      videoThumbnails: []
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
    },
    addOrEditItem(item) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isAddRoomModal) {
          } else {
            editItem(this.currentRoomModal).then(data => {
              postMessage('修改成功')
              this.getList()
            })
          }
        }
        this.editDialogVisible = false
        this.clearCurrentRoomModal()
      })
    },
    clearCurrentRoomModal() {
      this.currentRoomModal = {}
    },
    editRow(item) {
      this.isAddRoomModal = false
      this.editDialogVisible = true
      this.currentRoomModal = Object.assign({}, item)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
