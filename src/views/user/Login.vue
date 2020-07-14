<template>
  <div class="main">
    <a-form-model
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :model="loginForm"
      :rules="loginRules"
    >
      <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="账户或密码错误" />
      <a-form-model-item prop="username">
        <a-input
          size="large"
          type="text"
          placeholder="账户"
          v-model="loginForm.username"
          tabindex="1"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="password">
        <a-input-password
          size="large"
          placeholder="密码"
          v-model="loginForm.password"
          tabindex="2"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input-password>
      </a-form-model-item>
      <a-form-model-item prop="captchaCode">
        <a-input
          size="large"
          placeholder="验证码"
          v-model="loginForm.captchaCode"
          class="captchainput"
          tabindex="3"
        >
          <a-icon slot="prefix" type="safety" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
        <img class="captchaimage" :src="captchaURL" @click="captchaClick"/>
      </a-form-model-item>
      <a-form-model-item>
        <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">自动登录</a-checkbox>
      </a-form-model-item>

      <a-form-model-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
          @click="handleSubmit('formLogin')"
        >确定</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import md5 from 'md5'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getCaptchaInfo } from '@/api/login'
export default {
  data () {
    return {
      // 是否显示登录错误信息；
      isLoginError: false,
      // loginForm 数据
      loginForm: {
        username: '',
        password: '',
        captchaCode: '',
        captchaUUID: '',
        rememberMe: false
      },
      // 输入校验规则
      loginRules: {
        username: [
          { required: true, message: '请输入帐户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      state: {
        time: 60,
        loginBtn: false
      },
      // 验证码图片的URL连接
      captchaURL: ''
    }
  },
  created () {
    this.getCaptcha()
  },
  methods: {
    // 导入store中的两个函数
    ...mapActions([
      'Login',
      'Logout'
    ]),

    // 确定登陆
    handleSubmit (formname) {
      // e.preventDefault()
      this.state.loginBtn = true
      this.$refs[formname].validate(valid => {
        if (valid) {
          console.log('login form', this.loginForm)
          this.loginForm.password = md5(this.loginForm.password)
          this.Login(this.loginForm)
            .then((res) => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              this.state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            this.state.loginBtn = false
          }, 600)
        }
      })
    },

    // 登陆成功后-在主页面中显示欢迎信息；
    loginSuccess (res) {
      console.log(res)
      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },

    // 登陆失败，则显示错误信息；
    requestFailed (err) {
      this.isLoginError = true
      this.notificationFailed(err, '请求出现错误，请稍后再试')
    },

    // 获取失败时的提示信息
    notificationFailed (err, description) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || description,
        duration: 4
      })
    },

    // 验证码图片点击事件
    captchaClick () {
      this.getCaptcha()
    },

    // 获取验证码信息
    getCaptcha () {
      getCaptchaInfo()
        .then(res => {
          console.log(res)
          console.log(res.result.captchauuid)
          console.log(res.result.captchaurl)
          this.loginForm.captchaUUID = res.result.captchaUUID
          this.captchaURL = res.result.captchaURL
        })
        .catch(err => this.notificationFailed(err, '验证码获取错误，请稍后再试'))
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
  .captchaimage {
    float: right;
    height: 40px;
    width: 35%;
    border: 1px solid salmon;
    &:hover {
      cursor: pointer;
    }
  }
  .captchainput {
    float: left;
    height: 40px;
    width:65%;
  }
}
</style>
