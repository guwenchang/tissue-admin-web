<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="订单号">
              <a-input v-model="queryParam.orderNo" placeholder="订单号"/>
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
    >
      <span slot="status" slot-scope="status">
        {{ status | statusFilter }}
      </span>
      <span slot="action" slot-scope="text,record">
        <template>
          <a @click="handleDetail(record)">查看</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { page } from '@/api/order'
const statusMap = {
  1: {
    text: '待付款'
  },
  2: {
    text: '已付款'
  },
  3: {
    text: '已下发'
  },
  4: {
    text: '已完成'
  },
  5: {
    text: '已取消'
  }
}

export default {
  name: 'Orderlist',
  components: {
    STable
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '订单号',
          dataIndex: 'orderNo'
        },
        {
          title: '设备编号',
          dataIndex: 'deviceCode'
        },
        {
          title: '纸巾类型',
          dataIndex: 'wipeType'
        },
        {
          title: '订单状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
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
      }
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    }
  },
  created () {},
  methods: {
    handleDetail () {},
    handleReset () {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    }
  }
}
</script>
