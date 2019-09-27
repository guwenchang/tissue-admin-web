<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="请求路径">
              <a-input v-model="queryParam.requestUri" placeholder="请求路径"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="">
              <a-range-picker
                v-model="createTime"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                @change="createTimeChange"
              />
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
      <span slot="action" slot-scope="text,record">
        <template>
          <a @click="handleDetail(record)">查看详情</a>
        </template>
      </span>
    </s-table>
    <LogDetail ref="detailModal" />
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import LogDetail from './LogDetail'
import { page, remove } from '@/api/adminLog'

export default {
  name: 'LogList',
  components: {
    STable,
    Ellipsis,
    LogDetail
  },
  data () {
    return {
      advanced: false,
      // 查询参数
      queryParam: {},
      createTime: [],
      // 表头
      columns: [
        {
          title: '日志类型',
          dataIndex: 'logType'
        },
        {
          title: '日志标题',
          dataIndex: 'title'
        },
        {
          title: '请求路径',
          dataIndex: 'requestUri'
        },
        {
          title: '操作人',
          dataIndex: 'createBy'
        },
        {
          title: '操作时间',
          dataIndex: 'createTime'
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
  created () {
    this.tableOption()
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
    handleDetail (record) {
      this.$refs.detailModal.detail(record)
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
      this.createTime = []
      this.$refs.table.refresh(true)
    },
    createTimeChange (value, dateString) {
      this.queryParam.startTime = dateString[0]
      this.queryParam.endTime = dateString[1]
    }
  }
}
</script>
