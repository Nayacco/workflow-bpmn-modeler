<template>
  <div>
    <el-dialog
      title="执行监听器"
      :visible.sync="dialogVisible"
      width="900px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @closed="$emit('close')"
    >
      <x-form ref="xForm" v-model="formData" :config="formConfig">
        <template #params="scope">
          <el-badge :value="scope.row.params ? scope.row.params.length : 0" type="primary">
            <el-button size="small" @click="configParam(scope.$index)">配置</el-button>
          </el-badge>
        </template>
      </x-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>
    <listenerParam v-if="showParamDialog" :value="formData.executionListener[nowIndex].params" @close="finishConfigParam" />
  </div>
</template>

<script>
import mixinPanel from '../../../common/mixinPanel'
import listenerParam from './listenerParam'
export default {
  components: { listenerParam },
  mixins: [mixinPanel],
  data() {
    return {
      dialogVisible: true,
      showParamDialog: false,
      nowIndex: null,
      formData: {
        executionListener: []
      }
    }
  },
  computed: {
    formConfig() {
    //   const _this = this
      return {
        inline: false,
        item: [
          {
            xType: 'tabs',
            tabs: [
              {
                label: '执行监听器',
                name: 'executionListener',
                column: [
                  {
                    label: '事件',
                    name: 'event',
                    width: 180,
                    rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                    xType: 'select',
                    dic: [
                      { label: 'start', value: 'start' },
                      { label: 'end', value: 'end' },
                      { label: 'take', value: 'take' }
                    ]
                  },
                  {
                    label: '类型',
                    name: 'type',
                    width: 180,
                    rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                    xType: 'select',
                    dic: [
                      { label: '类', value: 'class' },
                      { label: '表达式', value: 'expression' },
                      { label: '委托表达式', value: 'delegateExpression' }
                    ],
                    tooltip: `类：示例 com.company.MyCustomListener，自定义类必须实现 org.flowable.engine.delegate.TaskListener 接口 <br />
                              表达式：示例 \${myObject.callMethod(task, task.eventName)} <br />
                              委托表达式：示例 \${myListenerSpringBean} ，该 springBean 需要实现 org.flowable.engine.delegate.TaskListener 接口
                    `
                  },
                  {
                    label: 'java 类名',
                    name: 'className',
                    xType: 'input',
                    rules: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }]
                  },
                  {
                    xType: 'slot',
                    label: '参数',
                    width: 120,
                    slot: true,
                    name: 'params'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  mounted() {
    this.formData.executionListener = this.element.businessObject.extensionElements?.values
      .filter(item => item.$type === 'flowable:ExecutionListener')
      .map(item => {
        let type
        if ('class' in item) type = 'class'
        if ('expression' in item) type = 'expression'
        if ('delegateExpression' in item) type = 'delegateExpression'
        return {
          event: item.event,
          type: type,
          className: item[type],
          params: item.fields?.map(field => {
            let fieldType
            if ('stringValue' in field) fieldType = 'stringValue'
            if ('expression' in field) fieldType = 'expression'
            return {
              name: field.name,
              type: fieldType,
              value: field[fieldType]
            }
          }) ?? []
        }
      }) ?? []
  },
  methods: {
    configParam(index) {
      this.nowIndex = index
      const nowObj = this.formData.executionListener[index]
      if (!nowObj.params) {
        nowObj.params = []
      }
      this.showParamDialog = true
    },
    finishConfigParam(param) {
      this.showParamDialog = false
      // hack 数量不更新问题
      const cache = this.formData.executionListener[this.nowIndex]
      cache.params = param
      this.$set(this.formData.executionListener[this.nowIndex], this.nowIndex, cache)
      this.nowIndex = null
    },
    updateElement() {
      if (this.formData.executionListener?.length) {
        let extensionElements = this.element.businessObject.get('extensionElements')
        if (!extensionElements) {
          extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
        }
        // 清除旧值
        extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:ExecutionListener') ?? []
        this.formData.executionListener.forEach(item => {
          const executionListener = this.modeler.get('moddle').create('flowable:ExecutionListener')
          executionListener['event'] = item.event
          executionListener[item.type] = item.className
          if (item.params && item.params.length) {
            item.params.forEach(field => {
              const fieldElement = this.modeler.get('moddle').create('flowable:Field')
              fieldElement['name'] = field.name
              fieldElement[field.type] = field.value
              // 注意：flowable.json 中定义的string和expression类为小写，不然会和原生的String类冲突，此处为hack
              // const valueElement = this.modeler.get('moddle').create(`flowable:${field.type}`, { body: field.value })
              // fieldElement[field.type] = valueElement
              executionListener.get('fields').push(fieldElement)
            })
          }
          extensionElements.get('values').push(executionListener)
        })
        this.updateProperties({ extensionElements: extensionElements })
      } else {
        const extensionElements = this.element.businessObject[`extensionElements`]
        if (extensionElements) {
          extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:ExecutionListener') ?? []
        }
      }
    },
    closeDialog() {
      this.$refs.xForm.validate().then(() => {
        this.updateElement()
        this.dialogVisible = false
      }).catch(e => console.error(e))
    }
  }
}
</script>

<style>
.flow-containers  .el-badge__content.is-fixed {
    top: 18px;
}
</style>
