<template>
  <a-modal :width="640" :visible="visible" :title="title" @ok="handleSubmit" @cancel="visible = false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="父级菜单"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-tree-select
          :treeData="menuTree"
          placeholder="请选择父级菜单"
          treeDefaultExpandAll
          v-decorator="['parentId']"
        />
      </a-form-item>
      <a-form-item
        label="菜单标题"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="菜单标题" v-decorator="['title', {rules:[{required: true, message: '请输入菜单标题'}]}]" />
      </a-form-item>
      <a-form-item
        label="菜单name"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="菜单name" v-decorator="['name', {rules:[{required: true, message: '请输入菜单name'}]}]" />
      </a-form-item>
      <a-form-item
        label="菜单路径"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="菜单路径" v-decorator="['path', {rules:[{required: true, message: '请输入菜单路径'}]}]" />
      </a-form-item>
      <a-form-item
        label="菜单组件"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="菜单组件" v-decorator="['component', {rules:[{required: true, message: '请输入菜单组件'}]}]" />
      </a-form-item>
      <a-form-item
        label="菜单图标"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="菜单图标" v-decorator="['icon']" />
      </a-form-item>
      <a-form-item
        label="菜单权限"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="菜单权限" v-decorator="['permission']" />
      </a-form-item>
      <a-form-item
        label="菜单类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group v-decorator="['type']" buttonStyle="solid">
          <a-radio-button value="1">菜单</a-radio-button>
          <a-radio-button value="2">功能</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="排序值"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-number placeholder="排序值" v-decorator="['sort']" :min="1" :max="100" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { get, add, update, allTree } from '@/api/adminMenu'
import pick from 'lodash.pick'

export default {
  name: 'MenuForm',
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
      mdl: {},
      visible: false,
      title: '',
      menuTree: [],
      form: this.$form.createForm(this)
    }
  },
  created () {
    allTree().then(res => {
      const root = {
        title: '根菜单',
        value: '0',
        children: []
      }
      this.menuTree = res.data
      this.menuTree.unshift(root)
    })
  },
  methods: {
    add () {
      this.title = '新建菜单'
      this.visible = true
      this.mdl = {
        parentId: '0',
        name: '',
        title: '',
        path: '',
        component: '',
        icon: '',
        permission: '',
        type: '1',
        sort: '1'
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(this.mdl)
      })
    },
    edit (record) {
      get(record.id).then(res => {
        this.mdl = res.data
        this.mdl.type = this.mdl.type.toString()
        this.mdl.parentId = this.mdl.parentId.toString()
        this.visible = true
        this.title = '编辑菜单'
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'parentId', 'name', 'title', 'path', 'component', 'icon', 'permission', 'type', 'sort'))
        })
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.visible = true
      validateFields((errors, values) => {
        if (!errors) {
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
    }
  }
}
</script>
