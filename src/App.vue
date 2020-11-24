<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
  // 监听路由更变
  // watch: {
  //   $route() {
  //     // console.log(this.$route.path)
  //     window.sessionStorage.setItem('routePath', this.$route.path)
  //     return this.$route
  //   }
  // }
}
</script>
<style>
*{
  margin: 0;
  padding: 0;
}
body .el-table th.gutter{
  display: table-cell!important;
}
</style>
