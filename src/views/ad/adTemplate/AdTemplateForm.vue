<template>
  <a-modal :width="640" :visible="visible" :title="title" @ok="handleSubmit" @cancel="visible = false">
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
            label="模版类型"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select
              size="default"
              placeholder="模版类型"
              v-decorator="['templateType', {rules:[{required: true, message: '请选择模版类型'}]}]"
            >
              <a-select-option v-for="item in this.templateTypeList" :key="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" type="flex">
        <a-col :span="12">
          <a-form-item
            label="模版名称"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input placeholder="模版名称" v-decorator="['name', {rules:[{required: true, message: '请输入模版名称'}]}]" />
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
    <!-- table -->
    <a-card>
      <a-table
        rowKey="materialId"
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :loading="memberLoading"
      >
        <template slot="startEndTime" slot-scope="text,record">
          <a-range-picker
            style="width: 100%"
            :defaultValue="[moment(record.startTime,dateFormat), moment(record.endTime,dateFormat)]"
            v-decorator="[
              'startEndTime',
              {rules: [{ required: true, message: '请选择起止日期' }]}
            ]" />
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <a @click="saveRow(record)">添加</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="saveRow(record)">保存</a>
              <a-divider type="vertical" />
              <a @click="cancel(record.key)">取消</a>
            </span>
          </template>
          <span v-else>
            <a @click="toggle(record.key)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newItem">新增成员</a-button>
    </a-card>
  </a-modal>
</template>

<script>
import { get, add, update } from '@/api/adTemplate'
import pick from 'lodash.pick'
import { listByType } from '@/api/adminDict'
import { list as agentList } from '@/api/agent'
import moment from 'moment'

export default {
  name: 'AdTemplateForm',
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
      dateFormat: 'YYYY-MM-DD',
      mdl: {},
      visible: false,
      templateTypeList: [],
      agentList: [],
      title: '',
      columns: [
        {
          title: '素材',
          dataIndex: 'materialMame',
          scopedSlots: { customRender: 'materialMame' }
        },
        {
          title: '起止日期',
          dataIndex: 'startTime',
          scopedSlots: { customRender: 'startEndTime' }
        },
        {
          title: '排序号',
          dataIndex: 'sort',
          scopedSlots: { customRender: 'sort' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [
        {
          materialId: '1',
          materialMame: '小明',
          startTime: '2019-11-01',
          endTime: '2019-11-11',
          sort: 1
        }
      ],
      memberLoading: false,
      form: this.$form.createForm(this)
    }
  },
  created () {
    agentList({}).then(res => {
      this.agentList = res.data
    })
    listByType('template_type').then(res => {
      this.templateTypeList = res.data
    })
  },
  methods: {
    moment,
    add () {
      this.title = '新建模版'
      this.visible = true
      this.mdl = {
        agentId: this.$store.getters.userInfo.agentId === 0 ? undefined : this.$store.getters.userInfo.agentId,
        templateType: undefined,
        name: '',
        status: true,
        itemParams: []
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
        this.title = '编辑模版'
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'agentId', 'templateType', 'name', 'itemParams', 'status'))
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
    },
    newItem () {
      this.data.push({
        materialId: '2',
        materialMame: '小明',
        startTime: '2019-11-01',
        endTime: '2019-11-01',
        sort: 1
      })
    }
  }
}
</script>
