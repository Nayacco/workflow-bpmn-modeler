<template>
  <div>
    <el-dialog
      title="信号定义"
      :visible.sync="dialogVisible"
      width="700px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @closed="$emit('close')"
    >
      <x-form ref="xForm" v-model="formData" :config="formConfig" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixinPanel from '../../../common/mixinPanel'
export default {
  mixins: [mixinPanel],
  data() {
    return {
      dialogVisible: true,
      formData: {
        signal: []
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
                label: '信号定义',
                name: 'signal',
                column: [
                  {
                    label: 'scope',
                    name: 'scope',
                    width: 180,
                    rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                    xType: 'select',
                    dic: [
                      { label: '全局', value: 'start' },
                      { label: '流程实例', value: 'end' }
                    ]
                  },
                  {
                    label: 'id',
                    name: 'id',
                    width: 200,
                    rules: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
                    xType: 'input'
                  },
                  {
                    label: '名称',
                    name: 'name',
                    xType: 'input',
                    rules: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }]
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
    // this.formData.signal = this.element.businessObject.extensionElements?.values.map(item => {
    //   let type
    //   if ('class' in item.$attrs) type = 'class'
    //   if ('expression' in item.$attrs) type = 'expression'
    //   if ('delegateExpression' in item.$attrs) type = 'delegateExpression'
    //   return {
    //     event: item.$attrs.event,
    //     type: type,
    //     className: item.$attrs[type]
    //   }
    // }) ?? []
  },
  methods: {
    updateElement() {
      if (this.formData.signal?.length) {
        let extensionElements = this.element.businessObject.get('extensionElements')
        if (!extensionElements) {
          extensionElements = this.modeler.get('moddle').create('bpmn:signal')
        }
        const length = extensionElements.get('values').length
        for (let i = 0; i < length; i++) {
          // 清除旧值
          extensionElements.get('values').pop()
        }
        this.updateProperties({ extensionElements: extensionElements })
      } else {
        const extensionElements = this.element.businessObject[`extensionElements`]
        if (extensionElements) {
          extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:ExecutionListener')
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
