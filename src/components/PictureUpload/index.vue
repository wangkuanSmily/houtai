<template>
  <div class="pictureupload">
    <el-upload
      :action="baseUrl"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :on-exceed="handleExceed"
      :before-remove="beforeRemove"
      name="file"
      multiple
      :on-success="upLoadSuccess"
      :limit="limit"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>
<script>
// import { getToken } from "@/utils/auth";
// import store from "@/store";
export default {
  props: {
    imgList: {
      type: Array,
      default: () => []
    },
    // 父组件传递的图片列表
    limit: {
      type: Number,
      default: 1
    },
    // 图片数量限制
    img: {
      type: String,
      default: ''
    },
    imgPath: {
      type: String,
      default: 'funat-server'
    }
  },
  data() {
    return {
      fileList: [],
      upLoadData: {
        file: ''
      },
      baseUrl:
        process.env.VUE_APP_ADMIN_API +
        'adminapi/file/uploadFile?path=' +
        this.imgPath,
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  watch: {
    imgList: {
      handler(newValue, oldValue) {
        console.log('PictureUpload imgList变化了=====>')
        console.log('变化之前的值=====>')
        console.log(newValue)
        console.log(oldValue)
        if (newValue.length === 0) {
          this.fileList = []
          return
        }
        for (let i = 0; i < newValue.length; i++) {
          if (oldValue[i] !== newValue[i]) {
            this.fileList = []
            newValue.forEach(el => {
              this.fileList.push({ url: el })
            })
            return
          }
        }
      },
      deep: true
    },
    img: {
      handler(newValue, oldValue) {
        if (newValue !== '' && newValue.length > 0) {
          this.fileList = []
          this.fileList.push({ url: newValue })
        }
      }
    }
  },
  mounted() {
    if (this.imgList.length !== 0) {
      this.imgList.forEach(el => {
        this.fileList.push({ url: el })
      })
    }
  },
  methods: {
    // 图片移除时处理数据
    handleRemove(file, fileList) {
      const item = []
      fileList.forEach(el => {
        item.push(el.url)
      })
      this.$emit('removeimg', item)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }, // 判断图片数量
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(file, fileList) {}, // 上传图片成功事件
    upLoadSuccess(response) {
      console.log('子控件上传成功=========>')
      console.log(response)
      this.$emit('uploadimg', response.data.data.imageUrl)
      this.$message('上传成功')
    }
  }
}
</script>
