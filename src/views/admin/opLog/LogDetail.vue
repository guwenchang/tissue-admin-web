<template>
  <a-modal :width="640" :visible="visible" :title="title" @ok="visible = false" @cancel="visible = false">
    <detail-list title="日志详情" :col="col" >
      <detail-list-item term="日志类型">{{ detailData.logType }}</detail-list-item>
      <detail-list-item term="日志标题">{{ detailData.title }}</detail-list-item>
      <detail-list-item term="IP地址">{{ detailData.remoteAddr }}</detail-list-item>
      <detail-list-item term="请求头">{{ detailData.userAgent }}</detail-list-item>
      <detail-list-item term="请求路径">{{ detailData.requestUri }}</detail-list-item>
      <detail-list-item term="请求参数">{{ detailData.params }}</detail-list-item>
      <detail-list-item term="请求耗时">{{ detailData.time + '毫秒' }}</detail-list-item>
      <detail-list-item term="请求时间">{{ detailData.createTime }}</detail-list-item>
      <detail-list-item term="请求人">{{ detailData.createBy }}</detail-list-item>
    </detail-list>
  </a-modal>
</template>

<script>
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item

export default {
  components: {
    DetailList,
    DetailListItem
  },
  name: 'LogDetail',
  data () {
    return {
      col: 1,
      detailData: {},
      visible: false,
      title: ''
    }
  },
  created () {},
  methods: {
    detail (record) {
      this.visible = true
      this.detailData = record
    }
  }
}
</script>
