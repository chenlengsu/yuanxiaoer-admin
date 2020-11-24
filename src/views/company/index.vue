<template>
  <div class="company">
    <el-row :gutter="10">
      <!-- 公司列表 -->
      <el-col
        :xs="24"
        :sm="24"
        :md="10"
        :lg="11"
        :xl="11"
        style="margin-bottom: 10px"
      >
        <el-card class="box-card">
          <el-input
            v-model="selectName"
            placeholder="公司名称查询"
            size="small"
            style="width: 180px; margin-right: 10px"
          />
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="queryCompany"
          >查询</el-button>
          <!-- 操作按钮 -->
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            style="float: right"
            @click="openDialog('add')"
          >新增公司</el-button>

          <!-- 表格 -->
          <cardTable
            v-if="isShowCom"
            ref="tableCom"
            class="tableCom"
            :data="companyData"
            :loading="companyLoading"
            label-name="名称"
            label-remark="备注"
            :is-show-query-menu="false"
            :is-del-show="true"
            :label-columns="labelColumns"
            btn-width="180px"
            @handleCurrentChange="handleCurrentChange"
            @openDialog="openDialog"
            @handleDel="handleDelCom"
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
      </el-col>
      <!-- 项目列表 -->
      <el-col :xs="24" :sm="24" :md="14" :lg="13" :xl="13">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>项目列表</span>
            <!-- 操作按钮 -->
            <el-button
              style="float: right"
              type="success"
              size="mini"
              icon="el-icon-plus"
              @click="openDialogPro('add')"
            >新增项目</el-button>
          </div>
          <!-- 表格 -->
          <cardTable
            v-if="isShowPro"
            ref="tablePro"
            :data="proData"
            :loading="loading"
            label-name="名称"
            label-remark="备注"
            :is-show-query-menu="true"
            :is-del-show="true"
            :label-columns="labelColumns"
            @goMenu="goMenu"
            @goRole="goRole"
            @openDialog="openDialogPro"
            @handleDel="handleDelPro"
          />
          <!-- 分页 -->
          <div class="block" style="float: right">
            <el-pagination
              :current-page="paginationPro.currentPage"
              :page-sizes="[10, 20, 30]"
              :page-size="paginationPro.pageSize"
              layout="total, prev, pager, next,sizes"
              :total="paginationPro.tableTotal"
              @size-change="handleSizeChangePro"
              @current-change="handleCurrentChangePagePro"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- dialog 弹框 -->
    <dialogForm
      :title="dialogTit"
      :visible="dialogFormVisible"
      :form-data="formData"
      label-width="120px"
      label-name="公司名称"
      label-remark="备注"
      :is-add-fun="isAddFun"
      @handleAdd="addCompany"
      @handleEdit="handleEditCom"
      @dialogClose="dialogFormVisible = false"
    />
    <dialogForm
      :title="dialogTitPro"
      :visible="dialogFormVisiblePro"
      :form-data="formChildData"
      label-width="120px"
      label-name="项目名称"
      label-remark="备注"
      :is-add-fun="isAddProFun"
      @handleAdd="handleAddPro"
      @handleEdit="handleEditPro"
      @dialogClose="dialogFormVisiblePro = false"
    />
  </div>
</template>
<script>
import {
  queryCompanyList,
  queryCompanyDemoList,
  addCompany,
  updateCompany,
  delCompany,
  addPro,
  updatePro,
  delPro
} from '@/api/companyPro'
import dialogForm from '@/components/DialogForm'
import cardTable from '@/components/CardTable'
export default {
  name: 'Company',
  components: {
    dialogForm,
    cardTable
  },
  data() {
    return {
      selectName: '',
      companyData: [], // 公司list
      proData: [], // 公司项目list
      // 分页组件
      pagination: {
        currentPage: 1,
        tableTotal: null,
        pageSize: 10
      },
      paginationPro: {
        currentPage: 1,
        tableTotal: null,
        pageSize: 10
      },
      loading: false, // 加载 loading
      companyLoading: false, // 公司 加载loading
      // 公司所用数据
      formData: {
        id: Number,
        name: '',
        remark: '',
        sort: Number
      },
      // 公司项目所用数据
      formChildData: {
        id: Number,
        name: '',
        remark: ''
      },
      // 所展示项目的公司id
      comId: null,
      dialogFormVisible: false, // dialog 开关
      dialogFormVisiblePro: false, // dialog 开关
      // 是否 添加 方法
      isAddFun: true,
      // 是否 添加 方法
      isAddProFun: true,
      dialogTit: '新增公司',
      dialogTitPro: '新增项目',
      labelColumns: [{
        prop: 'name',
        label: '名称'
      }, {
        prop: 'remark',
        label: '备注'
      }],
      isShowCom: true,
      isShowPro: true,
      first: true // 判断是否第一次加载
    }
  },
  created() {
    this.queryCompany()
  },
  mounted() {
  },
  methods: {
    // 查询 公司 列表
    queryCompany() {
      const companyName = this.selectName
      this.selectName = ''
      this.companyLoading = true
      // console.log(companyName)
      queryCompanyList({
        size: this.pagination.pageSize,
        num: this.pagination.currentPage,
        companyName: companyName
      })
        .then((res) => {
          // console.log('com')
          if (res.data.records.length > 0) {
            if (this.first) {
              this.first = false
              this.comId = res.data.records[0].id
              this.queryPro(res.data.records[0].id)
            }
            const records = res.data.records.map((item) => {
              item.id = item.id.toString()
              return item
            })
            this.pagination.tableTotal = res.data.total
            this.companyData = records
            this.isShowCom = false
            this.$nextTick(() => {
              this.$refs.tableCom.$children[0].doLayout()
            })
          } else {
            this.companyData = []
            this.isShowCom = false
          }
          this.isShowCom = true
          this.companyLoading = false
        })
        .catch(() => {
          this.companyLoading = false
        })
    },
    // 查询 公司项目 列表
    queryPro(id) {
      const { pageSize, currentPage } = this.paginationPro
      queryCompanyDemoList({
        size: pageSize,
        num: currentPage,
        companyId: id
      })
        .then((res) => {
          // console.log('id:', id)
          // console.log('res:', res.data)
          // console.log('pro')
          // console.log('-----------------')
          if (res.data.records.length > 0) {
            const records = res.data.records.map((item) => {
              item.id = item.id.toString()
              return item
            })
            this.paginationPro.tableTotal = res.data.total
            this.proData = records
            this.isShowPro = false
            this.$nextTick(() => {
              // console.log(this.$refs.tablePro)
              this.$refs.tablePro.$children[0].doLayout()
            })
          } else {
            this.proData = []
            this.isShowPro = false
          }
          this.loading = false
          this.isShowPro = true
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击当前行加载 表2数据
    handleCurrentChange(row) {
      // console.log(this.comId)
      // console.log(row.id)
      if (String(this.comId) === String(row.id)) return false
      // console.log('click !')
      this.loading = true
      this.comId = row.id
      this.queryPro(row.id)
    },
    // 打开 公司 弹窗
    openDialog(type, index, row) {
      if (type !== 'add') {
        this.dialogTit = '修改公司'
        this.isAddFun = false
        this.formData = { ...row }
      } else {
        this.formData = this.$options.data().formData
        this.isAddFun = true
        this.dialogTit = '新增公司'
      }
      this.dialogFormVisible = true
    },
    // 添加 公司
    addCompany(formData) {
      this.loading = true
      addCompany({
        companyName: this.formData.name,
        companyRemark: this.formData.remark
      }).then((res) => {
        this.loading = false
        this.dialogFormVisible = false
        this.formData = {
          name: '',
          remark: ''
        }
        this.queryCompany()
      })
    },
    // 修改 公司
    handleEditCom() {
      updateCompany(this.formData).then((res) => {
        this.queryCompany()
        this.dialogFormVisible = false
      })
    },
    // 删除 公司
    handleDelCom(row, index) {
      console.log(row)
      this.$confirm('你确定要删除此公司数据嘛, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        delCompany(row.id)
          .then((res) => {
            this.loading = false
            // 更新 数据
            this.companyData.splice(index, 1)
            this.$set(
              this.pagination,
              this.pagination.tableTotal,
              this.pagination.tableTotal--
            )
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    //  修改 公司 当前分页
    handleCurrentChangePage(val) {
      this.companyLoading = true
      this.pagination.currentPage = val
      this.queryCompany()
    },
    //  修改 公司 每页展示的数据条数
    handleSizeChange(val) {
      this.companyLoading = true
      this.pagination.pageSize = val
      this.queryCompany()
    },
    //  修改 公司 项目 当前分页
    handleCurrentChangePagePro(val) {
      this.loading = true
      this.paginationPro.currentPage = val
      this.queryPro(this.comId)
    },
    //  修改 公司 项目 每页展示的数据条数
    handleSizeChangePro(val) {
      this.loading = true
      this.paginationPro.pageSize = val
      this.queryPro(this.comId)
    },
    // 打开 项目 弹窗
    openDialogPro(type, index, row) {
      if (type !== 'add') {
        this.isAddProFun = false
        this.formChildData = { ...row }
        this.dialogTitPro = '修改项目'
      } else {
        this.isAddProFun = true
        this.dialogTitPro = '新增项目'
        this.formChildData = this.$options.data().formChildData
      }
      this.dialogFormVisiblePro = true
    },
    // 添加 公司下 项目
    handleAddPro() {
      this.loading = true
      addPro({
        companyId: this.comId,
        proName: this.formChildData.name,
        proRemark: this.formChildData.remark
      }).then((res) => {
        this.loading = false
        this.dialogFormVisiblePro = false
        this.formChildData = {
          name: '',
          remark: ''
        }
        this.queryPro(this.comId)
      })
    },
    // 修改 公司下 项目
    handleEditPro() {
      this.loading = true
      updatePro(this.formChildData).then((res) => {
        this.loading = false
        this.dialogFormVisiblePro = false
        this.queryPro(this.comId)
      })
    },
    // 删除 公司下 项目
    handleDelPro(row, index) {
      console.log(row)
      this.$confirm('你确定要删除此项目数据嘛, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          delPro(row.id).then((res) => {
            this.loading = false
            this.proData.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {
            this.loading = false
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 跳转菜单页
    goMenu(row) {
      // console.log(row)
      this.$router.push({
        path: '/company/menu',
        query: {
          proCode: row.proCode
        }
      })
    },
    goRole(row) {
      this.$router.push({
        path: '/company/role',
        query: {
          proCode: row.proCode
        }
      })
    }
  }
}
</script>
<style lang="scss" >
.el-table{
    .el-table__fixed,
    .el-table__fixed-right{
       height: 100% !important;
     }
}
</style>
<style scoped>
.company{
  padding: 15px;
}

</style>
