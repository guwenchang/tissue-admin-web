<template>
  <a-modal :width="900" :visible="visible" :title="title" @ok="handleSelectSubmit" @cancel="visible = false">
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
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="listData()">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleReset()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd()">新建</a-button>
    </div>
    <a-list
      :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <template>
          <a-card :hoverable="true" style="width:240px">
            <img
              class="select-class"
              @click="handleSelect(item)"
              :alt="item.name"
              :src="item.materialType === '1' ? item.url : 'http://img.iweichan.com/video.jpeg'"
              slot="cover"
            />
            <a-card-meta :description="item.name">
            </a-card-meta>
          </a-card>
        </template>
      </a-list-item>
    </a-list>
    <a-modal :visible="preview" :footer="null" @cancel="handleCancel">
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
  </a-modal>
</template>

<script>
import { page } from '@/api/adMaterial'
import { listByType } from '@/api/adminDict'
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
export default {
  name: 'MaterialSelect',
  components: {
    videoPlayer
  },
  data () {
    return {
      visible: false,
      title: '',
      loading: true,
      dataSource: [],
      selectItems: [],
      preview: false,
      previewUrl: '',
      previewType: '1',
      queryParam: {},
      materialTypeList: [],
      sizeTypeList: [],
      pagination: {
        onChange: page => {
          this.pageParam.pageNo = page
          this.listData()
        },
        showTotal: total => `共 ${total} 条`,
        pageSize: 6
      },
      pageParam: {
        pageSize: 6,
        pageNo: 1
      },
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
  created () {
    listByType('material_type').then(res => {
      this.materialTypeList = res.data
    })
    listByType('size_type').then(res => {
      this.sizeTypeList = res.data
    })
    this.listData()
  },
  methods: {
    listData () {
      this.loading = true
      page({ ...this.pageParam, ...this.queryParam }).then(res => {
        this.dataSource = res.data.records
        this.pagination.current = res.data.current
        this.pagination.total = res.data.total
        this.pagination.pageSize = res.data.size
        this.loading = false
      })
    },
    select (items) {
      this.title = '选择素材'
      this.visible = true
      this.selectItems = items
    },
    handleSelect (item) {
      if (this.selectItems.findIndex(n => n.id === item.id) > -1) {
        this.selectItems.splice(this.selectItems.findIndex(n => n.id === item.id), 1)
      } else {
        this.selectItems.push(item)
      }
      console.log(this.selectItems)
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
    handleSelectSubmit () {
      this.$emit('selectOk', this.selectItems)
      this.visible = false
    },
    handleCancel () {
      if (this.previewType === '2') {
        this.$refs.videoPlayer.player.pause()
      }
      this.preview = false
    }
  }
}
</script>
<style lang="less" scoped>
.select-class {
  width:240px;
  height:300px;
}
</style>
