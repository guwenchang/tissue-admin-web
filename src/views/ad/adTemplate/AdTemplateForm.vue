<template>
  <a-drawer
    :title="title"
    width="960"
    @close="visible = false"
    :visible="visible"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <a-form @submit="handleSubmit" :form="form">
      <a-row class="form-row" type="flex">
        <a-col :span="12">
          <!-- 总部人员才可以分配代理商，代理商只能默认当前代理商 -->
          <a-form-item
            v-if="this.$store.getters.userInfo.agentId === 0"
            label="代理商"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select
              size="default"
              placeholder="代理商"
              v-decorator="['agentId', {rules:[{required: true, message: '请选择代理商'}]}]"
            >
              <a-select-option v-for="agent in this.agentList" :key="agent.id">
                {{ agent.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="模版类型"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select
              size="default"
              placeholder="模版类型"
              v-decorator="['templateType', {rules:[{required: true, message: '请选择模版类型'}]}]"
            >
              <a-select-option v-for="item in this.templateTypeList" :key="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" type="flex">
        <a-col :span="12">
          <a-form-item
            label="模版名称"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input placeholder="模版名称" v-decorator="['name', {rules:[{required: true, message: '请输入模版名称'}]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="状态"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-switch v-decorator="['status', { valuePropName: 'checked' }]" checkedChildren="启用" unCheckedChildren="禁用" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- table -->
    <a-card>
      <a-list
        :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
        :dataSource="mdl.items"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <template>
            <a-card :hoverable="true" style="width:240px">
              <img
                style="width:240px;height:240px;"
                :alt="item.materialName"
                :src="item.materialType === '1' ? item.materialUrl : 'http://img.iweichan.com/video.jpeg'"
                slot="cover"
              />
              <template class="ant-card-actions" slot="actions">
                <a v-if="item.editable" @click="handleSave(item)">保存</a>
                <a v-else @click="handleEdit(item)">编辑</a>
                <a @click="handlePreview(item)">预览</a>
                <a @click="handleDelete(item)">删除</a>
              </template>
              <a-card-meta :title="item.name">
                <template slot="description">
                  <a-range-picker
                    @change="onChange"
                    v-if="item.editable"
                    :defaultValue="[moment(item.startDate,dateFormat), moment(item.endDate,dateFormat)]"
                  />
                  <template v-else>
                    <span style="line-height:32px">{{ item.startDate + '-' + item.endDate }}</span>
                  </template>
                </template>
              </a-card-meta>
            </a-card>
          </template>
        </a-list-item>
      </a-list>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="handleSelect">添加素材</a-button>
    </a-card>
    <div
      :style="{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
      }"
    >
      <a-button :style="{marginRight: '8px'}" @click="visible = false">
        取消
      </a-button>
      <a-button @click="handleSubmit" type="primary">保存</a-button>
    </div>
    <a-modal :visible="preview" :footer="null" @cancel="handlePreviewCancel">
      <img v-if="previewType === '1'" style="width: 100%" :src="previewUrl" />
      <video-player
        v-if="previewType === '2'"
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
      >
      </video-player>
    </a-modal>
    <MaterialSelect ref="materialSelect" @selectOk="handleSelectOk" />
  </a-drawer>
</template>

<script>
import MaterialSelect from '../material/MaterialSelect'
import { get, add, update } from '@/api/adTemplate'
import pick from 'lodash.pick'
import { listByType } from '@/api/adminDict'
import { list as agentList } from '@/api/agent'
import moment from 'moment'
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
export default {
  name: 'AdTemplateForm',
  components: {
    MaterialSelect,
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
      dateFormat: 'YYYY-MM-DD',
      mdl: {},
      visible: false,
      templateTypeList: [],
      agentList: [],
      startEndDate: [],
      title: '',
      preview: false,
      previewUrl: '',
      previewType: '1',
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
    listByType('template_type').then(res => {
      this.templateTypeList = res.data
    })
  },
  methods: {
    moment,
    onChange (date, dateString) {
      this.startEndDate = dateString
    },
    handleSelectOk (items) {
      this.mdl.items = items
      console.log(items)
    },
    handleSelect () {
      this.$refs.materialSelect.select(this.mdl.items)
    },
    add () {
      this.title = '新建模版'
      this.visible = true
      this.mdl = {
        agentId: this.$store.getters.userInfo.agentId === 0 ? undefined : this.$store.getters.userInfo.agentId,
        templateType: undefined,
        name: '',
        status: true,
        items: []
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
        this.title = '编辑模版'
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'agentId', 'templateType', 'name', 'status'))
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
    handleEdit (item) {
      console.log(item)
      item.editable = true
    },
    handleSave (item) {
      item.startDate = this.startEndDate[0]
      item.endDate = this.startEndDate[1]
      item.editable = false
    },
    handleDelete (item) {
      this.items.splice(this.items.findIndex(i => i.id === item.materialId), 1)
    },
    handlePreview (item) {
      this.preview = true
      this.previewUrl = item.materialUrl
      this.previewType = item.materialType
      if (this.previewType === '2') {
        this.playerOptions.sources = [{
          src: item.materialUrl, // 路径
          type: 'video/mp4'// 类型
        }]
      }
    },
    handlePreviewCancel () {
      if (this.previewType === '2') {
        this.$refs.videoPlayer.player.pause()
      }
      this.preview = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>
