<template>
  <div ref="propertyPanel" class="property-panel">
    <component
      :is="getComponent"
      v-if="element"
      :element="element"
      :modeler="modeler"
      :users="users"
      :groups="groups"
      :categorys="categorys"
    />
  </div>
</template>

<script>
import taskPanel from './nodePanel/task'
import startEndPanel from './nodePanel/startEnd'
import processPanel from './nodePanel/process'
import sequenceFlowPanel from './nodePanel/sequenceFlow'
import gatewayPanel from './nodePanel/gateway'
export default {
  name: 'PropertyPanel',
  components: { processPanel, taskPanel, startEndPanel, sequenceFlowPanel, gatewayPanel },
  props: {
    users: {
      type: Array,
      required: true
    },
    groups: {
      type: Array,
      required: true
    },
    categorys: {
      type: Array,
      required: true
    },
    modeler: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      element: null,
      form: {
        id: '',
        name: '',
        color: null
      },
      roles: [
        { value: 'manager', label: '经理' },
        { value: 'personnel', label: '人事' },
        { value: 'charge', label: '主管' }
      ]
    }
  },
  computed: {
    getComponent() {
      const type = this.element?.type
      if (type === 'bpmn:StartEvent' || type === 'bpmn:EndEvent') {
        return 'startEndPanel'
      }
      if (type === 'bpmn:UserTask') {
        return 'taskPanel'
      }
      if (type === 'bpmn:SequenceFlow') {
        return 'sequenceFlowPanel'
      }
      if (type === 'bpmn:ExclusiveGateway') {
        return 'gatewayPanel'
      }
      if (type === 'bpmn:Process') {
        return 'processPanel'
      }
      return null
    }
  },
  mounted() {
    this.handleModeler()
  },
  methods: {
    handleModeler() {
      this.modeler.on('element.click', e => {
        const { element } = e
        console.log(element)
        if (element.type === 'bpmn:Process') {
          this.element = element
        }
      })
      this.modeler.on('selection.changed', e => {
        // hack 同类型面板不刷新
        this.element = null
        const element = e.newSelection[0]
        if (element) {
          this.$nextTick().then(() => {
            this.element = element
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.property-panel {
  padding: 20px 20px;
  // reset element css
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 6px;
  }
}
</style>
