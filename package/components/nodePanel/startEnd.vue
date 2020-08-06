<template>
  <div>
    <x-form ref="xForm" v-model="formData" :config="formConfig" />
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
export default {
  mixins: [mixinPanel],
  data() {
    return {
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
            xType: 'input',
            name: 'initiator',
            label: '发起人',
            show: !!_this.showConfig.initiator
          },
          {
            xType: 'input',
            name: 'formKey',
            label: '表单标识key',
            show: !!_this.showConfig.formKey
          }
        ]
      }
    }
  },
  watch: {
    'formData.initiator': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:initiator': val })
      } else {
        delete this.element.businessObject.$attrs[`flowable:initiator`]
      }
    },
    'formData.formKey': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:formKey': val })
      } else {
        delete this.element.businessObject.$attrs[`flowable:formKey`]
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
          }
        }
        this.formData = cache
      },
      immediate: true
    }
  }
}
</script>

<style>

</style>
