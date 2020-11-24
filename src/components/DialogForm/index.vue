<template>
  <el-dialog
    :title="title"
    :visible.sync="visibleForm"
    :before-close="handleDialogClose"
    width="30%"
  >

    <el-form ref="dialogForm" :model="formData" :rules="rules" :label-width="labelWidth">
      <el-form-item :label="labelName" prop="name">
        <el-input v-model="formData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item :label="labelRemark" prop="remark">
        <el-input v-model="formData.remark" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClose">取 消</el-button>
      <el-button
        v-if="isAddFun"
        type="primary"
        @click="handleAdd('dialogForm')"
      >确 定</el-button>
      <el-button v-else type="primary" @click="handleEdit('dialogForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Dialogform',
  props: {
    title: {
      type: String,
      default: '弹框'
    },
    visible: Boolean,
    formData: {
      type: Object,
      default: function() {
        return {
          name: '',
          remark: ''
        }
      }
    },
    labelWidth: {
      type: String,
      default: '120px'
    },
    labelName: {
      type: String,
      default: '输入框1'
    },
    labelRemark: {
      type: String,
      default: '输入框2'
    },
    isAddFun: Boolean
  },
  data() {
    return {
      visibleForm: false,
      rules: {
        name: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    visible(val) {
      this.visibleForm = val
    }
  },
  created() {
    this.visibleForm = this.visibel
  },
  methods: {
    handleDialogClose() {
      this.$refs['dialogForm'].resetFields()
      this.$emit('dialogClose', false)
    },
    handleAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('handleAdd', this.formData)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('handleEdit', this.formData)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
