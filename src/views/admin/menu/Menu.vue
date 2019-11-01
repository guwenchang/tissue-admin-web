<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd()">新建</a-button>
    </div>
    <a-table
      :columns="columns"
      :dataSource="menuList"
      ref="table"
      size="default"
      roeKey="id"
    >
      <span slot="icon" slot-scope="text,record">
        <template v-if="record.icon">
          <a-icon :type="record.icon" />
        </template>
      </span>
      <span slot="action" slot-scope="text,record">
        <template>
          <a @click="handleEdit(record)">修改</a>
        </template>
      </span>
    </a-table>
    <MenuForm ref="createModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import MenuForm from './MenuForm'
import { allTree } from '@/api/adminMenu'

export default {
  name: 'MenuList',
  components: {
    MenuForm
  },
  data () {
    return {
      // 表头
      columns: [
        {
          title: '菜单名称',
          dataIndex: 'title'
        },
        {
          title: '菜单路径',
          dataIndex: 'path'
        },
        {
          title: '菜单组件',
          dataIndex: 'component'
        },
        {
          title: '菜单图标',
          dataIndex: 'icon',
          scopedSlots: { customRender: 'icon' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      menuList: []
    }
  },
  created () {
    allTree().then(res => {
      this.menuList = res.data
    })
  },
  methods: {
    handleAdd () {
      this.$refs.createModal.add()
    },
    handleEdit (record) {
      this.$refs.createModal.edit(record)
    },
    handleOk () {
      allTree().then(res => {
        this.menuList = res.data
      })
    }
  }
}
</script>
