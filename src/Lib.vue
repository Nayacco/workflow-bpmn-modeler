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
    window.addEventListener('message', event => {
      const eventType = event.data.type
      const eventData = event.data.data
      if (eventType === 'set') {
        this.set(eventData)
      }
      if (eventType === 'get') {
        this.get()
      }
    })
  },
  methods: {
    set(eventData) {
      this.xml = eventData.xml
      this.users = eventData.users ?? []
      this.groups = eventData.groups ?? []
      this.categorys = eventData.categorys ?? []
    },
    async get() {
      const process = await this.$refs['refNode'].getProcess()
      const xml = await this.$refs['refNode'].saveXML()
      const img = await this.$refs['refNode'].saveImg()
      window.parent.postMessage({
        process: process,
        xml: xml,
        img: img
      }, '*')
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
