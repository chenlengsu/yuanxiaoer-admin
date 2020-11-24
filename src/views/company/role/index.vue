<template>
  <div class="role">
    <el-card class="box-card head">
      <div>
        <el-input
          v-model="selectForm.name"
          placeholder="角色名称查询"
          size="small"
          style="width: 180px; margin-right: 10px"
        />
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="queryList"
        >查询</el-button>
      </div>
    </el-card>
    <el-card class="box-card">
      <cardTable
        ref="table"
        style="width: 100%"
        :data="list"
        :loading="loading"
        :is-show-query-menu="false"
        :is-del-show="false"
        :label-columns="labelColumns"
        btn-width="100px"
        @openDialog="openDialog"
      />
      <!-- 分页 -->
      <div class="block" style="float: right">
        <el-pagination
          :current-page="pagination.currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="pagination.pageSize"
          layout="total, prev, pager, next,sizes"
          :total="pagination.tableTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChangePage"
        />
      </div>
    </el-card>
    <!-- dialog -->
    <el-dialog
      :title="title"
      :visible.sync="visibleForm"
      :before-close="handleDialogClose"
      width="680px"
    >
      <el-form ref="ruleForm" :model="formData" :rules="rules" size="small" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" style="width: 450px" />
        </el-form-item>
        <el-form-item label="角色备注">
          <el-input v-model="formData.remark" style="width: 450px" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <div class="tree-box">
            <div class="tree-container">
              <h3>pc</h3>
              <el-tree
                ref="treePc"
                :data="formData.pcMenus"
                node-key="id"
                :props="props"
                show-checkbox
                :default-checked-keys="defaultKeyPc"
                @check-change="handleCheckChange('Pc')"
              />
            </div>
            <div class="tree-container">
              <h3>applet</h3>
              <el-tree
                ref="treeApp"
                :data="formData.appMenus"
                node-key="id"
                :props="props"
                show-checkbox
                :default-checked-keys="defaultKeyApp"
                @check-change="handleCheckChange('App')"
              />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-foote  r">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="handleEdit('ruleForm')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoles,
  getMenuIdsByRoleId,
  getProAllTree,
  updateRole
} from '@/api/role'
import cardTable from '@/components/CardTable'
export default {
  name: 'Role',
  components: {
    cardTable
  },
  data() {
    return {
      proCode: null,
      pagination: {
        currentPage: 1,
        tableTotal: null,
        pageSize: 10
      },
      selectForm: {
        name: ''
      },
      loading: false,
      list: [],
      labelColumns: [
        {
          prop: 'name',
          label: '角色名称'
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          prop: 'createTime',
          label: '创建时间'
        }
      ],
      formData: {
        name: '',
        remark: '',
        pcMenus: [],
        appMenus: []
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      props: {
        label: 'name',
        children: 'children'
      },
      visibleForm: false,
      title: 'dialog',
      defaultKeyPc: [],
      defaultKeyApp: []
    }
  },
  created() {
    if (this.$route.query.proCode) {
      this.proCode = this.$route.query.proCode
      // 默认初始加载是顶级 -1
      this.getRoles()
    } else {
      this.$router.push({
        path: '/company'
      })
      this.$message({
        type: 'error',
        message: '请先选择项目!',
        duration: 1500
      })
      return
    }
  },
  beforeRouteLeave(to, from, next) {
    to.meta.keeplive = true
    next()
  },
  methods: {
    queryList() {
      this.getRoles(this.selectForm.name)
      this.selectForm.name = ''
    },
    getRoles(name) {
      getRoles(this.proCode, {
        size: 10,
        num: 0,
        query: {
          name: name === undefined ? '' : name
        }
      }).then((res) => {
        // console.log(res)
        this.list = res.data.records
        this.pagination.tableTotal = res.data.total
      }).catch(() => {})
    },
    openDialog(type, index, row) {
      // console.log()
      this.formData = { ...row }

      // console.log(this.formData)
      this.getProAllTree(row.id)
    },
    handleDialogClose() {
      this.visibleForm = false
      this.$refs['ruleForm'].resetFields()
    },
    handleCheckChange(type) {
      const res = this.$refs[`tree${type}`].getCheckedKeys()
      // console.log(res)
      if (type === 'Pc') {
        this.defaultKeyPc = res
      } else {
        this.defaultKeyApp = res
      }
    },
    handleEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateRole(this.proCode, {
            id: this.formData.id,
            name: this.formData.name,
            remark: this.formData.remark,
            menuIds: this.defaultKeyPc.concat(this.defaultKeyApp)
          })
            .then((res) => {
              console.log(res)
              if (res.code === 202) {
                this.$message({
                  type: 'success',
                  message: '更新成功!'
                })
                this.getRoles()
                this.visibleForm = false
              }
            })
            .catch(() => {})
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getProAllTree(id) {
      getProAllTree(this.proCode)
        .then((res) => {
          this.formData.pcMenus = res.data.pcMenu
          this.formData.appMenus = res.data.appMenu
          // console.log(this.formData)
          getMenuIdsByRoleId(this.proCode, id).then((res) => {
            // console.log('ids', res)
            // this.defaultKeyPc = res.data
            this.defaultKeyPc = res.data.menuIdList
            this.defaultKeyApp = res.data.menuIdAppList

            this.visibleForm = true
          })
        })
        .catch(() => {})
    },
    //  修改 当前分页
    handleCurrentChangePage(val) {
      this.loading = true
      this.pagination.currentPage = val
      this.getRoles()
    },
    //  修改  每页展示的数据条数
    handleSizeChange(val) {
      this.loading = true
      this.pagination.pageSize = val
      this.getRoles()
    }
  }
}
</script>

<style scoped>
.role {
  padding: 15px;
}
.head {
  margin-bottom: 10px;
}
.tree-box {
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.tree-container {
  flex: 1;
  border: 1px solid #ccc;
  padding: 8px;
  margin-right: 8px;
  height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
