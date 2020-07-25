<template>
  <div ref="propertyPanel" class="property-panel">
    <taskPanel v-if="element" :element="element" :modeler="modeler" :users="users" :groups="groups" />
  </div>
</template>

<script>
import taskPanel from './nodePanel/task'
export default {
  name: 'PropertyPanel',
  components: { taskPanel },
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
        {
          value: 'manager',
          label: '经理'
        },
        {
          value: 'personnel',
          label: '人事'
        },
        {
          value: 'charge',
          label: '主管'
        }
      ]
    }
  },
  mounted() {
    this.handleModeler()
  },
  methods: {
    handleModeler() {
      this.modeler.on('selection.changed', e => {
        // hack 同类型面板不刷新
        this.element = null
        this.$nextTick().then(() => {
          const element = e.newSelection[0]
          this.element = element
        })
      })
    }
  }
}
</script>

<style lang="scss">
.property-panel {
  position: absolute;
  right: 0px;
  top: 0px;
  border-left: 1px solid #cccccc;
  padding: 20px 20px;
  width: 300px;
  height: 100%;
  // reset element css
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 6px;
  }
}
</style>
