import Vue from 'vue'
import Xcrud from 'xcrud'

Vue.use(Xcrud, {
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
