<template>
  <div class="workflow-bpmn-modeler">
    <bpmn-modeler
      ref="refNode"
      :xml="xml"
      :users="users"
      :groups="groups"
      :categorys="categorys"
    />
  </div>
</template>

<script>
import bpmnModeler from '../package/index'
export default {
  components: {
    bpmnModeler
  },
  data() {
    return {
      xml: '', // 后端查询到的xml
      users: [],
      groups: [],
      categorys: []
    }
  },
  mounted() {
    window.getProcess = this.$refs['refNode'].getProcess
    window.saveXML = this.$refs['refNode'].saveXML
    window.saveImg = this.$refs['refNode'].saveImg
  },
  methods: {
    setXML(xml) {
      this.xml = xml
    },
    setUsers(users) {
      this.users = users
    },
    setGroups(groups) {
      this.groups = groups
    },
    setCategorys(categorys) {
      this.categorys = categorys
    }
  }
}
</script>

<style lang="scss">
.workflow-bpmn-modeler {
  height: 100%;
  margin: 0;
}
</style>
