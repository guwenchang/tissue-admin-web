<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="设备编号">
              <a-input v-model="queryParam.deviceNo" placeholder="设备编号"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
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
      showPagination="auto"
    >
      <span slot="status" slot-scope="status">
        {{ status | statusFilter }}
      </span>
      <span slot="onlineStatus" slot-scope="onlineStatus">
        {{ onlineStatus | onlineStatusFilter }}
      </span>
      <span slot="action" slot-scope="text,record">
        <template>
          <a @click="handleEdit(record)">修改</a>
        </template>
      </span>
    </s-table>
    <DeviceForm ref="createModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import DeviceForm from './DeviceForm'
import { page, remove } from '@/api/device'

const statusMap = {
  1: {
    text: '待分配'
  },
  2: {
    text: '已分配'
  },
  3: {
    text: '报修中'
  }
}

const onlineStatusMap = {
  1: {
    text: '在线'
  },
  2: {
    text: '离线'
  }
}

export default {
  name: 'DeviceList',
  components: {
    STable,
    Ellipsis,
    DeviceForm
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '设备编码',
          dataIndex: 'deviceCode'
        },
        {
          title: '所属机构',
          dataIndex: 'placeName'
        },
        {
          title: '运维人员',
          dataIndex: 'ownerName'
        },
        {
          title: '设备状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '在线状态',
          dataIndex: 'onlineStatus',
          scopedSlots: { customRender: 'onlineStatus' }
        },
        {
          title: '剩余干纸量',
          dataIndex: 'dryWipesCount'
        },
        {
          title: '剩余湿纸量',
          dataIndex: 'wetWipesCount'
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
      }
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    onlineStatusFilter (type) {
      return onlineStatusMap[type].text
    }
  },
  created () {},
  methods: {
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
