<template>
  <a-modal :width="640" :visible="visible" :title="title" @ok="handleSubmit" @cancel="visible = false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="字典类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="字典类型" v-decorator="['type', {rules:[{required: true, message: '请输入字典类型'}]}]" />
      </a-form-item>
      <a-form-item
        label="字典label"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="字典label" v-decorator="['label', {rules:[{required: true, message: '请输入字典label'}]}]" />
      </a-form-item>
      <a-form-item
        label="字典value"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="字典value" v-decorator="['value', {rules:[{required: true, message: '请输入字典value'}]}]" />
      </a-form-item>
      <a-form-item
        label="字典备注"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="字典备注" v-decorator="['description']" />
      </a-form-item>
      <a-form-item
        label="排序值"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-number placeholder="排序值" v-decorator="['sort']" :min="1" :max="100" />
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
import { get, add, update } from '@/api/adminDict'
import pick from 'lodash.pick'

export default {
  name: 'DictForm',
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
      form: this.$form.createForm(this)
    }
  },
  created () {},
  methods: {
    add () {
      this.title = '新建字典'
      this.visible = true
      this.mdl = {
        type: '',
        label: '',
        value: '',
        description: '',
        sort: 0,
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
        this.title = '编辑字典'
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'type', 'label', 'value', 'description', 'sort', 'status'))
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
