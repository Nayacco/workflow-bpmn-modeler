<template>
  <div>
    <x-form ref="xForm" v-model="formData" :config="formConfig" />
  </div>
</template>

<script>
import mixinPanel from '../common/mixinPanel'
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
            xType: 'colorPicker',
            name: 'color',
            label: '节点颜色'
          }
        ]
      }
    }
  },
  watch: {
    'formData.processCategory': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:processCategory': val })
      } else {
        delete this.element.businessObject.$attrs['flowable:processCategory']
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
