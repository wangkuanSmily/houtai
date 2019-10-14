<template>
  <div>
    <template
      v-if="videoSrcUrl === ''"
    >
      <el-upload
        list-type="picture-card"
        :action="baseUrl"
        :on-progress="uploadVideoProcess"
        :on-success="handleUploadSuccess"
        :before-upload="handleBeforeUpload"
        :on-preview="handlePictureCardPreview"
      >
        <i
          v-if="!isUploading"
          class="el-icon-plus"
        />
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt>
      </el-dialog>
    </template>
    <template
      v-else
    >
      <video
        v-if="videoSrcUrl !== ''"
        :src="videoSrcUrl"
        :autoplay="false"
        preload="metadata"
        controls="controls"
      >
        您的浏览器不支持播放
      </video>
      <div>
        <el-button type="danger" @click="removeVideo">
          删除重传
        </el-button>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    imgPath: {
      type: String,
      default: 'funat-server'
    }
  },
  data() {
    return {
      baseUrl:
          process.env.VUE_APP_ADMIN_API +
          'adminapi/file/uploadFile?path=' +
          this.imgPath,
      videoUploadPercent: 0,
      isUploading: false,
      videoSrcUrl: '',
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created() {
  },
  methods: {
    handleBeforeUpload(file) {
      const fileSize = file.size / 1024 / 1024 < 50
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      if (!fileSize) {
        this.$message.error('视频大小不能超过50MB')
        return false
      }
      this.isUploading = true
      return true
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoUploadPercent = file.percentage.toFixed(0) * 1
    },
    handleUploadSuccess(res, file) {
      this.isUploading = false
      this.videoUploadPercent = 0
      this.$emit('uploadSuccess', res.data.data.imageUrl)
      this.videoSrcUrl = res.data.data.imageUrl
      this.$message('上传成功')
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    removeVideo() {
      this.$emit('removeVideo')
      this.videoSrcUrl = ''
    }
  }
}
</script>

<style scoped>

</style>
