<template>
  <a-modal :width="640" :visible="visible" :title="title" @ok="handleSubmit" @cancel="visible = false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="设备编号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <span class="ant-form-text">
          {{ mdl.deviceCode }}
        </span>
      </a-form-item>
      <a-form-item
        label="设备ID"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <span class="ant-form-text">
          {{ mdl.deviceId }}
        </span>
      </a-form-item>
      <!-- 总部人员才可以分配代理商，代理商只能默认当前代理商 -->
      <a-form-item
        v-if="this.$store.getters.userInfo.agentId === 0"
        label="代理商"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          size="default"
          placeholder="代理商"
          v-decorator="['agentId', {rules:[{required: true, message: '请选择代理商'}]}]"
        >
          <a-select-option v-for="agent in this.agentList" :key="agent.id">
            {{ agent.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="机构"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          size="default"
          placeholder="机构"
          v-decorator="['placeId', {rules:[{required: true, message: '请选择机构'}]}]"
        >
          <a-select-option v-for="item in this.placeList" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="具体位置"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="具体位置" v-decorator="['position']" />
      </a-form-item>
      <a-form-item
        label="设备状态"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          size="default"
          placeholder="状态"
          v-decorator="['status']"
        >
          <a-select-option value="1">待分配</a-select-option>
          <a-select-option value="2">已分配</a-select-option>
          <a-select-option value="3">报修中</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="设备标签"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          mode="multiple"
          size="default"
          placeholder="设备标签"
          v-decorator="['tagIds']"
        >
          <a-select-option v-for="tag in this.tagList" :key="tag.id">
            {{ tag.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { get, update } from '@/api/device'
import { list as placeList } from '@/api/place'
import pick from 'lodash.pick'
import { list as agentList } from '@/api/agent'
import { list as tagList } from '@/api/adminTag'

export default {
  name: 'DeviceForm',
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
      agentList: [],
      placeList: [],
      tagList: [],
      title: '',
      form: this.$form.createForm(this)
    }
  },
  created () {
    agentList({}).then(res => {
      this.agentList = res.data
    })
    placeList().then(res => {
      this.placeList = res.data
    })
    tagList().then(res => {
      this.tagList = res.data
    })
  },
  methods: {
    edit (record) {
      get(record.id).then(res => {
        this.mdl = res.data
        this.mdl.tagIds = this.mdl.tags.map(tag => tag.tagId)
        this.mdl.status = this.mdl.status.toString()
        this.visible = true
        this.title = '编辑设备'
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'agentId', 'placeId', 'position', 'status'))
        })
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.visible = true
      validateFields((errors, values) => {
        if (!errors) {
          update(Object.assign(this.mdl, values))
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
<style lang="less" scoped>
</style>
