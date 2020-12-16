<template>
  <div>
    <el-dialog
      title="任务监听器"
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
    <listenerParam v-if="showParamDialog" :value="formData.taskListener[nowIndex].params" @close="finishConfigParam" />
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
        taskListener: []
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
                label: '任务监听器',
                name: 'taskListener',
                column: [
                  {
                    label: '事件',
                    name: 'event',
                    width: 180,
                    rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                    xType: 'select',
                    dic: [
                      { label: 'create', value: 'create' },
                      { label: 'assignment', value: 'assignment' },
                      { label: 'complete', value: 'complete' },
                      { label: 'delete', value: 'delete' }
                    ],
                    tooltip: `create（创建）：当任务已经创建，并且所有任务参数都已经设置时触发。<br />
                              assignment（指派）：当任务已经指派给某人时触发。请注意：当流程执行到达用户任务时，在触发create事件之前，会首先触发assignment事件。<br />
                              complete（完成）：当任务已经完成，从运行时数据中删除前触发。<br />
                              delete（删除）：在任务即将被删除前触发。请注意任务由completeTask正常完成时也会触发。
                    `
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
                    ]
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
    this.formData.taskListener = this.element.businessObject.extensionElements?.values
      .filter(item => item.$type === 'flowable:TaskListener')
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
      const nowObj = this.formData.taskListener[index]
      if (!nowObj.params) {
        nowObj.params = []
      }
      this.showParamDialog = true
    },
    finishConfigParam(param) {
      this.showParamDialog = false
      // hack 数量不更新问题
      const cache = this.formData.taskListener[this.nowIndex]
      cache.params = param
      this.$set(this.formData.taskListener[this.nowIndex], this.nowIndex, cache)
      this.nowIndex = null
    },
    updateElement() {
      if (this.formData.taskListener?.length) {
        let extensionElements = this.element.businessObject.get('extensionElements')
        if (!extensionElements) {
          extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
        }
        // 清除旧值
        extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:TaskListener') ?? []
        this.formData.taskListener.forEach(item => {
          const taskListener = this.modeler.get('moddle').create('flowable:TaskListener')
          taskListener['event'] = item.event
          taskListener[item.type] = item.className
          if (item.params && item.params.length) {
            item.params.forEach(field => {
              const fieldElement = this.modeler.get('moddle').create('flowable:Field')
              fieldElement['name'] = field.name
              fieldElement[field.type] = field.value
              // 注意：flowable.json 中定义的string和expression类为小写，不然会和原生的String类冲突，此处为hack
              // const valueElement = this.modeler.get('moddle').create(`flowable:${field.type}`, { body: field.value })
              // fieldElement[field.type] = valueElement
              taskListener.get('fields').push(fieldElement)
            })
          }
          extensionElements.get('values').push(taskListener)
        })
        this.updateProperties({ extensionElements: extensionElements })
      } else {
        const extensionElements = this.element.businessObject[`extensionElements`]
        if (extensionElements) {
          extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:TaskListener') ?? []
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
