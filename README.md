English | [简体中文](./README_CN.md)

# workflow-bpmn-modeler

[![NPM Version](http://img.shields.io/npm/v/workflow-bpmn-modeler.svg?style=flat)](https://www.npmjs.org/package/workflow-bpmn-modeler)
[![NPM Downloads](https://img.shields.io/npm/dm/workflow-bpmn-modeler.svg?style=flat)](https://www.npmjs.org/package/workflow-bpmn-modeler)
![](https://img.shields.io/badge/license-MIT-000000.svg)

🔥 This project implements flowable's workflow designer based on `vue` and `bpmn.io@7.0`

## Preview 📟

![20200930030243](https://cdn.jsdelivr.net/gh/goldsubmarine/cdn@master/blog/20200930030243.png)

## Online demo 📢

👉 https://goldsubmarine.github.io/workflow-bpmn-modeler/demo/

## Install ⏳

```bash
# Install
yarn add workflow-bpmn-modeler
```

## How to use 👣

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
      xml: "", // Query the xml
      users: [
        { name: "The Beatles", id: "1" },
        { name: "The Rolling Stones", id: "2" },
        { name: "Pink Floyed", id: "3" },
      ],
      groups: [
        { name: "Folk Music", id: "4" },
        { name: "Rock Music", id: "5" },
        { name: "Classical Music", id: "6" },
      ],
      categorys: [
        { name: "Music", id: "7" },
        { name: "Articles", id: "8" },
      ],
    };
  },
  methods: {
    getModelDetail() {
      // Send request to get xml
      // this.xml = response.xml
    },
    save(data) {
      console.log(data);  // { process: {...}, xml: '...', svg: '...' }
    },
  },
};
</script>
```

## Iframe Deployment 🎪

If your project is a `jquery` or `react` project, you can integrate the workflow designer by means of an iframe

This repository deployed a static page by the github pages, using `jsdelivr` cdn, access in China is also very fast, so you can directly integrate the pages of this repository, because all the free github resources are used, did not build their own server maintenance, so do not worry about the failure of resources.

Of course you can also download the corresponding version from the `docs/lib` folder for local deployment.

The integration method is as follows (ps: you can copy the following code directly into an html file and try it out)

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
      // Get details
      window.addEventListener("message", (event) => {
        console.log(event.data); // { xml: 'xxx', img: 'xxx', process: {} }
      });
      myFrame.onload = () => {
        let postMsg = {
          xml: "", // Query the xml
          users: [
            { name: "The Beatles", id: "1" },
            { name: "The Rolling Stones", id: "2" },
            { name: "Pink Floyed", id: "3" },
          ],
          groups: [
            { name: "Folk Music", id: "4" },
            { name: "Rock Music", id: "5" },
            { name: "Classical Music", id: "6" },
          ],
          categorys: [
            { name: "Music", id: "7" },
            { name: "Articles", id: "8" },
          ],
          isView: false
        }
        // Set initialization value
        myFrame.contentWindow.postMessage(postMsg, "*")
      }
    </script>
  </body>
</html>
```

## Customization 🛠

This component is aligned to the official flowable designer, which is the standard for implementing flowable's xml rules, and the terms used in it are all terminology from the official documentation. So this component is just a tool for programmers to model and export xml by themselves during the development phase, and it is wrong to try to customize the behavior of this modeler. Your own business should be developed separately to implement it.

The component will not upgrade the UI library or vue in the future, and regardless of library compatibility, integrating the modeler via an iframe is the easiest and correct way to do it.

## Sponsor 🧡

| :zap: **wechat**           | :zap: **alipay**           |
| ------------------------ | ------------------------ |
|<img width=200 src="https://cdn.jsdelivr.net/gh/goldsubmarine/cdn@master/blog/donate_wechat.png"/>|<img width=200 src="https://cdn.jsdelivr.net/gh/goldsubmarine/cdn@master/blog/donate_alipay.png"/>|

- @bufegar ¥100
- anonymous ¥20

## License 📄

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020-present, charles
