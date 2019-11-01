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
          @change="handleMaterialTypeChange"
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
          :accept="accept"
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
      <a-form-item
        label="状态"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-switch v-decorator="['status', { valuePropName: 'checked' }]" checkedChildren="启用" unCheckedChildren="禁用" />
      </a-form-item>
    </a-form>
    <a-modal :visible="preview" :footer="null" @cancel="handleCancel">
      <img v-if="previewType === '1'" style="width: 100%" :src="previewUrl" />
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
      >
      </video-player>
    </a-modal>
  </a-modal>
</template>

<script>
import { get, add, update } from '@/api/adMaterial'
import { list as agentList } from '@/api/agent'
import { listByType } from '@/api/adminDict'
import { getUploadToken } from '@/api/common'
import pick from 'lodash.pick'
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
const baseImgUrl = 'https://static.iweichan.com/'
export default {
  name: 'MaterialForm',
  components: {
    videoPlayer
  },
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
      accept: '.png, .jpg, .jpeg, .gif',
      key: '',
      mdl: {},
      visible: false,
      title: '',
      materialTypeList: [],
      sizeTypeList: [],
      agentList: [],
      preview: false,
      previewUrl: '',
      previewType: '1',
      fileList: [],
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [],
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true// 全屏按钮
        }
      },
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
      this.fileList = []
      this.mdl = {
        agentId: this.$store.getters.userInfo.agentId === 0 ? undefined : this.$store.getters.userInfo.agentId,
        materialType: undefined,
        sizeType: undefined,
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
    handlePreview () {
      this.preview = true
      this.previewUrl = this.mdl.url
      this.previewType = this.mdl.materialType
      if (this.mdl.materialType === '2') {
        this.playerOptions.sources = [{
          src: this.mdl.url, // 路径
          type: 'video/mp4'// 类型
        }]
      }
    },
    handleCancel () {
      if (this.previewType === '2') {
        this.$refs.videoPlayer.player.pause()
      }
      this.preview = false
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
    },
    handleMaterialTypeChange (value) {
      if (value === '2') {
        this.accept = '.mp4'
      } else {
        this.accept = '.png, .jpg, .jpeg, .gif'
      }
    }
  }
}
</script>
