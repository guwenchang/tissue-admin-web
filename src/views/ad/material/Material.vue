<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="素材类型">
              <a-select
                size="default"
                placeholder="素材类型"
                v-model="queryParam.materialType"
              >
                <a-select-option v-for="item in this.materialTypeList" :key="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="尺寸类型">
              <a-select
                size="default"
                placeholder="尺寸类型"
                v-model="queryParam.sizeType"
              >
                <a-select-option v-for="item in this.sizeTypeList" :key="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
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
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <span slot="materialType" slot-scope="materialType">
        {{ materialType | materialTypeFilter }}
      </span>
      <span slot="sizeType" slot-scope="sizeType">
        {{ sizeType | sizeTypeFilter }}
      </span>
      <span slot="status" slot-scope="status">
        {{ status | statusFilter }}
      </span>
      <span slot="action" slot-scope="text,record">
        <template v-if="record.status === 1">
          <a @click="handleEdit(record)">修改</a>
        </template>
        <template v-if="record.status === 2">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record.id)">删除</a>
        </template>
        <template>
          <a-divider type="vertical" />
          <a @click="handlePreview(record)">预览</a>
        </template>
      </span>
    </s-table>
    <MaterialForm ref="createModal" @ok="handleOk" />
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

  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import MaterialForm from './MaterialForm'
import { page, remove } from '@/api/adMaterial'
import { listByType } from '@/api/adminDict'
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
const statusMap = {
  1: '启用',
  2: '禁用'
}
let that
export default {
  name: 'MaterialList',
  components: {
    STable,
    Ellipsis,
    MaterialForm,
    videoPlayer
  },
  data () {
    return {
      preview: false,
      previewUrl: '',
      previewType: '1',
      advanced: false,
      // 查询参数
      queryParam: {},
      materialTypeList: [],
      materialTypeMap: {},
      sizeTypeList: [],
      sizeTypeMap: {},
      // 表头
      columns: [
        {
          title: '素材类型',
          dataIndex: 'materialType',
          scopedSlots: { customRender: 'materialType' }
        },
        {
          title: '尺寸类型',
          dataIndex: 'sizeType',
          scopedSlots: { customRender: 'sizeType' }
        },
        {
          title: '素材名称',
          dataIndex: 'name'
        },
        {
          title: '素材格式',
          dataIndex: 'format'
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
      },
      selectedRowKeys: [],
      selectedRows: [],
      // custom table alert & rowSelection
      options: {
        alert: { show: false, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: true,
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
      }
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type]
    },
    materialTypeFilter (type) {
      return that.materialTypeMap[type]
    },
    sizeTypeFilter (type) {
      return that.sizeTypeMap[type]
    }
  },
  beforeCreate: function () {
    that = this
  },
  created () {
    listByType('material_type').then(res => {
      this.materialTypeList = res.data
      const map = {}
      for (var item of this.materialTypeList) {
        map[item.value] = item.label
      }
      this.materialTypeMap = map
    })
    listByType('size_type').then(res => {
      this.sizeTypeList = res.data
      const map = {}
      for (var item of this.sizeTypeList) {
        map[item.value] = item.label
      }
      this.sizeTypeMap = map
    })
    this.tableOption()
  },
  methods: {
    tableOption () {
      if (!this.optionAlertShow) {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              props: {
                name: record.id
              }
            })
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },
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
    handlePreview (record) {
      this.preview = true
      this.previewUrl = record.url
      this.previewType = record.materialType
      if (record.materialType === '2') {
        this.playerOptions.sources = [{
          src: record.url, // 路径
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
