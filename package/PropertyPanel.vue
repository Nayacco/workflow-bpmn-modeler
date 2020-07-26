<template>
  <div ref="propertyPanel" class="property-panel">
    <component
      :is="getComponent"
      v-if="element"
      :element="element"
      :modeler="modeler"
      :users="users"
      :groups="groups"
    />
  </div>
</template>

<script>
import taskPanel from './nodePanel/task'
import startEndPanel from './nodePanel/startEnd'
import processPanel from './nodePanel/process'
import sequenceFlowPanel from './nodePanel/sequenceFlow'
export default {
  name: 'PropertyPanel',
  components: { processPanel, taskPanel, startEndPanel, sequenceFlowPanel },
  props: {
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
      users: [
        { label: '张三', value: 'zhangsan' },
        { label: '李四', value: 'lisi' },
        { label: '王五', value: 'wangwu' }
      ],
      groups: [
        { label: 'web组', value: 'web' },
        { label: 'java组', value: 'java' },
        { label: 'python组', value: 'python' }
      ],
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
            console.log(element)
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
