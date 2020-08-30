import xcrud from 'xcrud'
import golbalConfig from 'xcrud/package/common/config'
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
  components: { xForm: xcrud.xForm }
}
