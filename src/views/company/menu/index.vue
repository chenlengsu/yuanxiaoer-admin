<template>
  <div class="menu">
    <el-tabs
      v-model="tabActive"
      @tab-click="
        getMenu();
        clearTree();
      "
    >
      <el-tab-pane label="PC菜单" name="Pc">
        <el-card class="box-card">
          <!-- 操作按钮 -->
          <div slot="header" class="clearfix">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-plus"
              @click="openDialog('add')"
            >添加菜单</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              :disabled="MultipleSelectionlength > 1 ? false : true"
              @click="batchDel()"
            >批量删除</el-button>
          </div>
          <!-- 表格 -->
          <cardTable
            v-if="isShow"
            ref="tablePc"
            :data="list"
            :loading="loading"
            :is-show-query-menu="false"
            :is-checkbox="true"
            :is-del-show="true"
            :label-columns="labelColumns"
            :is-lazy="true"
            :tree-props="{ hasChildren: 'hasChildren' }"
            btn-width="180px"
            @load="load"
            @handleSelectionChange="handleSelectionChange"
            @openDialog="openDialog"
            @handleDel="handleDel"
          />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="AppLet菜单" name="Applet">
        <el-card class="box-card">
          <!-- 操作按钮 -->
          <div slot="header" class="clearfix">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-plus"
              @click="openDialog('add')"
            >添加菜单</el-button>
            <el-button
              :disabled="MultipleSelectionlength > 1 ? false : true"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="batchDel()"
            >批量删除</el-button>
          </div>
          <!-- 表格 -->
          <cardTable
            v-if="isShow"
            ref="tableAppLet"
            :data="list"
            :loading="loading"
            :is-show-query-menu="false"
            :is-checkbox="true"
            :is-del-show="true"
            :label-columns="labelColumns"
            :is-lazy="true"
            :tree-props="{ hasChildren: 'hasChildren' }"
            @load="load"
            @handleSelectionChange="handleSelectionChange"
            @openDialog="openDialog"
            @handleDel="handleDel"
          />
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- dialog -->
    <el-dialog
      :title="title"
      :visible.sync="visibleForm"
      :before-close="handleDialogClose"
      width="580px"
    >
      <el-form ref="ruleForm" :model="formData" :inline="true" :rules="rules" size="small" label-width="80px">
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="formData.menuType" size="small">
            <el-radio-button :label="1">目录</el-radio-button>
            <el-radio-button :label="2">菜单</el-radio-button>
            <el-radio-button :label="3">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名" prop="name">
          <el-input v-model="formData.name" style="width: 178px" />
        </el-form-item>
        <el-form-item label="菜单权限标识" prop="permission">
          <el-input v-model="formData.permission" style="width: 178px" />
        </el-form-item>
        <el-form-item label="前端url" prop="path">
          <el-input v-model="formData.path" style="width: 178px" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="formData.icon" style="width: 178px" />
        </el-form-item>
        <el-form-item label="路由地址" prop="routePath">
          <el-input v-model="formData.routePath" style="width: 178px" />
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group
            v-model="formData.display"
            size="mini"
            style="width: 178px"
          >
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="2">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序值" prop="sort">
          <el-input-number
            v-model="formData.sort"
            controls-position="right"
            :min="1"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" style="width: 450px" />
        </el-form-item>
        <el-form-item label="上级类目">
          <el-select
            ref="treeSelect"
            v-model="mineStatus"
            clearable
            placeholder="请选择"
            style="width: 450px"
          >
            <el-option :value="mineStatusVal" style="height: auto; padding: 0">
              <el-tree
                :props="props"
                :load="loadNode"
                lazy
                :highlight-current="true"
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
              />
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button
          v-if="isAddFun"
          type="primary"
          @click="handleAdd('ruleForm')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="handleEdit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cardTable from '@/components/CardTable'
import { getMenu, addMenu, updateMenu, delMenu, batchDel } from '@/api/menu'
export default {
  name: 'Menu',
  components: {
    cardTable
  },
  data() {
    return {
      proCode: null,
      // tabs active
      tabActive: 'Pc',
      // table
      isShow: true,
      list: [],
      // table 各项属性
      labelColumns: [
        {
          prop: 'name',
          label: '名称',
          width: 160
        },
        // {
        //   prop: 'id',
        //   label: 'id',
        //   width: 160
        // },
        {
          prop: 'type',
          label: '类型',
          formatter: (row) => {
            return row.type.desc
          }
        },
        {
          prop: 'sort',
          label: '排序'
        },
        {
          prop: 'permission',
          label: '菜单权限标识',
          width: 110
        },
        {
          prop: 'icon',
          label: '图标'
        },
        {
          prop: 'path',
          label: '前端url'
        },
        {
          prop: 'routePath',
          label: '路由地址'
        },
        {
          prop: 'display',
          label: '是否显示',
          formatter: (row) => {
            return row.display === 1 ? '显示' : '隐藏'
          }
        },
        {
          prop: 'state',
          label: '是否启用',
          formatter: (row) => {
            return row.state.desc
          }
        },
        {
          prop: 'createTime',
          label: '创建时间',
          width: 115
        }
      ],
      maps: new Map(), // 存储 懒加载 数据 方便更新
      loading: false,
      multipleSelection: [], // 选中数组
      // dialog
      visibleForm: false,
      labelWidth: '130px',
      isAddFun: true,
      title: 'dialog',
      // 弹框数据
      formData: {
        parentId: '',
        name: '',
        type: 1,
        menuType: 1,
        permission: '',
        path: '',
        icon: '',
        routePath: '',
        display: 1,
        state: 2,
        menuState: 2,
        sort: 1,
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入菜单名', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入菜单权限标识', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入前端url', trigger: 'blur' }
        ],
        routePath: [
          { required: true, message: '请输入路由地址', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入图标', trigger: 'blur' }
        ]
      },
      // select tree
      mineStatus: '',
      mineStatusVal: {},
      props: {
        label: 'name',
        isLeaf: 'hasChildren'
      },
      node_had: undefined,
      resolve_had: undefined
    }
  },
  computed: {
    MultipleSelectionlength: function() {
      return this.multipleSelection.length
    }
  },
  created() {
    if (this.$route.query.proCode) {
      this.proCode = this.$route.query.proCode
      // 默认初始加载是顶级 -1
      this.getMenu()
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
    // tree select lazy
    loadNode(node, resolve) {
      if (node.level === 0) {
        return getMenu(this.tabActive, {
          proCode: this.proCode,
          parentId: -1
        }).then((res) => {
          this.node_had = node // 保存根节点
          this.resolve_had = resolve // 保存根节点
          this.mineStatus = '顶级类目'
          this.mineStatusVal = {
            name: '顶级类目',
            id: -1,
            hasChildren: !(res.data.length > 0)
          }
          return resolve([
            {
              name: '顶级类目',
              hasChildren: !(res.data.length > 0),
              id: -1
            }
          ])
        })
      }
      return getMenu(this.tabActive, {
        proCode: this.proCode,
        parentId: node.data.id
      }).then((res) => {
        const list = res.data.map((item) => {
          return {
            ...item,
            hasChildren: !item.hasChildren
          }
        })
        return resolve(list)
      })
    },
    handleNodeClick(data) {
      this.mineStatusVal = data
      this.mineStatus = data.name
      this.$refs.treeSelect.blur()
    },
    // 清空树的方法
    clearTree() {
      if (this.node_had && this.resolve_had) {
        this.node_had.childNodes = []
        this.loadNode(this.node_had, this.resolve_had) // 再次执行懒加载的方法
      }
    },
    // 获取菜单
    getMenu(parentId) {
      getMenu(this.tabActive, {
        proCode: this.proCode,
        parentId: parentId === undefined ? -1 : parentId
      }).then((res) => {
        const data = res.data
        data.forEach((item) => {
          item['proCode'] = item.proId
        })
        this.list = data
      })
    },
    // 懒加载
    load(tree, treeNode, resolve) {
      const id = tree.id
      this.maps.set(id, { tree, treeNode, resolve })
      getMenu(this.tabActive, {
        proCode: this.proCode,
        parentId: id
      }).then((res) => {
        const nodes = res.data.map((item) => {
          return { ...item, grandFatherId: tree.parentId }
        })
        resolve(nodes)
      })
    },
    // 监听checkbox 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 打开 dialog
    openDialog(type, index, row) {
      // console.log(row)
      if (type === 'edit') {
        this.title = '编辑菜单'
        this.formData = {
          ...row,
          menuType: row.type.value,
          menuState: row.state.value
        }
        this.isAddFun = false
      } else {
        this.title = '新增菜单'
        // this.formData 置为初始状态
        this.formData = this.$options.data().formData
        this.isAddFun = true
      }
      this.visibleForm = true
    },
    // 关闭 dialog
    handleDialogClose() {
      this.visibleForm = false
      this.$refs['ruleForm'].resetFields()
    },
    // 添加
    handleAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
          this.formData.display = Number(this.formData.display)
          this.formData.parentId = this.mineStatusVal.id
          const parentId = this.formData.parentId
          addMenu(this.tabActive, {
            ...this.formData,
            proCode: this.proCode
          })
            .then((res) => {
              this.visibleForm = false
              // 更新父级
              if (parentId && this.maps.get(parentId)) {
                const { tree, treeNode, resolve } = this.maps.get(parentId)
                this.load(tree, treeNode, resolve)
              } else {
                this.getMenu()
              }
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
            })
            .catch(() => {
              this.visibleForm = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑
    handleEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const parentId = this.mineStatusVal.id
          this.isShow = false
          updateMenu({
            ...this.formData,
            parentId: parentId
          })
            .then((res) => {
              this.getMenu()
              this.isShow = true
              this.visibleForm = false
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              // 更新父级
              // if (parentId !== -1 && this.maps.get(parentId)) {
              //   const { tree, treeNode, resolve } = this.maps.get(parentId)
              //   this.load(tree, treeNode, resolve)
              // }
              // if (currentParentId && this.maps.get(currentParentId)) {
              //   const { tree, treeNode, resolve } = this.maps.get(currentParentId)
              //   this.load(tree, treeNode, resolve)
              // }
              // if (grandFatherId !== -1 && this.maps.get(grandFatherId)) {
              //   const { tree, treeNode, resolve } = this.maps.get(grandFatherId)
              //   this.load(tree, treeNode, resolve)
              // }
            })
            .catch(() => {
              this.visibleForm = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除
    handleDel(row, index) {
      console.log(row)
      this.$confirm('你确定要删除此菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定执行
        this.loading = true
        // 删除请求
        delMenu(row.id)
          .then((res) => {
            this.loading = false
            // 更新 数据
            const parentId = row.parentId
            const grandFatherId = row.grandFatherId
            if (parentId && this.maps.get(parentId)) {
              const { tree, treeNode, resolve } = this.maps.get(parentId)
              this.load(tree, treeNode, resolve)
            }
            if (grandFatherId !== -1 && this.maps.get(grandFatherId)) {
              const { tree, treeNode, resolve } = this.maps.get(grandFatherId)
              this.load(tree, treeNode, resolve)
            } else {
              this.getMenu()
            }
            this.$set(
              this.$refs[`table${this.tabActive}`].store.states.lazyTreeNodeMap,
              parentId,
              []
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
    // 批量删除
    batchDel() {
      this.$confirm('你确定要删除此菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map((item) => {
          return item.id
        })
        const parentIds = this.multipleSelection.map((item) => {
          return item.parentId
        })
        // 点击确定执行
        this.loading = true
        // 删除请求
        batchDel(ids).then((res) => {
          ids.forEach((id) => {
            if (id !== -1 && this.maps.get(id)) {
              const { tree, treeNode, resolve } = this.maps.get(id)
              this.load(tree, treeNode, resolve)
            }
            this.$set(
              this.$refs[`table${this.tabActive}`].store.states.lazyTreeNodeMap,
              id,
              []
            )
          })
          parentIds.forEach((id) => {
            if (id !== -1 && this.maps.get(id)) {
              const { tree, treeNode, resolve } = this.maps.get(id)
              this.load(tree, treeNode, resolve)
            } else {
              this.getMenu()
            }
            this.$set(
              this.$refs[`table${this.tabActive}`].store.states.lazyTreeNodeMap,
              id,
              []
            )
          })
          this.loading = false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    }
  }
}
</script>

<style scoped>
.menu {
  padding: 15px;
}
</style>
