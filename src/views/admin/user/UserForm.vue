<template>
  <a-modal :width="640" :visible="visible" :title="title" @ok="handleSubmit" @cancel="visible = false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="姓名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="姓名" v-decorator="['realName', {rules:[{required: true, message: '请输入真实姓名'}]}]" />
      </a-form-item>
      <a-form-item
        label="用户名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="用户名" v-decorator="['username', {rules:[{required: true, message: '请输入用户名'}]}]" />
      </a-form-item>
      <a-form-item
        label="密码"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="密码" type="password" v-decorator="['password', {rules:[{required: true, message: '请输入密码'}]}]" />
      </a-form-item>
      <a-form-item
        label="手机号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="手机号" v-decorator="['mobile', {rules:[{required: true, message: '请输入手机号'}]}]" />
      </a-form-item>
      <a-form-item
        label="角色"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          mode="multiple"
          size="default"
          placeholder="角色"
          v-decorator="['roleIds', {rules:[{required: true, message: '请输入分配角色'}]}]"
        >
          <a-select-option v-for="role in this.roleList" :key="role.id">
            {{ role.roleName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="状态"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-switch v-decorator="['status', { valuePropName: 'checked' }]" checkedChildren="启用" unCheckedChildren="禁用" defaultChecked />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { get, add, update } from '@/api/adminUser'
import { list } from '@/api/adminRole'
import pick from 'lodash.pick'

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
      roleList: [],
      form: this.$form.createForm(this)
    }
  },
  created () {
    list({}).then(res => {
      this.roleList = res.data
    })
  },
  methods: {
    add () {
      this.title = '新建用户'
      this.visible = true
      this.mdl = {
        realName: '',
        username: '',
        password: '',
        mobile: '',
        roleIds: [],
        status: true
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...this.mdl })
      })
    },
    edit (record) {
      get(record.id).then(res => {
        this.mdl = res.data
        this.mdl.roleIds = this.mdl.roles.map(role => role.id)
        this.mdl.status = this.mdl.status === 1
        this.visible = true
        this.title = '编辑用户'
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'realName', 'username', 'password', 'mobile', 'roleIds', 'status'))
        })
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.visible = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          values.status = values.status ? 1 : 2
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
