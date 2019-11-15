<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="广告商名称">
              <a-input v-model="queryParam.merchantName" placeholder="广告商名称"/>
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

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd()">新建</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
    >
    </s-table>
    <OrderForm ref="createModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import OrderForm from './OrderForm'
import { page } from '@/api/adOrder'

export default {
  name: 'OrderList',
  components: {
    STable,
    OrderForm
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '广告商名称',
          dataIndex: 'merchantName'
        },
        {
          title: '订单描述',
          dataIndex: 'description'
        },
        {
          title: '订单金额',
          dataIndex: 'orderAmount'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
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
  created () {},
  methods: {
    handleAdd () {
      this.$refs.createModal.add()
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
<style scoped>
</style>
