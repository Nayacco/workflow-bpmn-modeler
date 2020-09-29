<template>
  <div>
    <el-dialog
      title="监听器参数"
      :visible.sync="dialogVisible"
      width="700px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @closed="$emit('close', formData.paramList)"
    >
      <x-form ref="xForm" v-model="formData" :config="formConfig" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixinXcrud from '../../../common/mixinXcrud'
export default {
  mixins: [mixinXcrud],
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: true,
      formData: {
        paramList: this.value
      }
    }
  },
  computed: {
    formConfig() {
      return {
        inline: false,
        item: [
          {
            xType: 'tabs',
            tabs: [
              {
                label: '监听器参数',
                name: 'paramList',
                column: [
                  {
                    label: '类型',
                    name: 'type',
                    width: 180,
                    rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                    xType: 'select',
                    dic: [
                      { label: '字符串', value: 'stringValue' },
                      { label: '表达式', value: 'expression' }
                    ]
                  },
                  {
                    label: '名称',
                    name: 'name',
                    width: 180,
                    rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                    xType: 'input'
                  },
                  {
                    label: '值',
                    name: 'value',
                    xType: 'input',
                    rules: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    closeDialog() {
      this.$refs.xForm.validate().then(() => {
        this.dialogVisible = false
      }).catch(e => console.error(e))
    }
  }
}
</script>

<style>
.flow-containers  .el-badge__content.is-fixed {
    top: 18px;
}
</style>
