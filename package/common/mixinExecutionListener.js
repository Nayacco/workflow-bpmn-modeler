
import executionListenerDialog from '../components/nodePanel/property/executionListener'
export default {
  components: {
    executionListenerDialog
  },
  data() {
    return {
      executionListenerLength: 0,
      dialogName: null
    }
  },
  methods: {
    computedExecutionListenerLength() {
      this.executionListenerLength = this.element.businessObject.extensionElements?.values?.length ?? 0
    },
    finishExecutionListener() {
      if (this.dialogName === 'executionListenerDialog') {
        this.computedExecutionListenerLength()
      }
      this.dialogName = ''
    }
  }
}
