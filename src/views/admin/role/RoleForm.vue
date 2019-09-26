<template>
  <a-modal :width="640" :visible="visible" :title="title" @ok="handleSubmit" @cancel="visible = false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="角色名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="角色名称" v-decorator="['roleName', {rules:[{required: true, message: '请输入角色名称'}]}]" />
      </a-form-item>
      <a-form-item
        label="角色编码"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="角色编码" v-decorator="['roleCode']" />
      </a-form-item>
      <a-form-item
        label="角色描述"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="角色描述" v-decorator="['roleDesc']" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { get, add, update } from '@/api/adminRole'
import pick from 'lodash.pick'

export default {
  name: 'RoleForm',
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
      this.title = '新建角色'
      this.visible = true
      this.mdl = {
        roleName: '',
        roleCode: '',
        roleDesc: ''
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...this.mdl })
      })
    },
    edit (record) {
      get(record.id).then(res => {
        this.mdl = res.data
        this.visible = true
        this.title = '编辑角色'
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'roleName', 'roleCode', 'roleDesc'))
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
