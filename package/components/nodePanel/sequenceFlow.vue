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
            name: 'conditionExpression',
            label: '跳转条件'
          },
          {
            xType: 'input',
            name: 'skipExpression',
            label: '跳过表达式'
          }
        ]
      }
    }
  },
  watch: {
    'formData.conditionExpression': function(val) {
      if (val) {
        const newCondition = this.modeler.get('moddle').create('bpmn:FormalExpression', { body: `<![CDATA[${val}]]>` })
        this.updateProperties({ conditionExpression: newCondition })
      } else {
        delete this.element.businessObject[`conditionExpression`]
      }
    },
    'formData.skipExpression': function(val) {
      if (val) {
        this.updateProperties({ 'skipExpression': val })
      } else {
        delete this.element.businessObject.$attrs[`skipExpression`]
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
          if (key === 'conditionExpression') {
            cache[key] = cache[key].body?.replace(/<!\[CDATA\[(.+)\]\]>/, '$1')
            cache[key] = cache[key].body?.replace(/&lt;!\[CDATA\[(.+)\]\]&gt;/, '$1')
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
