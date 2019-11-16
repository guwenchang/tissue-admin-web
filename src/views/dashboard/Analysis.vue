<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="设备总数" :total="totalData.deviceCount | NumberFormat">
          <a-tooltip title="设备总数" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <template slot="footer">今日开机数<span>{{ totalData.onlineDeviceCount }}}台</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总订单量" :total="totalData.orderCount | NumberFormat">
          <a-tooltip title="总订单量" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <template slot="footer">
            <span> 今日订单量{{ totalData.todayOrderCount | NumberFormat }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="支付金额" :total="totalData.orderAmount | NumberFormat">
          <a-tooltip title="支付金额" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <template slot="footer">
            <span> 今日支付金额{{ totalData.todayOrderAmount | NumberFormat }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="扫码量" :total="totalData.scanCount | NumberFormat">
          <a-tooltip title="扫码量" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <template slot="footer">
            <span> 今日扫码量{{ totalData.todayScanCount | NumberFormat }}</span>
          </template>
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a-radio-group @change="dateChange" v-model="statisticsParam.statisticsType">
                <a-radio-button value="1">日</a-radio-button>
                <a-radio-button value="2">月</a-radio-button>
                <a-radio-button value="3">年</a-radio-button>
              </a-radio-group>
            </div>
            <a-range-picker v-model="dateRange" @change="dateChange" :style="{width: '256px'}" />
          </div>
          <a-tab-pane loading="true" tab="扫码量" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="scanStatisticsData" title="扫码量统计" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="机构扫码排行榜" :list="scanRankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="销售额" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="saleStatisticsData" title="销售额统计" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="机构销售排行榜" :list="saleRankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { ChartCard, MiniArea, MiniBar, MiniProgress, RankList, Bar, Trend, NumberInfo, MiniSmoothArea } from '@/components'
import { mixinDevice } from '@/utils/mixin'
import { total, scan, sale } from '@/api/statistics'
export default {
  name: 'Analysis',
  mixins: [mixinDevice],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea
  },
  data () {
    return {
      loading: true,
      totalData: {},
      scanStatisticsData: [],
      saleStatisticsData: [],
      scanRankList: [],
      saleRankList: [],
      dateRange: [moment().subtract(1, 'months'), moment()],
      statisticsType: 1,
      statisticsParam: {
        statisticsType: '1'
      }
    }
  },
  created () {
    total().then(res => {
      this.totalData = res.data
    })
    this.dateChange()
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  methods: {
    moment,
    dateChange () {
      this.statisticsParam.startDate = this.dateRange[0].format('YYYY-MM-DD')
      this.statisticsParam.endDate = this.dateRange[1].format('YYYY-MM-DD')
      this.scanStatisticsData = []
      this.saleStatisticsData = []
      scan(this.statisticsParam).then(res => {
        for (var item of res.data.statisticsItemResults) {
          this.scanStatisticsData.push({
            x: item.businessDate,
            y: item.total
          })
        }
        this.scanRankList = res.data.rankItemResults
      })
      sale(this.statisticsParam).then(res => {
        for (var item of res.data.statisticsItemResults) {
          this.saleStatisticsData.push({
            x: item.businessDate,
            y: item.total
          })
        }
        this.saleRankList = res.data.rankItemResults
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;

    &.desktop div[class^=ant-col]:last-child {
      position: absolute;
      right: 0;
      height: 100%;
    }
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    /deep/ .ant-card-head {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
</style>
