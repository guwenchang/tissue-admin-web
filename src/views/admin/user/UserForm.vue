<template>
  <a-modal :width="640" :visible="visible" :title="title" @ok="handleSubmit" @cancel="visible = false">
    <a-form @submit="handleSubmit" :form="form">
      <!-- 总部人员才可以分配代理商，代理商只能默认当前代理商 -->
      <a-form-item
        v-if="this.$store.getters.userInfo.agentId === 0"
        label="所属代理商"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          size="default"
          placeholder="所属代理商"
          v-decorator="['agentId', {rules:[{required: true, message: '请选择代理商'}]}]"
        >
          <a-select-option v-for="agent in this.agentList" :key="agent.id">
            {{ agent.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
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
        <a-switch v-decorator="['status', { valuePropName: 'checked' }]" checkedChildren="启用" unCheckedChildren="禁用" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { get, add, update } from '@/api/adminUser'
import { list as roleList } from '@/api/adminRole'
import { list as agentList } from '@/api/agent'
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
      agentList: [],
      form: this.$form.createForm(this)
    }
  },
  created () {
    roleList({}).then(res => {
      this.roleList = res.data
      if (this.$store.getters.userInfo.agentId !== 0) {
        // 非总部人员不能操作超级管理员权限
        this.roleList.shift()
      }
    })
    agentList({}).then(res => {
      this.agentList = res.data
      // 总部作为特殊代理商存在
      this.agentList.unshift({
        id: 0,
        name: '总部'
      })
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
        agentId: this.$store.getters.userInfo.agentId === 0 ? undefined : this.$store.getters.userInfo.agentId,
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
          this.form.setFieldsValue(pick(this.mdl, 'agentId', 'realName', 'username', 'password', 'mobile', 'roleIds', 'status'))
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
