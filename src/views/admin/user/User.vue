<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名">
              <a-input v-model="queryParam.username" placeholder="用户名"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="手机号">
              <a-input v-model="queryParam.mobile" placeholder="手机号"/>
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
      <span slot="status" slot-scope="status">
        {{ status | statusFilter }}
      </span>
      <span slot="action" slot-scope="text,record">
        <template v-if="record.status === 1">
          <a @click="handleEdit(record)">修改</a>
        </template>
        <template v-if="record.status === 2">
          <a @click="handleEdit(record.id)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record.id)">删除</a>
        </template>
      </span>
    </s-table>
    <UserForm ref="createModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import UserForm from './UserForm'
import { page, remove } from '@/api/adminUser'

const statusMap = {
  1: {
    text: '启用'
  },
  2: {
    text: '禁用'
  }
}

export default {
  name: 'UserList',
  components: {
    STable,
    Ellipsis,
    UserForm
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '姓名',
          dataIndex: 'realName'
        },
        {
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '手机号',
          dataIndex: 'mobile'
        },
        {
          title: '角色',
          dataIndex: 'roleNames'
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
