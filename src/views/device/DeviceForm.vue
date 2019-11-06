<template>
  <a-drawer
    :title="title"
    width="960"
    @close="visible = false"
    :visible="visible"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <a-form @submit="handleSubmit" :form="form">
      <a-row class="form-row" type="flex">
        <a-col :span="12">
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
        </a-col>
        <a-col :span="12">
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
        </a-col>
      </a-row>
      <a-row class="form-row" type="flex">
        <a-col :span="12">
          <a-form-item
            label="设备编码"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input placeholder="设备编码" v-decorator="['deviceCode']" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="设备ID"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input placeholder="设备ID" v-decorator="['deviceId']" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" type="flex">
        <a-col :span="12">
          <a-form-item
            label="具体位置"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input placeholder="具体位置" v-decorator="['position']" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
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
        </a-col>
      </a-row>
      <a-row class="form-row" type="flex">
        <a-col :span="12">
          <a-form-item
            label="开机时间"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-time-picker v-decorator="['openTime']" format="HH:mm" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="关机时间"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-time-picker v-decorator="['closeTime']" format="HH:mm" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div
      :style="{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
      }"
    >
      <a-button :style="{marginRight: '8px'}" @click="visible = false">
        取消
      </a-button>
      <a-button @click="handleSubmit" type="primary">保存</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { get, update } from '@/api/device'
import { list as placeList } from '@/api/place'
import pick from 'lodash.pick'
import { list as agentList } from '@/api/agent'
import moment from 'moment'

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
  },
  methods: {
    moment,
    edit (record) {
      get(record.id).then(res => {
        this.mdl = res.data
        this.mdl.status = this.mdl.status.toString()
        this.mdl.openTime = moment(this.mdl.openTime, 'HH:mm')
        this.mdl.closeTime = moment(this.mdl.closeTime, 'HH:mm')
        this.visible = true
        this.title = '编辑设备'
        console.log(this.mdl)
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'agentId', 'placeId', 'deviceCode', 'deviceId', 'position',
            'status', 'openTime', 'closeTime'))
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
