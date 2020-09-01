# workflow-bpmn-modeler

🔥 本项目基于 `vue` 和 `bpmn.io@7.0` ，实现 flowable 的 modeler 流程设计器

## 预览

![20200818001755](https://cdn.jsdelivr.net/gh/goldsubmarine/cdn@master/blog/20200818001755.png)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FGoldSubmarine%2Fworkflow-bpmn-modeler.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FGoldSubmarine%2Fworkflow-bpmn-modeler?ref=badge_shield)

## 在线 demo

👉 https://goldsubmarine.github.io/workflow-bpmn-modeler/

## 安装

```bash
# 安装
yarn add workflow-bpmn-modeler
```

## 使用说明（最简demo）

```vue
<template>
  <div>
    <bpmn-modeler
      ref="refNode"
      :xml="xml"
      :users="users"
      :groups="groups"
      :categorys="categorys"
    />
    <el-button type="primary" @click="save">保存</el-button>
  </div>
</template>

<script>
import bpmnModeler from 'workflow-bpmn-modeler'

export default {
  components: {
    bpmnModeler
  },
  data() {
    return {
      xml: '', // 后端查询到的xml
      users: [
        { name: '张三', id: 'zhangsan' },
        { name: '李四', id: 'lisi' },
        { name: '王五', id: 'wangwu' }
      ],
      groups: [
        { name: 'web组', id: 'web' },
        { name: 'java组', id: 'java' },
        { name: 'python组', id: 'python' }
      ],
      categorys: [
        { name: 'OA', id: 'oa' },
        { name: '财务', id: 'finance' }
      ]
    }
  },
  methods: {
    getModelDetail() {
      // 发送请求，获取xml
      // this.xml = response.xml
    },
    async save() {
      const processModel = this.$refs['refNode'].getProcess()
      const xml = await this.$refs['refNode'].saveXML()
      const svg = await this.$refs['refNode'].saveImg()
      console.log(processModel, xml, svg)
    }
  }
}
</script>
```

## 进度

🐌

- [x] 用户任务
- [x] 适配其他任务
- [x] 开始结束节点配置
- [x] 流程线配置
- [x] 网关配置
- [x] 翻译
- [x] 流程属性配置
- [x] UI 美化
- [ ] 支持代码控制颜色
- [x] 增加操作按钮
- [x] 发布 npm 包

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020-present, charles


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FGoldSubmarine%2Fworkflow-bpmn-modeler.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FGoldSubmarine%2Fworkflow-bpmn-modeler?ref=badge_large)