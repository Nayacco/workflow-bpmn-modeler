<template>
  <div>
    <x-form ref="xForm" v-model="formData" :config="formConfig">
      <template #executionListener>
        <el-badge :value="executionListenerLength">
          <el-button size="small" @click="dialogName = 'executionListenerDialog'">编辑</el-button>
        </el-badge>
      </template>
      <template #signal>
        <el-badge :value="signalLength">
          <el-button size="small" @click="dialogName = 'signalDialog'">编辑</el-button>
        </el-badge>
      </template>
    </x-form>
    <executionListenerDialog
      v-if="dialogName === 'executionListenerDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishExecutionListener"
    />
    <signalDialog
      v-if="dialogName === 'signalDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishExecutionListener"
    />
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinExecutionListener from '../../common/mixinExecutionListener'
import signalDialog from './property/signal'
import { commonParse } from '../../common/parseElement'
export default {
  components: {
    signalDialog
  },
  mixins: [mixinPanel, mixinExecutionListener],
  data() {
    return {
      signalLength: 0,
      formData: {}
    }
  },
  computed: {
    formConfig() {
      const _this = this
      return {
        inline: false,
        item: [
          {
            xType: 'select',
            name: 'processCategory',
            label: '流程分类',
            dic: { data: _this.categorys, label: 'name', value: 'id' }
          },
          {
            xType: 'input',
            name: 'id',
            label: '流程标识key',
            rules: [{ required: true, message: 'Id 不能为空' }]
          },
          {
            xType: 'input',
            name: 'name',
            label: '流程名称'
          },
          {
            xType: 'input',
            name: 'documentation',
            label: '节点描述'
          },
          {
            xType: 'slot',
            name: 'executionListener',
            label: '执行监听器'
          },
          {
            xType: 'slot',
            name: 'signal',
            label: '信号定义'
          }
        ]
      }
    }
  },
  watch: {
    'formData.processCategory': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:processCategory': val })
    }
  },
  created() {
    this.formData = commonParse(this.element)
  },
  methods: {
    computedSignalLength() {
      this.signalLength = this.element.businessObject.extensionElements?.values?.length ?? 0
    },
    finishSignal() {
      if (this.dialogName === 'signalDialog') {
        this.computedSignalLength()
      }
      this.dialogName = ''
    }
  }
}
</script>

<style>

</style>
