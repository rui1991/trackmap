<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body{
  width: 100%;
  height: 100%;
}
body, div, p, ul, li, span, i{
  margin:0;
  padding:0;
  box-sizing:border-box;
  -moz-box-sizing:border-box;
  -webkit-box-sizing:border-box;
}
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
  background: #e2e2e2;
}
#app {
  width: 100%;
  height: 100%;
}
</style>
