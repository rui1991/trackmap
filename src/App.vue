<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('webStore')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('webStore'))))
    }
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('webStore', JSON.stringify(this.$store.state))
    })
  }
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
