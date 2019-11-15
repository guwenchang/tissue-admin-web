<template>
  <a-modal :width="400" :visible="visible" :title="title" :footer="null" @cancel="handleCancel">
    <a-carousel arrows>
      <div
        slot="prevArrow"
        class="custom-slick-arrow"
        style="left: 10px;zIndex: 1"
      >
        <a-icon type="left-circle" />
      </div>
      <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
        <a-icon type="right-circle" />
      </div>
      <div v-for="item in items" :key="item.id">
        <img v-if="item.materialType === '1'" style="width:360px; height:300px" :src="item.materialUrl" />
        <video-player
          v-if="item.materialType === '2'"
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          :options="{...playerOptions, sources:{type: 'video/mp4',src: item.materialUrl}}"
        >
        </video-player>
      </div>
    </a-carousel>
  </a-modal>
</template>

<script>
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import { nowBetweenDate } from '@/utils/util'
export default {
  name: 'TemplatePreview',
  components: {
    videoPlayer
  },
  data () {
    return {
      title: '广告模版预览',
      visible: false,
      items: [],
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
  created () {},
  methods: {
    preview (items) {
      this.items = items.filter(i => {
        return nowBetweenDate(i.startDate, i.endDate)
      })
      this.visible = true
    },
    handleCancel () {
      this.visible = false
      this.items = []
    }
  }
}
</script>
<style scoped>
  /* For demo */
  .ant-carousel >>> .slick-slide {
    text-align: center;
    height: 300px;
    line-height: 300px;
    overflow: hidden;
  }

  .ant-carousel >>> .custom-slick-arrow {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.11);
    opacity: 0.3;
  }
  .ant-carousel >>> .custom-slick-arrow:before {
    display: none;
  }
  .ant-carousel >>> .custom-slick-arrow:hover {
    opacity: 0.5;
  }
</style>
