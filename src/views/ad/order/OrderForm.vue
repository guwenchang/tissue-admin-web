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
        label="广告商"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          size="default"
          placeholder="广告商"
          v-decorator="['merchantId', {rules:[{required: true, message: '请选择广告商'}]}]"
        >
          <a-select-option v-for="item in this.merchantList" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="订单备注"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="订单备注" v-decorator="['description', {rules:[{required: true, message: '请输入订单备注'}]}]" />
      </a-form-item>
      <a-form-item
        label="订单金额"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-number placeholder="订单金额" :min="0" :step="0.1" v-decorator="['orderAmount',{rules:[{required: true, message: '请输入订单金额'}]}]" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { add } from '@/api/adOrder'
import { list as agentList } from '@/api/agent'
import { list as merchantList } from '@/api/adMerchant'
export default {
  name: 'OrderForm',
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
      merchantList: [],
      form: this.$form.createForm(this)
    }
  },
  created () {
    agentList({}).then(res => {
      this.agentList = res.data
    })
    merchantList({}).then(res => {
      this.merchantList = res.data
    })
  },
  methods: {
    add () {
      this.title = '新建广告订单'
      this.visible = true
      this.mdl = {
        agentId: this.$store.getters.userInfo.agentId === 0 ? undefined : this.$store.getters.userInfo.agentId
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...this.mdl })
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.visible = true
      validateFields((errors, values) => {
        if (!errors) {
          add(Object.assign(this.mdl, values))
            .then(res => {
              this.$emit('ok')
              this.visible = false
            }).catch(error => console.log(error))
        }
      })
    }
  }
}
</script>
