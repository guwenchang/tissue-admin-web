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
            label="机构名称"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input placeholder="机构名称" v-decorator="['name', {rules:[{required: true, message: '请输入机构名称'}]}]" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" type="flex">
        <a-col :span="12">
          <a-form-item
            label="省市县"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-cascader :options="options" @change="onChange" placeholder="请选择省市县" v-decorator="['areas', {rules:[{required: true, message: '请输入区域'}]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="详细地址"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input placeholder="详细地址" v-decorator="['address']" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" type="flex">
        <a-col :span="12">
          <a-form-item
            label="干纸巾价格"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input-number placeholder="干纸巾价格" :min="0" :max="10" :step="0.1" v-decorator="['dryWipesPrice',{rules:[{required: true, message: '请输入干纸巾价格'}]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="湿纸巾价格"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input-number placeholder="湿纸巾价格" :min="0" :max="10" :step="0.1" v-decorator="['wetWipesPrice',{rules:[{required: true, message: '请输入干纸巾价格'}]}]" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" type="flex">
        <a-col :span="12">
          <a-form-item
            label="广告轮播时间(秒)"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input-number placeholder="广告轮播时间(秒)" v-decorator="['cycleTime']" :min="1" :max="100" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="广告模版"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select
              size="default"
              placeholder="广告模版"
              v-decorator="['adTemplateId', {rules:[{required: true, message: '请选择广告模版'}]}]"
            >
              <a-select-option v-for="item in this.templateList" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" type="flex">
        <a-col :span="12">
          <a-form-item
            label="出纸失败提醒"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-switch v-decorator="['taskErrorRemind', { valuePropName: 'checked' }]" checkedChildren="开启" unCheckedChildren="关闭" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="未开机提醒"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-switch v-decorator="['deviceOffRemind', { valuePropName: 'checked' }]" checkedChildren="开启" unCheckedChildren="关闭" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" type="flex">
        <a-col :span="12">
          <a-form-item
            label="机构负责人"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select
              size="default"
              placeholder="机构负责人"
              v-decorator="['ownerId', {rules:[{required: true, message: '请选择机构负责人'}]}]"
            >
              <a-select-option v-for="item in this.userList" :key="item.id">
                {{ item.realName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="状态"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-switch v-decorator="['status', { valuePropName: 'checked' }]" checkedChildren="启用" unCheckedChildren="禁用" />
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
import { get, add, update } from '@/api/place'
import { list as templateList } from '@/api/adTemplate'
import { list as userList } from '@/api/adminUser'
import pick from 'lodash.pick'
import { list as agentList } from '@/api/agent'
import options from '@/utils/city'

export default {
  name: 'PlaceForm',
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
      templateList: [],
      userList: [],
      title: '',
      options: options,
      form: this.$form.createForm(this)
    }
  },
  created () {
    agentList({}).then(res => {
      this.agentList = res.data
    })
    templateList().then(res => {
      this.templateList = res.data
    })
    userList().then(res => {
      this.userList = res.data
    })
  },
  methods: {
    onChange (value, selectedOptions) {
      this.mdl.province = value[0]
      this.mdl.city = value[1]
      this.mdl.area = value[2]
      this.mdl.areaInfo = selectedOptions.map(item => item.label).join('/')
    },
    add () {
      this.title = '新建机构'
      this.visible = true
      this.mdl = {
        agentId: this.$store.getters.userInfo.agentId === 0 ? undefined : this.$store.getters.userInfo.agentId,
        name: '',
        status: true,
        taskErrorRemind: true,
        deviceOffRemind: false
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
        this.title = '编辑机构'
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'agentId', 'areas', 'address', 'dryWipesPrice', 'wetWipesPrice',
            'cycleTime', 'adTemplateId', 'taskErrorRemind', 'deviceOffRemind', 'ownerId', 'name', 'status'))
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
<style lang="less" scoped>
</style>
