<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="模版名称">
              <a-input v-model="queryParam.name" placeholder="模版名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="模版类型">
              <a-select
                size="default"
                placeholder="模版类型"
                v-model="queryParam.templateType"
              >
                <a-select-option v-for="item in this.templateTypeList" :key="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleReset()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd()">新建</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <span slot="status" slot-scope="status">
        {{ status | statusFilter }}
      </span>
      <span slot="templateType" slot-scope="templateType">
        {{ templateType | templateTypeFilter }}
      </span>
      <span slot="action" slot-scope="text,record">
        <template v-if="record.status === 1">
          <a @click="handleEdit(record)">修改</a>
        </template>
        <template v-if="record.status === 2">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record.id)">删除</a>
        </template>
      </span>
    </s-table>
    <AdTemplateForm ref="createModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import AdTemplateForm from './AdTemplateForm'
import { page, remove } from '@/api/adTemplate'
import { listByType } from '@/api/adminDict'

const statusMap = {
  1: {
    text: '启用'
  },
  2: {
    text: '禁用'
  }
}
let that

export default {
  name: 'AdTemplateList',
  components: {
    STable,
    Ellipsis,
    AdTemplateForm
  },
  data () {
    return {
      advanced: false,
      templateTypeList: [],
      templateTypeMap: {},
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '模版名称',
          dataIndex: 'name'
        },
        {
          title: '模版类型',
          dataIndex: 'templateType',
          scopedSlots: { customRender: 'templateType' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return page(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      // custom table alert & rowSelection
      options: {
        alert: { show: false, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: true
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    templateTypeFilter (type) {
      return that.templateTypeMap[type]
    }
  },
  created () {
    listByType('template_type').then(res => {
      this.templateTypeList = res.data
      const map = {}
      for (var item of this.templateTypeList) {
        map[item.value] = item.label
      }
      this.templateTypeMap = map
    })
    this.tableOption()
  },
  beforeCreate: function () {
    that = this
  },
  methods: {
    tableOption () {
      if (!this.optionAlertShow) {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              props: {
                name: record.id
              }
            })
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },
    handleAdd () {
      this.$refs.createModal.add()
    },
    handleEdit (record) {
      this.$refs.createModal.edit(record)
    },
    handleDelete (id) {
      const _this = this
      this.$confirm({
        title: '确定要删除吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          remove(id).then(res => {
            _this.$refs.table.refresh(true)
          })
        }
      })
    },
    handleReset () {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    handleOk () {
      this.$message.info(`保存成功`)
      this.$refs.table.refresh()
    }
  }
}
</script>
