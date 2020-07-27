import xcrud from 'xcrud'
import golbalConfig from 'xcrud/package/common/config'
golbalConfig.set({
  input: {
    size: 'mini'
  },
  xform: {
    form: {
      labelPosition: 'top',
      size: 'mini'
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
      required: true
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
      this.setColor({ fill: null, stroke: val })
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
  }
}
