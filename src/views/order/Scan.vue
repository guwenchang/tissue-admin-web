<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="设备编号">
              <a-input v-model="queryParam.deviceCode" placeholder="设备编号"/>
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
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { page } from '@/api/scan'
export default {
  name: 'Scanlist',
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
          title: '设备编号',
          dataIndex: 'deviceCode'
        },
        {
          title: '扫码类型',
          dataIndex: 'scanType'
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
    handleReset () {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    }
  }
}
</script>
