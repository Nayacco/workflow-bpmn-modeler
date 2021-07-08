[English](./README.md) | 简体中文

# workflow-bpmn-modeler

[![NPM Version](http://img.shields.io/npm/v/workflow-bpmn-modeler.svg?style=flat)](https://www.npmjs.org/package/workflow-bpmn-modeler)
[![NPM Downloads](https://img.shields.io/npm/dm/workflow-bpmn-modeler.svg?style=flat)](https://www.npmjs.org/package/workflow-bpmn-modeler)
![](https://img.shields.io/badge/license-MIT-000000.svg)

🔥 本项目基于 `vue` 和 `bpmn.io@7.0` ，实现 flowable 的工作流设计器

## 预览 📟

![20200930030243](https://cdn.jsdelivr.net/gh/goldsubmarine/cdn@master/blog/20200930030243.png)

## 在线 demo 📢

👉 https://goldsubmarine.github.io/workflow-bpmn-modeler/demo/

## 安装 ⏳

```bash
# 安装
yarn add workflow-bpmn-modeler
```

## 使用说明 👣

```vue
<template>
  <div>
    <bpmn-modeler
      ref="refNode"
      :xml="xml"
      :users="users"
      :groups="groups"
      :categorys="categorys"
      :is-view="false"
      @save="save"
    />
  </div>
</template>

<script>
import bpmnModeler from "workflow-bpmn-modeler";

export default {
  components: {
    bpmnModeler,
  },
  data() {
    return {
      xml: "", // 后端查询到的xml
      users: [
        { name: "披头士", id: "1" },
        { name: "滚石乐队", id: "2" },
        { name: "平克·佛洛伊德", id: "3" },
      ],
      groups: [
        { name: "web", id: "4" },
        { name: "java", id: "5" },
        { name: "python", id: "6" },
      ],
      categorys: [
        { name: "音乐", id: "7" },
        { name: "文章", id: "8" },
      ],
    };
  },
  methods: {
    getModelDetail() {
      // 发送请求，获取xml
      // this.xml = response.xml
    },
    save(data) {
      console.log(data);  // { process: {...}, xml: '...', svg: '...' }
    },
  },
};
</script>
```

## iframe 部署 🎪

如果你的项目是 jquery 或 react 类项目，可以通过 iframe 的方式集成该流程设计器

本仓库通过 github pages 部署了静态页面，使用 jsdelivr 做 cdn ，国内访问也非常快速，所以你可以直接集成本仓库的页面，因为全部白嫖了 github 的资源，没有自己建服务器维护，所以不用担心资源失效问题。

当然你也可以在 `docs/lib` 文件夹下下载对应的版本，进行本地部署。

集成方式如下（ps：可直接拷贝以下代码到一个html文件中试一下）：

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <iframe
      src="https://goldsubmarine.github.io/workflow-bpmn-modeler/cdn/0.2.8/"
      id="myFrame"
      frameborder="0"
      width="100%"
      height="800px">
    </iframe>

    <script>
      let myFrame = document.getElementById("myFrame");
      // 获取到流程详情
      window.addEventListener("message", (event) => {
        console.log(event.data); // { xml: 'xxx', img: 'xxx', process: {} }
      });
      myFrame.onload = () => {
        let postMsg = {
          xml: "", // 后端查询到的xml，新建则为空串
          users: [
            { name: "张三1", id: "zhangsan" },
            { name: "李四1", id: "lisi" },
            { name: "王五1", id: "wangwu" },
          ],
          groups: [
            { name: "web组1", id: "web" },
            { name: "java组1", id: "java" },
            { name: "python组1", id: "python" },
          ],
          categorys: [
            { name: "OA1", id: "oa" },
            { name: "财务1", id: "finance" },
          ],
          isView: false
        }
        // 设置初始化值
        myFrame.contentWindow.postMessage(postMsg, "*")
      }
    </script>
  </body>
</html>
```

## 关于定制 🛠

本组件对标的是 flowable 官方设计器，也就是实现 flowable 的 xml 规则标准，里面所用名词也都是官方文档中的专业术语。所以这个组件只是程序员在开发阶段，自己建模导出 xml 的工具，试图定制该建模器的行为都是不对的，不要把业务带到建模器中来！自己的业务应该另行开发增删改查来实现。

该组件未来也不会升级 UI 库和 vue。不管库是否兼容，通过 iframe 的方式集成建模器才是最简单正确的方式。

## 赞助支持 🧡

| :zap: **wechat**           | :zap: **alipay**           |
| ------------------------ | ------------------------ |
|<img width=200 src="https://cdn.jsdelivr.net/gh/goldsubmarine/cdn@master/blog/donate_wechat.png"/>|<img width=200 src="https://cdn.jsdelivr.net/gh/goldsubmarine/cdn@master/blog/donate_alipay.png"/>|

- @bufegar ¥100
- 匿名 ¥20

## License 📄

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020-present, charles
