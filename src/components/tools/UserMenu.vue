<template>
  <div class="user-wrapper">
    <div class="content-box">
      <!-- <notice-icon class="action"/> -->
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar()"/>
          <span>{{ nickname() }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="1">
            <a href="javascript:;" @click="handleResetPwd">
              <a-icon type="setting"/>
              <span>修改密码</span>
            </a>
          </a-menu-item>
          <a-menu-divider/>
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <a-modal title="修改密码" v-model="visible" @ok="handleOk">
      <a-form @submit="handleOk" :form="form">
        <a-form-item
          label="密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input placeholder="密码" type="password" v-decorator="['password', {rules:[{required: true, message: '请输入密码'}]}]" />
        </a-form-item>
        <a-form-item
          label="确认密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input placeholder="确认密码" type="password" v-decorator="['rePassword', {rules:[{required: true, message: '请确认密码'}]}]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
// import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserMenu',
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
      visible: false,
      mdl: {},
      form: this.$form.createForm(this)
    }
  },
  methods: {
    ...mapActions(['Logout', 'ChangePwd']),
    ...mapGetters(['nickname', 'avatar']),
    handleResetPwd () {
      this.visible = true
      this.mdl = {
        password: '',
        rePassword: ''
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...this.mdl })
      })
    },
    handleOk () {
      const that = this
      const { form: { validateFields } } = this
      this.visible = true
      validateFields((errors, values) => {
        if (!errors) {
          that.ChangePwd(Object.assign(this.mdl, values))
            .then(res => {
              this.$emit('ok')
              this.visible = false
            }).catch(error => console.log(error))
        }
      })
    },
    handleLogout () {
      const that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          return that.Logout({}).then(() => {
            window.location.reload()
          }).catch(err => {
            that.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>
