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
        label="广告商名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="广告商名称" v-decorator="['name', {rules:[{required: true, message: '请输入广告商名称'}]}]" />
      </a-form-item>
      <a-form-item
        label="联系人姓名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="联系人姓名" v-decorator="['contact', {rules:[{required: true, message: '请输入联系人姓名'}]}]" />
      </a-form-item>
      <a-form-item
        label="联系人电话"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="联系人电话" v-decorator="['contactMobile', {rules:[{required: true, message: '请输入联系人电话'}]}]" />
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
import { get, add, update } from '@/api/adMerchant'
import { list as agentList } from '@/api/agent'
import pick from 'lodash.pick'
export default {
  name: 'MerchantForm',
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
      agentList: [],
      form: this.$form.createForm(this)
    }
  },
  created () {
    agentList({}).then(res => {
      this.agentList = res.data
    })
  },
  methods: {
    add () {
      this.title = '新建广告商'
      this.visible = true
      this.mdl = {
        name: '',
        contact: '',
        contactMobile: '',
        agentId: this.$store.getters.userInfo.agentId === 0 ? undefined : this.$store.getters.userInfo.agentId,
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
        this.title = '编辑广告商'
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'agentId', 'name', 'contact', 'contactMobile', 'status'))
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
