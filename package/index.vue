<template>
  <div class="flow-containers">
    <el-container>
      <el-header>
        <div style="display: flex; padding: 10px 20px;">
          <el-upload style="margin-riight: 20px" class="load" action="" :before-upload="openBpmn">
            <el-button size="mini" icon="el-icon-folder-opened" type="primary">加载xml</el-button>
          </el-upload>
          <el-button size="mini" icon="el-icon-circle-plus" type="primary" @click="newDiagram">新建</el-button>
          <el-button size="mini" icon="el-icon-download" type="primary" @click="saveFile('xml')">下载xml</el-button>
          <el-button size="mini" icon="el-icon-picture" type="primary" @click="saveFile('svg')">下载svg</el-button>
        </div>
      </el-header>
      <el-container style="align-items: stretch">
        <el-main height="100%">
          <div ref="canvas" class="canvas" />
        </el-main>
        <el-aside style="width: 300px; background-color: #f0f2f5">
          <panel v-if="modeler" :modeler="modeler" :users="users" />
        </el-aside>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import './main.js'
import Modeler from 'bpmn-js/lib/Modeler'
import panel from './PropertyPanel'
import BpmData from './BpmData'
import flowableInitStr from './init/flowable'
export default {
  components: {
    panel
  },
  data() {
    return {
      modeler: null,
      bpmData: new BpmData(),
      users: [
        { label: '张三', value: 'zhangsan' },
        { label: '李四', value: 'lisi' },
        { label: '王二', value: 'wanger' },
        { label: '麻子', value: 'mazi' }
      ]
    }
  },
  mounted() {
    // 生成实例
    this.modeler = new Modeler({
      container: this.$refs.canvas
    })
    // 新增流程定义
    this.newDiagram()
    // 让图能自适应屏幕
    this.modeler.get('canvas').zoom('fit-viewport')
  },
  methods: {
    newDiagram() {
      this.createNewDiagram(flowableInitStr)
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
    async saveFile(type) {
      try {
        if (type === 'xml') {
          const { xml } = await this.modeler.saveXML({ format: true })
          this.downloadFile('测试.bpmn20.xml', xml, 'application/xml')
        } else {
          const { svg } = await this.modeler.saveSVG({ format: true })
          this.downloadFile('图像', svg, 'image/svg+xml')
        }
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
