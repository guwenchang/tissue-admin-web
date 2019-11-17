<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="设备编号">
              <a-input v-model="queryParam.deviceNo" placeholder="设备编号"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleReset()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator" v-if="selectedRowKeys.length > 0">
      <a-button type="primary" icon="poweroff" @click="handlePowerOff()">关机</a-button>
      <a-button type="primary" icon="reload" @click="handleRestart()">重启</a-button>
      <a-button type="primary" icon="setting" @click="handleSleepSetting()">设置休眠时间</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="deviceId"
      :columns="columns"
      :data="loadData"
      :rowSelection="rowSelection"
      showPagination="auto"
    >
      <span slot="status" slot-scope="status">
        {{ status | statusFilter }}
      </span>
      <span slot="onlineStatus" slot-scope="onlineStatus">
        {{ onlineStatus | onlineStatusFilter }}
      </span>
      <span slot="action" slot-scope="text,record">
        <template>
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item @click="handleAddWipe(record)"><a>加纸</a></a-menu-item>
              <a-menu-item @click="handleQrCodePreview(record)"><a>二维码</a></a-menu-item>
            </a-menu>
            <a>更多<a-icon type="down"/></a>
          </a-dropdown>
        </template>
      </span>
    </s-table>
    <DeviceForm ref="createModal" @ok="handleOk" />
    <a-modal title="设置休眠时间" :visible="sleepSetting" @ok="handleSleepSettingSubmit" @cancel="sleepSetting = false">
      <a-form layout="inline">
        <a-form-item label="休眠起止时间">
          <a-time-picker v-model="sleepSettingParam.startTime" format="HH:mm" />
          <a-time-picker v-model="sleepSettingParam.endTime" format="HH:mm" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal title="加纸" :visible="addWipe" @ok="handleAddWipeSubmit" @cancel="addWipe = false">
      <a-form>
        <a-form-item
          label="设备编号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <span class="ant-form-text">
            设备编码 {{ addItem.deviceCode }}
          </span>
        </a-form-item>
        <a-form-item
          label="纸巾余量"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <span class="ant-form-text">
            干纸巾余量 {{ addItem.dryWipesCount }},
            干纸巾余量 {{ addItem.wetWipesCount }},
          </span>
        </a-form-item>
        <a-form-item
          label="干纸巾数量"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-number placeholder="干纸巾数量" :min="0" :step="1" v-model="addWipeParam.dryWipesCount" />
        </a-form-item>
        <a-form-item
          label="湿纸巾数量"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-number placeholder="湿纸巾数量" :min="0" :step="1" v-model="addWipeParam.wetWipesCount" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal :title="qrCodePreviewItem.deviceCode+'-的二维码'" :visible="qrCodePreview" @ok="qrCodePreview = false" @cancel="qrCodePreview = false">
      <img style="width: 400px;height:400px" :src="qrCodePreviewItem.qrCode" />
    </a-modal>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import DeviceForm from './DeviceForm'
import { page, powerOff, restart, sleepSetting, addWipe } from '@/api/device'
import moment from 'moment'

const statusMap = {
  1: {
    text: '待分配'
  },
  2: {
    text: '已分配'
  },
  3: {
    text: '报修中'
  }
}

const onlineStatusMap = {
  1: {
    text: '在线'
  },
  2: {
    text: '离线'
  }
}

export default {
  name: 'DeviceList',
  components: {
    STable,
    Ellipsis,
    DeviceForm
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
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '设备编码',
          dataIndex: 'deviceCode'
        },
        {
          title: '所属机构',
          dataIndex: 'placeName'
        },
        {
          title: '运维人员',
          dataIndex: 'ownerName'
        },
        {
          title: '设备状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '在线状态',
          dataIndex: 'onlineStatus',
          scopedSlots: { customRender: 'onlineStatus' }
        },
        {
          title: '剩余干纸量',
          dataIndex: 'dryWipesCount'
        },
        {
          title: '剩余湿纸量',
          dataIndex: 'wetWipesCount'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectedRowKeys: [],
      selectedRows: [],
      alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
      rowSelection: {
        selectedRowKeys: this.selectedRowKeys,
        selectedRows: this.selectedRows,
        onChange: this.onSelectChange
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return page(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.data
          })
      },
      sleepSetting: false,
      sleepSettingParam: {},
      addWipe: false,
      addItem: {},
      addWipeParam: {
        deviceId: '',
        dryWipesCount: 0,
        wetWipesCount: 0
      },
      qrCodePreview: false,
      qrCodePreviewItem: {}
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    onlineStatusFilter (type) {
      return onlineStatusMap[type].text
    }
  },
  created () {},
  methods: {
    moment,
    handleEdit (record) {
      this.$refs.createModal.edit(record)
    },
    handleQrCodePreview (record) {
      this.qrCodePreviewItem = record
      this.qrCodePreview = true
    },
    handleAddWipe (record) {
      this.addItem = record
      this.addWipeParam = {
        deviceId: this.addItem.deviceId,
        dryWipesCount: 0,
        wetWipesCount: 0
      }
      this.addWipe = true
    },
    handleAddWipeSubmit () {
      const _this = this
      addWipe(this.addWipeParam).then(res => {
        _this.$refs.table.refresh(true)
        _this.addWipe = false
      })
    },
    handlePowerOff () {
      const _this = this
      const param = {
        deviceIds: this.selectedRowKeys
      }
      this.$confirm({
        title: '确定要将选中设备关机吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          powerOff(param).then(res => {
            _this.$refs.table.refresh(true)
          })
        }
      })
    },
    handleRestart () {
      const _this = this
      const param = {
        deviceIds: this.selectedRowKeys
      }
      this.$confirm({
        title: '确定要将选中设重启吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          restart(param).then(res => {
            _this.$refs.table.refresh(true)
          })
        }
      })
    },
    handleSleepSetting (item) {
      if (item) {
        this.sleepSettingParam.startTime = moment(item.startTime, 'HH:mm')
        this.sleepSettingParam.endTime = moment(item.endTime, 'HH:mm')
        this.sleepSettingParam.deviceIds = [item.deviceId]
      } else {
        this.sleepSettingParam = {}
      }
      this.sleepSetting = true
    },
    handleSleepSettingSubmit () {
      const _this = this
      if (this.sleepSettingParam.deviceIds === undefined) {
        this.sleepSettingParam.deviceIds = this.selectedRowKeys
      }
      const param = {
        deviceIds: this.sleepSettingParam.deviceIds,
        startTime: this.sleepSettingParam.startTime.format('HH:mm'),
        endTime: this.sleepSettingParam.endTime.format('HH:mm')
      }
      sleepSetting(param).then(res => {
        _this.$refs.table.refresh(true)
        _this.sleepSetting = false
      })
    },
    handleReset () {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    handleOk () {
      this.$message.info(`保存成功`)
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      console.log(this.selectedRowKeys)
      console.log(this.selectedRows)
    }
  }
}
</script>
