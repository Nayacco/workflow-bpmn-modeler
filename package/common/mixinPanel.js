import xcrud from 'xcrud'
import golbalConfig from 'xcrud/package/common/config'
import showConfig from '../flowable/showConfig'
golbalConfig.set({
  input: {
    // size: 'mini'
  },
  select: {
    // size: 'mini'
  },
  colorPicker: {
    showAlpha: true
  },
  xform: {
    form: {
      labelWidth: 'auto'
      // size: 'mini'
    }
  }
})
export default {
  components: { xForm: xcrud.xForm },
  props: {
    modeler: {
      type: Object,
      required: true
    },
    element: {
      type: Object,
      required: true
    },
    categorys: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    'formData.id': function(val) {
      this.updateProperties({ id: val })
    },
    'formData.name': function(val) {
      this.updateProperties({ name: val })
    },
    'formData.color': function(val) {
      this.setColor({ fill: val, stroke: val })
      this.updateProperties({ color: val })
    }
  },
  methods: {
    updateProperties(properties) {
      const modeling = this.modeler.get('modeling')
      modeling.updateProperties(this.element, properties)
    },
    setColor(properties) {
      const modeling = this.modeler.get('modeling')
      modeling.setColor(this.element, properties)
    }
  },
  computed: {
    elementType() {
      const bizObj = this.element.businessObject
      return bizObj.eventDefinitions
        ? bizObj.eventDefinitions[0].$type
        : bizObj.$type
    },
    showConfig() {
      return showConfig[this.elementType] || {}
    }
  }
}
