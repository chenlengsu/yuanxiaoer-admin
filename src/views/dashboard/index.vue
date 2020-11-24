<template>
  <div class="dashboard">
    <el-row>
      <el-col
        :xs="24"
        :sm="24"
        :md="8"
        :lg="8"
        :xl="7"
        style="margin-bottom: 10px"
      >
        <el-card class="box-card" style="width:300px">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <el-upload
            ref="upload"
            :file-list="fileList"
            class="center"
            :class=" { uoloadSty: showBtnImg, disUoloadSty: noneBtnImg }"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="1"
            :on-exceed="exceed"
            :on-change="dealImgChange"
            :before-remove="handleRemove"
          >
            <!-- <i slot="default" class="el-icon-plus" /> -->
            <el-button slot="trigger" size="small" type="primary" icon="el-icon-upload2">上传头像</el-button>
            <div slot="file" slot-scope="{ file }">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in" />
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <i class="el-icon-download" />
                </span>
                <!-- <span>
                  <el-button slot="trigger" size="small" type="primary" icon="el-icon-upload2" />
                </span> -->
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete" />
                </span>
              </span>
            </div>

          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <el-form :model="formData" size="small" label-width="80px">
            <el-form-item label="登陆账号" style="text-align:right;">
              {{ name }}
            </el-form-item>
            <el-form-item label="用户昵称" style="text-align:right;"> 用户昵称 </el-form-item>
            <el-form-item
              label="安全设置"
              style="text-align:right;"
            ><a
              @click="passwordDialogVisible = true"
            >修改密码</a></el-form-item>
          </el-form>
          <el-dialog
            :visible.sync="passwordDialogVisible"
            title="修改密码"
            :before-close="handleDialogClose"
            width="580px"
          >
            <el-form
              :inline="true"
              :model="handleFormPasswordData"
              label-width="80px"
              size="small"
            >
              <el-form-item label="手机号">
                <el-input
                  v-model="handleFormPasswordData.name"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="验证码">
                <el-input
                  v-model="handleFormPasswordData.remark"
                  autocomplete="off"
                  style="width: 200px; margin-right: 10px"
                />
                <el-button type="primary">获取验证码</el-button>
              </el-form-item>
              <el-form-item label="新密码">
                <el-input
                  v-model="handleFormPasswordData.name"
                  autocomplete="off"
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="确认密码">
                <el-input
                  v-model="handleFormPasswordData.remark"
                  autocomplete="off"
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="handleDialogClose">取 消</el-button>
              <el-button
                type="primary"
                @click="passwordDialogVisible = false"
              >确 定</el-button>
            </div>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      formData: {
        name: '',
        remark: ''
      },
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      showBtnImg: true,
      noneBtnImg: false,
      passwordDialogVisible: false,
      handleFormPasswordData: {
        name: '',
        remark: ''
      }
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    exceed(files, fileList) {
      this.fileList = [
        { name: files[0].name }
      ]
    },
    dealImgChange(files, fileList) {
      // console.log(files)
      // console.log(fileList)
      this.fileList = fileList
      this.noneBtnImg = fileList.length >= 1
    },
    handleRemove(file) {
      console.log(file)
      const fileList = this.$refs.upload.uploadFiles
      const index = fileList.findIndex((fileItem) => {
        return fileItem.uid === file.uid
      })
      fileList.splice(index, 1)
      this.noneBtnImg = fileList.length >= 1
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true

      this.isShow = false
    },
    handleDownload(file) {
      console.log(file)
    },
    handleDialogClose() {
      this.passwordDialogVisible = false
    }
  }
}
</script>
<style>
.dashboard .el-upload--picture-card i{
  color: #fff;
  font-size: 14px;
}
.dashboard .el-upload--picture-card{
  border: none;

}
.dashboard .uoloadSty .el-upload--picture-card {
  width: auto;
  height: auto;
  line-height: initial;
  /* width: 110px;
  height: 110px;
  line-height: 110px; */
  /* position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%); */
}
/* .dashboard .el-upload-list--picture-card .el-upload-list__item{
  width: 110px;
  height: 110px;
  line-height: 110px;
} */
.dashboard .uoloadSty{
  position: relative;
  /* height: 110px; */
}
.dashboard .disUoloadSty .el-upload--picture-card {
    vertical-align: bottom;
    margin-bottom: 10px;
  /* 上传按钮隐藏 */
  /* display: none; */

  /* opacity: 0;
  width: 20px;
  height: 20px;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%,-50%);
  left: 50%;*/
}
</style>
<style lang="scss" scoped>
.dashboard {
  padding: 15px;
  &-container {
    margin: 30px;
  }
  .center{
    text-align: center;
    margin-bottom: 20px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  .el-form {
    a {
      color: blue;
    }
  }
}
</style>
