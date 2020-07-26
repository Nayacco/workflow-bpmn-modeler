<template>
  <div id="app">
    <vue-bpmn />

  </div>
</template>

<script>
import VueBpmn from '../package/index'
export default {
  components: {
    VueBpmn
  }
}
</script>

<style lang="scss">
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
