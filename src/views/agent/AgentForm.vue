<template>
  <a-modal :width="640" :visible="visible" :title="title" @ok="handleSubmit" @cancel="visible = false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="代理商名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="代理商名称" v-decorator="['name', {rules:[{required: true, message: '请输入代理商名称'}]}]" />
      </a-form-item>
      <a-form-item
        label="联系人"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="联系人" v-decorator="['contact', {rules:[{required: true, message: '请输入联系人'}]}]" />
      </a-form-item>
      <a-form-item
        label="联系人电话"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="联系人电话" v-decorator="['contactMobile', {rules:[{required: true, message: '请输入联系人电话'}]}]" />
      </a-form-item>
      <a-form-item
        label="省市县"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-cascader :options="options" @change="onChange" placeholder="请选择省市县" v-decorator="['areas', {rules:[{required: true, message: '请输入区域'}]}]" />
      </a-form-item>
      <a-form-item
        label="详细地址"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="详细地址" v-decorator="['address']" />
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
import { get, add, update } from '@/api/agent'
import pick from 'lodash.pick'
import options from '@/utils/city'

export default {
  name: 'AgentForm',
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
      areaData: [],
      mdl: {},
      visible: false,
      title: '',
      roleList: [],
      form: this.$form.createForm(this),
      options: options
    }
  },
  created () {},
  methods: {
    onChange (value, selectedOptions) {
      this.mdl.province = value[0]
      this.mdl.city = value[1]
      this.mdl.area = value[2]
      this.mdl.areaInfo = selectedOptions.map(item => item.label).join('/')
    },
    add () {
      this.title = '新建代理商'
      this.visible = true
      this.areas = []
      this.mdl = {
        name: '',
        contact: '',
        contactMobile: '',
        address: '',
        areas: [],
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
        this.mdl.areas = [this.mdl.province, this.mdl.city, this.mdl.area]
        this.visible = true
        this.title = '编辑代理商'
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'name', 'contact', 'areas', 'contactMobile', 'address', 'status'))
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
            add(Object.assign(this.mdl, values))
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
