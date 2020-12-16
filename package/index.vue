<template>
  <div v-loading="isView" class="flow-containers" :class="{ 'view-mode': isView }">
    <el-container style="height: 100%">
      <el-header style="border-bottom: 1px solid rgb(218 218 218);height: auto;">
        <div style="display: flex; padding: 10px 0px; justify-content: space-between;">
          <div>
            <el-upload action="" :before-upload="openBpmn" style="margin-right: 10px; display:inline-block;">
              <el-tooltip effect="dark" content="加载xml" placement="bottom">
                <el-button size="mini" icon="el-icon-folder-opened" />
              </el-tooltip>
            </el-upload>
            <el-tooltip effect="dark" content="新建" placement="bottom">
              <el-button size="mini" icon="el-icon-circle-plus" @click="newDiagram" />
            </el-tooltip>
            <el-tooltip effect="dark" content="自适应屏幕" placement="bottom">
              <el-button size="mini" icon="el-icon-rank" @click="fitViewport" />
            </el-tooltip>
            <el-tooltip effect="dark" content="放大" placement="bottom">
              <el-button size="mini" icon="el-icon-zoom-in" @click="zoomViewport(true)" />
            </el-tooltip>
            <el-tooltip effect="dark" content="缩小" placement="bottom">
              <el-button size="mini" icon="el-icon-zoom-out" @click="zoomViewport(false)" />
            </el-tooltip>
            <el-tooltip effect="dark" content="后退" placement="bottom">
              <el-button size="mini" icon="el-icon-back" @click="modeler.get('commandStack').undo()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="前进" placement="bottom">
              <el-button size="mini" icon="el-icon-right" @click="modeler.get('commandStack').redo()" />
            </el-tooltip>
          </div>
          <div>
            <el-button size="mini" icon="el-icon-download" @click="saveXML(true)">下载xml</el-button>
            <el-button size="mini" icon="el-icon-picture" @click="saveImg('svg', true)">下载svg</el-button>
            <el-button size="mini" type="primary" @click="save">保存模型</el-button>
          </div>
        </div>
      </el-header>
      <el-container style="align-items: stretch">
        <el-main style="padding: 0;">
          <div ref="canvas" class="canvas" />
        </el-main>
        <el-aside style="width: 400px; min-height: 650px; background-color: #f0f2f5">
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
import getInitStr from './flowable/init'
// 引入flowable的节点文件
import flowableModdle from './flowable/flowable.json'
export default {
  name: 'WorkflowBpmnModeler',
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
      default: () => []
    },
    groups: {
      type: Array,
      default: () => []
    },
    categorys: {
      type: Array,
      default: () => []
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modeler: null,
      taskList: [],
      zoom: 1
    }
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
      ],
      moddleExtensions: {
        flowable: flowableModdle
      }
    })
    // 新增流程定义
    if (!this.xml) {
      this.newDiagram()
    } else {
      this.createNewDiagram(this.xml)
    }
  },
  methods: {
    newDiagram() {
      this.createNewDiagram(getInitStr())
    },
    // 让图能自适应屏幕
    fitViewport() {
      this.zoom = this.modeler.get('canvas').zoom('fit-viewport')
      const bbox = document.querySelector('.flow-containers .viewport').getBBox()
      const currentViewbox = this.modeler.get('canvas').viewbox()
      const elementMid = {
        x: bbox.x + bbox.width / 2 - 65,
        y: bbox.y + bbox.height / 2
      }
      this.modeler.get('canvas').viewbox({
        x: elementMid.x - currentViewbox.width / 2,
        y: elementMid.y - currentViewbox.height / 2,
        width: currentViewbox.width,
        height: currentViewbox.height
      })
      this.zoom = bbox.width / currentViewbox.width * 1.8
    },
    // 放大缩小
    zoomViewport(zoomIn = true) {
      this.zoom = this.modeler.get('canvas').zoom()
      this.zoom += (zoomIn ? 0.1 : -0.1)
      this.modeler.get('canvas').zoom(this.zoom)
    },
    async createNewDiagram(data) {
      // 将字符串转换成图显示出来
      // data = data.replace(/<!\[CDATA\[(.+?)]]>/g, '&lt;![CDATA[$1]]&gt;')
      data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function(match, str) {
        return str.replace(/</g, '&lt;')
      })
      try {
        await this.modeler.importXML(data)
        this.adjustPalette()
        this.fitViewport()
        // this.fillColor()
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
              const controlProps = new BpmData().getControl(
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
    fillColor() {
      const canvas = this.modeler.get('canvas')
      this.modeler._definitions.rootElements[0].flowElements.forEach(n => {
        if (n.$type === 'bpmn:UserTask') {
          const completeTask = this.taskList.find(m => m.key === n.id) || { completed: true }
          const todoTask = this.taskList.find(m => !m.completed)
          const endTask = this.taskList[this.taskList.length - 1]
          if (completeTask) {
            canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo')
            n.outgoing?.forEach(nn => {
              const targetTask = this.taskList.find(m => m.key === nn.targetRef.id)
              if (targetTask) {
                canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
              } else if (nn.targetRef.$type === 'bpmn:ExclusiveGateway') {
                // canvas.addMarker(nn.id, 'highlight');
                canvas.addMarker(nn.id, completeTask.completed ? 'highlight' : 'highlight-todo')
                canvas.addMarker(nn.targetRef.id, completeTask.completed ? 'highlight' : 'highlight-todo')
              } else if (nn.targetRef.$type === 'bpmn:EndEvent') {
                if (!todoTask && endTask.key === n.id) {
                  canvas.addMarker(nn.id, 'highlight')
                  canvas.addMarker(nn.targetRef.id, 'highlight')
                }
                if (!completeTask.completed) {
                  canvas.addMarker(nn.id, 'highlight-todo')
                  canvas.addMarker(nn.targetRef.id, 'highlight-todo')
                }
              }
            })
          }
        } else if (n.$type === 'bpmn:ExclusiveGateway') {
          n.outgoing.forEach(nn => {
            const targetTask = this.taskList.find(m => m.key === nn.targetRef.id)
            if (targetTask) {
              canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
            }
          })
        }
        if (n.$type === 'bpmn:StartEvent') {
          n.outgoing.forEach(nn => {
            const completeTask = this.taskList.find(m => m.key === nn.targetRef.id)
            if (completeTask) {
              canvas.addMarker(nn.id, 'highlight')
              canvas.addMarker(n.id, 'highlight')
              return
            }
          })
        }
      })
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
      const rootElements = this.modeler.getDefinitions().rootElements
      for (let i = 0; i < rootElements.length; i++) {
        if (rootElements[i].$type === 'bpmn:Process') return rootElements[i]
      }
    },
    async saveXML(download = false) {
      try {
        const { xml } = await this.modeler.saveXML({ format: true })
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
    async save() {
      const process = this.getProcess()
      const xml = await this.saveXML()
      const svg = await this.saveImg()
      const result = { process, xml, svg }
      this.$emit('save', result)
      window.parent.postMessage(result, '*')
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
.view-mode {
  .el-header, .el-aside, .djs-palette, .bjs-powered-by {
    display: none;
  }
  .el-loading-mask {
    background-color: initial;
  }
  .el-loading-spinner {
    display: none;
  }
}
.flow-containers {
  // background-color: #ffffff;
  width: 100%;
  height: 100%;
  .canvas {
    width: 100%;
    height: 100%;
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
  .el-form-item__label{
    font-size: 13px;
  }

  .djs-palette{
    left: 0px!important;
    top: 0px;
    border-top: none;
  }

  .djs-container svg {
    min-height: 650px;
  }

  // .highlight.djs-shape .djs-visual > :nth-child(1) {
  //   fill: green !important;
  //   stroke: green !important;
  //   fill-opacity: 0.2 !important;
  // }
  // .highlight.djs-shape .djs-visual > :nth-child(2) {
  //   fill: green !important;
  // }
  // .highlight.djs-shape .djs-visual > path {
  //   fill: green !important;
  //   fill-opacity: 0.2 !important;
  //   stroke: green !important;
  // }
  // .highlight.djs-connection > .djs-visual > path {
  //   stroke: green !important;
  // }
  // // .djs-connection > .djs-visual > path {
  // //   stroke: orange !important;
  // //   stroke-dasharray: 4px !important;
  // //   fill-opacity: 0.2 !important;
  // // }
  // // .djs-shape .djs-visual > :nth-child(1) {
  // //   fill: orange !important;
  // //   stroke: orange !important;
  // //   stroke-dasharray: 4px !important;
  // //   fill-opacity: 0.2 !important;
  // // }
  // .highlight-todo.djs-connection > .djs-visual > path {
  //   stroke: orange !important;
  //   stroke-dasharray: 4px !important;
  //   fill-opacity: 0.2 !important;
  // }
  // .highlight-todo.djs-shape .djs-visual > :nth-child(1) {
  //   fill: orange !important;
  //   stroke: orange !important;
  //   stroke-dasharray: 4px !important;
  //   fill-opacity: 0.2 !important;
  // }
  // .overlays-div {
  //   font-size: 10px;
  //   color: red;
  //   width: 100px;
  //   top: -20px !important;
  // }
}
</style>
