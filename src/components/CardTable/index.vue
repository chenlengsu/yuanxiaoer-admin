
<template>
  <div>
    <el-table
      v-loading="loading"
      highlight-current-row
      style="width: 100%"
      :data="data"
      row-key="id"
      :lazy="isLazy"
      :tree-props="treeProps"
      :load="load"
      @row-click="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        :label="labelName"
      /> -->
      <el-table-column v-if="isCheckbox" type="selection" width="55" />
      <template v-for="(item,index) in labelColumns">
        <el-table-column
          :key="index"
          :min-width="item.width"
          :show-overflow-tooltip="true"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
        />
      </template>
      <el-table-column label="操作" :width="btnWidth" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-show="isShowQueryMenu"
            type="primary"
            size="mini"
            @click="goMenu(scope)"
          >菜单管理</el-button>
          <el-button
            v-show="isShowQueryMenu"
            type="primary"
            size="mini"
            @click="goRole(scope)"
          >角色管理</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="openDialog(scope)"
          >编辑</el-button>
          <el-button
            v-show="isDelShow"
            type="danger"
            size="mini"
            @click="handleDel(scope)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CardTable',
  props: {
    loading: Boolean,
    data: {
      type: Array,
      default: function() {
        return [{
          name: '',
          remark: ''
        }]
      }
    },
    labelColumns: {
      type: Array,
      default: function() {
        return [{
          name: '名称'
        }]
      }
    },
    btnWidth: {
      type: String,
      default: '350px'
    },
    isShowQueryMenu: Boolean, // 是否显示功能按钮
    isDelShow: Boolean, // 是否显示删除按钮
    isCheckbox: Boolean, // 是否开启checkbox
    isLazy: Boolean, // 是否懒加载
    treeProps: { // 根据哪个字段判断是否有子集
      type: Object,
      default: function() {
        return {
          hasChildren: 'hasChildren'
        }
      }
    }
  },
  methods: {
    // 懒加载 方法
    load(tree, treeNode, resolve) {
      this.$emit('load',
        tree, treeNode, resolve
      )
    },
    // 多选方法
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val)
    },
    // 跳转到 菜单管理，并传值
    goMenu(scope) {
      this.$emit('goMenu',
        scope.row
      )
    },
    // 跳转到 角色管理，并传值
    goRole(scope) {
      this.$emit('goRole',
        scope.row
      )
    },
    // 打开 dialog
    openDialog(scope) {
      this.$emit('openDialog',
        'edit',
        scope.$index,
        scope.row
      )
    },
    // 删除
    handleDel(scope) {
      this.$emit('handleDel', scope.row, scope.$index)
    },
    // 点击当前行 执行的操作
    handleCurrentChange(row) {
      this.$emit('handleCurrentChange', row)
    }
  }
}
</script>

<style scoped>
</style>
