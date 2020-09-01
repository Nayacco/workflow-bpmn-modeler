<template>
  <div>
    <x-form ref="xForm" v-model="formData" :config="formConfig">
      <template #executionListener>
        <el-badge :value="executionListenerLength">
          <el-button size="small" @click="dialogName = 'executionListenerDialog'">编辑</el-button>
        </el-badge>
      </template>
    </x-form>
    <executionListenerDialog
      v-if="dialogName === 'executionListenerDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishExecutionListener"
    />
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import executionListenerDialog from './property/executionListener'
export default {
  components: {
    executionListenerDialog
  },
  mixins: [mixinPanel],
  props: {
    users: {
      type: Array,
      required: true
    },
    groups: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      userTypeOption: [
        { label: '指定人员', value: 'assignee' },
        { label: '候选人员', value: 'candidateUsers' },
        { label: '候选组', value: 'candidateGroups' }
      ],
      dialogName: '',
      executionListenerLength: 0,
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
            xType: 'input',
            name: 'id',
            label: '节点 id',
            rules: [{ required: true, message: 'Id 不能为空' }]
          },
          {
            xType: 'input',
            name: 'name',
            label: '节点名称'
          },
          {
            xType: 'colorPicker',
            name: 'color',
            label: '节点颜色'
          },
          {
            xType: 'slot',
            name: 'executionListener',
            label: '执行监听器'
          },
          {
            xType: 'select',
            name: 'userType',
            label: '人员类型',
            dic: _this.userTypeOption,
            show: !!_this.showConfig.userType
          },
          {
            xType: 'select',
            name: 'assignee',
            label: '指定人员',
            allowCreate: true,
            filterable: true,
            dic: { data: _this.users, label: 'name', value: 'id' },
            show: !!_this.showConfig.assignee && _this.formData.userType === 'assignee'
          },
          {
            xType: 'select',
            name: 'candidateUsers',
            label: '候选人员',
            multiple: true,
            allowCreate: true,
            filterable: true,
            dic: { data: _this.users, label: 'name', value: 'id' },
            show: !!_this.showConfig.candidateUsers && _this.formData.userType === 'candidateUsers'
          },
          {
            xType: 'select',
            name: 'candidateGroups',
            label: '候选组',
            multiple: true,
            allowCreate: true,
            filterable: true,
            dic: { data: _this.groups, label: 'name', value: 'id' },
            show: !!_this.showConfig.candidateGroups && _this.formData.userType === 'candidateGroups'
          },
          {
            xType: 'switch',
            name: 'async',
            label: '异步',
            activeText: '是',
            inactiveText: '否',
            show: !!_this.showConfig.async
          },
          {
            xType: 'input',
            name: 'priority',
            label: '优先级',
            show: !!_this.showConfig.priority
          },
          {
            xType: 'input',
            name: 'formKey',
            label: '表单标识key',
            show: !!_this.showConfig.formKey
          },
          {
            xType: 'input',
            name: 'skipExpression',
            label: '跳过表达式',
            show: !!_this.showConfig.skipExpression
          },
          {
            xType: 'switch',
            name: 'isForCompensation',
            label: '是否为补偿',
            activeText: '是',
            inactiveText: '否',
            show: !!_this.showConfig.isForCompensation
          },
          {
            xType: 'switch',
            name: 'triggerable',
            label: '服务任务可触发',
            activeText: '是',
            inactiveText: '否',
            show: !!_this.showConfig.triggerable
          },
          {
            xType: 'switch',
            name: 'autoStoreVariables',
            label: '自动存储变量',
            activeText: '是',
            inactiveText: '否',
            show: !!_this.showConfig.autoStoreVariables
          },
          {
            xType: 'input',
            name: 'ruleVariablesInput',
            label: '输入变量',
            show: !!_this.showConfig.ruleVariablesInput
          },
          {
            xType: 'input',
            name: 'rules',
            label: '规则',
            show: !!_this.showConfig.rules
          },
          {
            xType: 'input',
            name: 'resultVariable',
            label: '结果变量',
            show: !!_this.showConfig.resultVariable
          },
          {
            xType: 'switch',
            name: 'exclude',
            label: '排除',
            activeText: '是',
            inactiveText: '否',
            show: !!_this.showConfig.exclude
          },
          {
            xType: 'input',
            name: 'class',
            label: '类',
            show: !!_this.showConfig.class
          },
          {
            xType: 'datePicker',
            type: 'datetime',
            name: 'dueDate',
            label: '到期时间',
            show: !!_this.showConfig.dueDate
          }
        ]
      }
    }
  },
  watch: {
    'formData.userType': function(val) {
      const types = ['assignee', 'candidateUsers', 'candidateGroups']
      types.forEach(type => {
        delete this.element.businessObject.$attrs[`flowable:${type}`]
        delete this.formData[type]
      })
    },
    'formData.assignee': function(val) {
      if (this.formData.userType !== 'assignee') return
      this.updateProperties({ 'flowable:assignee': val })
    },
    'formData.candidateUsers': function(val) {
      if (this.formData.userType !== 'candidateUsers') return
      this.updateProperties({ 'flowable:candidateUsers': val?.join(',') })
    },
    'formData.candidateGroups': function(val) {
      if (this.formData.userType !== 'candidateGroups') return
      this.updateProperties({ 'flowable:candidateGroups': val?.join(',') })
    },
    'formData.async': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:async': true })
      } else {
        delete this.element.businessObject.$attrs[`flowable:async`]
      }
    },
    'formData.dueDate': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:dueDate': val })
      } else {
        delete this.element.businessObject.$attrs[`flowable:dueDate`]
      }
    },
    'formData.formKey': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:formKey': val })
      } else {
        delete this.element.businessObject.$attrs[`flowable:formKey`]
      }
    },
    'formData.priority': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:priority': val })
      } else {
        delete this.element.businessObject.$attrs[`flowable:priority`]
      }
    },
    'formData.skipExpression': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:skipExpression': val })
      } else {
        delete this.element.businessObject.$attrs[`flowable:skipExpression`]
      }
    },
    'formData.isForCompensation': function(val) {
      if (val) {
        this.updateProperties({ 'isForCompensation': true })
      } else {
        delete this.element.businessObject.$attrs[`isForCompensation`]
      }
    },
    'formData.triggerable': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:triggerable': true })
      } else {
        delete this.element.businessObject.$attrs[`flowable:triggerable`]
      }
    },
    'formData.class': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:class': val })
      } else {
        delete this.element.businessObject.$attrs[`flowable:class`]
      }
    },
    'formData.autoStoreVariables': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:autoStoreVariables': true })
      } else {
        delete this.element.businessObject.$attrs[`flowable:autoStoreVariables`]
      }
    },
    'formData.exclude': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:exclude': true })
      } else {
        delete this.element.businessObject.$attrs[`flowable:exclude`]
      }
    },
    'formData.ruleVariablesInput': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:ruleVariablesInput': val })
      } else {
        delete this.element.businessObject.$attrs[`flowable:ruleVariablesInput`]
      }
    },
    'formData.rules': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:rules': val })
      } else {
        delete this.element.businessObject.$attrs[`flowable:rules`]
      }
    },
    'formData.resultVariable': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:resultVariable': val })
      } else {
        delete this.element.businessObject.$attrs[`flowable:resultVariable`]
      }
    },
    element: {
      handler: function(val) {
        const cache = {
          ...this.element.businessObject,
          ...this.element.businessObject.$attrs
        }
        // 移除flowable前缀，格式化数组
        for (const key in cache) {
          if (key.indexOf('flowable:') === 0) {
            const newKey = key.replace('flowable:', '')
            cache[newKey] = cache[key]
            delete cache[key]
            if (newKey === 'candidateUsers') {
              cache.userType = 'candidateUsers'
              cache[newKey] = cache[newKey]?.split(',') || []
            } else if (newKey === 'candidateGroups') {
              cache.userType = 'candidateGroups'
              cache[newKey] = cache[newKey]?.split(',') || []
            } else if (newKey === 'assignee') {
              cache.userType = 'assignee'
            }
          }
        }
        this.formData = cache
        this.computedExecutionListenerLength()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    computedExecutionListenerLength() {
      this.executionListenerLength = this.element.businessObject.extensionElements?.values?.length ?? 0
    },
    finishExecutionListener() {
      if (this.dialogName === 'executionListenerDialog') {
        this.computedExecutionListenerLength()
      }
      this.dialogName = ''
    }
  }
}
</script>

<style></style>
