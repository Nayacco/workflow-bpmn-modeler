<template>
  <div class="flow-containers">
    <el-container>
      <el-header>
        <div style="display: flex; padding: 10px 20px;">
          <el-upload style="margin-riight: 20px" class="load" action="" :before-upload="openBpmn">
            <el-button size="mini" icon="el-icon-folder-opened" type="primary">加载xml</el-button>
          </el-upload>
          <el-button size="mini" icon="el-icon-circle-plus" type="primary" @click="newDiagram">新建</el-button>
          <el-button size="mini" icon="el-icon-download" type="primary" @click="saveXML(true)">下载xml</el-button>
          <el-button size="mini" icon="el-icon-picture" type="primary" @click="saveImg('svg', true)">下载svg</el-button>
          <el-button size="mini" icon="el-icon-back" type="primary" @click="modeler.get('commandStack').undo()">后退</el-button>
          <el-button size="mini" icon="el-icon-right" type="primary" @click="modeler.get('commandStack').redo()">前进</el-button>
        </div>
      </el-header>
      <el-container style="align-items: stretch">
        <el-main height="100%">
          <div ref="canvas" class="canvas" />
        </el-main>
        <el-aside style="width: 300px; background-color: #f0f2f5">
          <panel v-if="modeler" :modeler="modeler" :users="users" :groups="groups" :categorys="categorys" />
        </el-aside>
      </el-container>
    </el-container>

  </div>
</template>

<script>
// 汉化
import customTranslate from './common/customTranslate'
import Modeler from 'bpmn-js/lib/Modeler'
import panel from './PropertyPanel'
import BpmData from './BpmData'
import getInitStr from './init/flowable'
export default {
  components: {
    panel
  },
  props: {
    xml: {
      type: String,
      default: ''
    },
    users: {
      type: Array,
      default: () => {
        return [
          { name: '张三', id: 'zhangsan' },
          { name: '李四', id: 'lisi' },
          { name: '王五', id: 'wangwu' }
        ]
      }
    },
    groups: {
      type: Array,
      default: () => {
        return [
          { name: 'web组', id: 'web' },
          { name: 'java组', id: 'java' },
          { name: 'python组', id: 'python' }
        ]
      }
    },
    categorys: {
      type: Array,
      default: () => {
        return [
          { name: 'OA', id: 'oa' },
          { name: '财务', id: 'finance' }
        ]
      }
    }
  },
  data() {
    return {
      modeler: null,
      bpmData: new BpmData() }
  },
  watch: {
    xml: function(val) {
      if (val) {
        this.createNewDiagram(val)
      }
    }
  },
  mounted() {
    // 生成实例
    this.modeler = new Modeler({
      container: this.$refs.canvas,
      additionalModules: [
        {
          translate: ['value', customTranslate]
        }
      ]
    })
    // 新增流程定义
    if (!this.xml) {
      this.newDiagram()
    } else {
      this.createNewDiagram(this.xml)
    }
    // 让图能自适应屏幕
    this.modeler.get('canvas').zoom('fit-viewport')
  },
  methods: {
    newDiagram() {
      this.createNewDiagram(getInitStr())
    },
    async createNewDiagram(data) {
      // 将字符串转换成图显示出来
      try {
        await this.modeler.importXML(data)
        this.adjustPalette()
      } catch (err) {
        console.error(err.message, err.warnings)
      }
    },
    // 调整左侧工具栏排版
    adjustPalette() {
      try {
        // 获取 bpmn 设计器实例
        const canvas = this.$refs.canvas
        const djsPalette = canvas.children[0].children[1].children[4]
        const djsPalStyle = {
          width: '130px',
          padding: '5px',
          background: 'white',
          left: '20px',
          borderRadius: 0
        }
        for (var key in djsPalStyle) {
          djsPalette.style[key] = djsPalStyle[key]
        }
        const palette = djsPalette.children[0]
        const allGroups = palette.children
        allGroups[0].style['display'] = 'none'
        // 修改控件样式
        for (var gKey in allGroups) {
          const group = allGroups[gKey]
          for (var cKey in group.children) {
            const control = group.children[cKey]
            const controlStyle = {
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              padding: '5px'
            }
            if (
              control.className &&
              control.dataset &&
              control.className.indexOf('entry') !== -1
            ) {
              const controlProps = this.bpmData.getControl(
                control.dataset.action
              )
              control.innerHTML = `<div style='font-size: 14px;font-weight:500;margin-left:15px;'>${
                controlProps['title']
              }</div>`
              for (var csKey in controlStyle) {
                control.style[csKey] = controlStyle[csKey]
              }
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 对外 api
    getProcess() {
      const element = this.getProcessElement()
      return {
        id: element.id,
        name: element.name,
        category: element.$attrs['flowable:processCategory']
      }
    },
    getProcessElement() {
      return this.modeler.getDefinitions().rootElements[0]
    },
    async saveXML(download = false) {
      try {
        let { xml } = await this.modeler.saveXML({ format: true })
        xml = xml.replace(/&lt;/g, '<')
        xml = xml.replace(/&gt;/g, '>')
        if (download) {
          this.downloadFile(`${this.getProcessElement().name}.bpmn20.xml`, xml, 'application/xml')
        }
        return xml
      } catch (err) {
        console.log(err)
      }
    },
    async saveImg(type = 'svg', download = false) {
      try {
        const { svg } = await this.modeler.saveSVG({ format: true })
        if (download) {
          this.downloadFile(this.getProcessElement().name, svg, 'image/svg+xml')
        }
        return svg
      } catch (err) {
        console.log(err)
      }
    },
    openBpmn(file) {
      const reader = new FileReader()
      reader.readAsText(file, 'utf-8')
      reader.onload = () => {
        this.createNewDiagram(reader.result)
      }
      return false
    },
    downloadFile(filename, data, type) {
      var a = document.createElement('a')
      var url = window.URL.createObjectURL(new Blob([data], { type: type }))
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }
}
</script>

<style lang="scss">
/*左边工具栏以及编辑节点的样式*/
@import "~bpmn-js/dist/assets/diagram-js.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
.flow-containers {
  // background-color: #ffffff;
  width: 100%;
  height: 100%;
  .canvas {
    width: 100%;
    height: 100%;
    min-height: 580px;
    // margin: 0 400px 0 0;
  }
  .panel {
    position: absolute;
    right: 0;
    top: 50px;
    width: 300px;
  }
  .load {
    margin-right: 10px;
  }
}
</style>
