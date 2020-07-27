<template>
  <div>
    <x-form ref="xForm" v-model="formData" :config="formConfig" />
  </div>
</template>

<script>
import mixinPanel from '../common/mixinPanel'
export default {
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
            xType: 'select',
            name: 'userType',
            label: '人员类型',
            dic: _this.userTypeOption
          },
          {
            xType: 'select',
            name: 'assignee',
            label: '指定人员',
            allowCreate: true,
            filterable: true,
            dic: { data: _this.users, label: 'name', value: 'id' },
            show: _this.formData.userType === 'assignee'
          },
          {
            xType: 'select',
            name: 'candidateUsers',
            label: '候选人员',
            multiple: true,
            allowCreate: true,
            filterable: true,
            dic: { data: _this.users, label: 'name', value: 'id' },
            show: _this.formData.userType === 'candidateUsers'
          },
          {
            xType: 'select',
            name: 'candidateGroups',
            label: '候选组',
            multiple: true,
            allowCreate: true,
            filterable: true,
            dic: { data: _this.groups, label: 'name', value: 'id' },
            show: _this.formData.userType === 'candidateGroups'
          },
          {
            xType: 'switch',
            name: 'async',
            label: '异步',
            activeText: '是',
            inactiveText: '否'
          },
          {
            xType: 'input',
            name: 'priority',
            label: '优先级'
          },
          {
            xType: 'input',
            name: 'formKey',
            label: '表单标识key'
          },
          {
            xType: 'input',
            name: 'skipExpression',
            label: '跳过表达式'
          },
          {
            xType: 'datePicker',
            type: 'datetime',
            name: 'dueDate',
            label: '到期时间'
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
      },
      immediate: true
    }
  }
}
</script>

<style></style>
