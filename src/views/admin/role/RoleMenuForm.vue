<template>
  <a-modal :width="640" :visible="visible" :title="title" @ok="handleSubmit" @cancel="visible = false">
    <a-tree
      checkable
      defaultExpandAll
      checkStrictly
      :autoExpandParent="autoExpandParent"
      v-model="checkedKeys"
      @check="onCheck"
      :treeData="treeData"
    />
  </a-modal>
</template>

<script>
import { get, updateMenu } from '@/api/adminRole'
import { allTree } from '@/api/adminMenu'

export default {
  name: 'RoleMenuForm',
  data () {
    return {
      title: '',
      autoExpandParent: true,
      checkedKeys: [],
      treeData: [],
      id: undefined,
      visible: false
    }
  },
  created () {
    allTree().then(res => {
      this.treeData = res.data
    })
  },
  methods: {
    edit (record) {
      get(record.id).then(res => {
        console.log(res)
        this.id = record.id
        this.visible = true
        this.title = record.roleName + '-分配权限'
        this.checkedKeys = res.data.menus.map(menu => menu.id.toString())
      })
    },
    handleSubmit () {
      const param = {
        id: this.id,
        menuIds: this.checkedKeys.checked
      }
      updateMenu(param).then(res => {
        this.$emit('ok')
        this.visible = false
      }).catch(error => console.log(error))
    },
    onCheck (checkedKeys, info) {
      this.checkedKeys = checkedKeys
    }
  }
}
</script>
