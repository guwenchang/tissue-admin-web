<template>
  <a-modal :width="640" :visible="visible" :title="title" @ok="handleSubmit" @cancel="visible = false">
    <a-form @submit="handleSubmit" :form="form">
      <!-- 总部人员才可以分配代理商，代理商只能默认当前代理商 -->
      <a-form-item
        v-if="this.$store.getters.userInfo.agentId === 0"
        label="所属代理商"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          size="default"
          placeholder="所属代理商"
          v-decorator="['agentId', {rules:[{required: true, message: '请选择代理商'}]}]"
        >
          <a-select-option v-for="agent in this.agentList" :key="agent.id">
            {{ agent.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="素材类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          size="default"
          placeholder="素材类型"
          v-decorator="['materialType', {rules:[{required: true, message: '请选择素材类型'}]}]"
        >
          <a-select-option v-for="item in this.materialTypeList" :key="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="尺寸类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          size="default"
          placeholder="尺寸类型"
          v-decorator="['sizeType', {rules:[{required: true, message: '请选择尺寸类型'}]}]"
        >
          <a-select-option v-for="item in this.sizeTypeList" :key="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="素材名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="素材名称" v-decorator="['name', {rules:[{required: true, message: '请输入素材名称'}]}]" />
      </a-form-item>
      <a-form-item
        label="素材地址"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="素材地址" v-decorator="['url', {rules:[{required: true, message: '请输入素材地址'}]}]" />
        <a-upload
          accept=".png, .jpg, .jpeg, .gif"
          action="https://upload-z1.qiniup.com"
          listType="picture-card"
          :fileList="fileList"
          :beforeUpload="beforeUpload"
          :data="getUploadData"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div v-if="fileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">上传素材</div>
          </div>
        </a-upload>
      </a-form-item>

      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
      <a-form-item
        label="状态"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-switch v-decorator="['status', { valuePropName: 'checked' }]" checkedChildren="启用" unCheckedChildren="禁用" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { get, add, update } from '@/api/adMaterial'
import { list as agentList } from '@/api/agent'
import { listByType } from '@/api/adminDict'
import { getUploadToken } from '@/api/common'
import pick from 'lodash.pick'

const baseImgUrl = 'https://static.iweichan.com/'
export default {
  name: 'MaterialForm',
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
      uploadToken: '',
      key: '',
      mdl: {},
      visible: false,
      title: '',
      materialTypeList: [],
      sizeTypeList: [],
      agentList: [],
      previewVisible: false,
      previewImage: '',
      fileList: [],
      form: this.$form.createForm(this)
    }
  },
  created () {
    agentList({}).then(res => {
      this.agentList = res.data
    })
    listByType('material_type').then(res => {
      this.materialTypeList = res.data
    })
    listByType('size_type').then(res => {
      this.sizeTypeList = res.data
    })
  },
  methods: {
    add () {
      this.title = '新建素材'
      this.visible = true
      this.mdl = {
        agentId: this.$store.getters.userInfo.agentId === 0 ? undefined : this.$store.getters.userInfo.agentId,
        materialType: '',
        sizeType: '',
        name: '',
        url: '',
        status: true
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...this.mdl })
      })
    },
    edit (record) {
      get(record.id).then(res => {
        this.mdl = res.data
        this.mdl.status = this.mdl.status === 1
        this.visible = true
        this.fileList = [
          {
            uid: record.id,
            name: record.url,
            status: 'done',
            url: record.url
          }
        ]
        this.title = '编辑素材'
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'agentId', 'materialType', 'sizeType', 'name', 'url', 'status'))
        })
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.visible = true
      validateFields((errors, values) => {
        if (!errors) {
          values.status = values.status ? 1 : 2
          if (this.mdl.id) {
            update(Object.assign(this.mdl, values))
              .then(res => {
                this.$emit('ok')
                this.visible = false
              }).catch(error => console.log(error))
          } else {
            add(Object.assign(this.mdl, values))
              .then(res => {
                this.$emit('ok')
                this.visible = false
              }).catch(error => console.log(error))
          }
        }
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ file, fileList }) {
      if (file.status === 'done') {
        this.form.setFieldsValue({ url: baseImgUrl + file.response.key })
      }
      this.fileList = fileList
    },
    beforeUpload (file) {
      const format = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
      const key = Date.now() + '' + Math.floor(Math.random() * (999 - 100) + 100)
      this.key = key + '.' + format
      this.mdl.format = format
      return new Promise((resolve, reject) => {
        getUploadToken(this.key).then(res => {
          this.uploadToken = res.data
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    getUploadData (file) {
      return {
        token: this.uploadToken,
        key: this.key
      }
    }
  }
}
</script>
