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
body, div, p, span, i{
  margin:0;
  padding:0;
  box-sizing:border-box;
  -moz-box-sizing:border-box;
  -webkit-box-sizing:border-box;
}
#app {
  width: 100%;
  height: 100%;
}
</style>
