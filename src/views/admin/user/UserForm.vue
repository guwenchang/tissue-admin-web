<template>
  <a-modal :width="640" :visible="visible" :title="title" @ok="handleSubmit" @cancel="visible = false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="真实姓名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['realName', {rules:[{required: true, message: '请输入真实姓名'}]}]" />
      </a-form-item>
      <a-form-item
        label="用户名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['username', {rules:[{required: true, message: '请输入用户名'}]}]" />
      </a-form-item>
      <a-form-item
        label="密码"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input type="password" v-decorator="['password', {rules:[{required: true, message: '请输入密码'}]}]" />
      </a-form-item>
      <a-form-item
        label="手机号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['mobile', {rules:[{required: true, message: '请输入手机号'}]}]" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { add, update } from '@/api/adminUser'
export default {
  name: 'UserForm',
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
  methods: {
    add () {
      this.title = '新建用户'
      this.visible = true
      this.mdl = {
        realName: '',
        username: '',
        password: '',
        mobile: ''
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...this.mdl })
      })
    },
    edit (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.title = '编辑用户'
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...this.mdl })
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.visible = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (this.mdl.id) {
            update(Object.assign(this.mdl, values))
              .then(res => {
                this.$emit('ok')
                this.visible = false
              })
          } else {
            add(values)
              .then(res => {
                this.$emit('ok')
                this.visible = false
              })
          }
        }
      })
    }
  }
}
</script>
