<template>
  <a-modal :width="640" :visible="visible" :title="title" @ok="handleSubmit" @cancel="visible = false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="标签名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="标签名称" v-decorator="['name', {rules:[{required: true, message: '请输入标签名称'}]}]" />
      </a-form-item>
      <a-form-item
        label="状态"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-switch v-decorator="['status', { valuePropName: 'checked' }]" checkedChildren="启用" unCheckedChildren="禁用" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { get, add, update } from '@/api/adminTag'
import pick from 'lodash.pick'

export default {
  name: 'TagForm',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      mdl: {},
      visible: false,
      title: '',
      roleList: [],
      form: this.$form.createForm(this)
    }
  },
  created () {},
  methods: {
    add () {
      this.title = '新建标签'
      this.visible = true
      this.mdl = {
        name: '',
        status: true
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...this.mdl })
      })
    },
    edit (record) {
      get(record.id).then(res => {
        this.mdl = res.data
        this.mdl.status = this.mdl.status === 1
        this.visible = true
        this.title = '编辑标签'
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'name', 'status'))
        })
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.visible = true
      validateFields((errors, values) => {
        if (!errors) {
          values.status = values.status ? 1 : 2
          if (this.mdl.id) {
            update(Object.assign(this.mdl, values))
              .then(res => {
                this.$emit('ok')
                this.visible = false
              }).catch(error => console.log(error))
          } else {
            add(values)
              .then(res => {
                this.$emit('ok')
                this.visible = false
              }).catch(error => console.log(error))
          }
        }
      })
    }
  }
}
</script>
