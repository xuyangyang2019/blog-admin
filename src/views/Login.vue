<template>
  <div class="login">
    <div class="form-content">
      <div class="input">
        <label for="i">用户名 ：</label>
        <div class="input-box">
          <input id="i" v-model="user" type="text" placeholder="请输入用户名" @focus="clearErr" />
          <span class="err">{{ err.user }}</span>
        </div>
      </div>
      <div class="pwd">
        <label for="p">密码 ：</label>
        <div class="input-box">
          <input
            id="p"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            @keydown.enter="validateAndLonin(toPath)"
            @focus="clearErr"
          />
          <span class="err">{{ err.password }}</span>
          <span class="err">{{ err.validate }}</span>
        </div>
      </div>
      <div class="submit">
        <button :disabled="btnInfo.disabled" @click="validateAndLonin(toPath)">
          {{ btnInfo.text }}
        </button>
      </div>
    </div>
    <div class="login-mask"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { adminLogin } from '../api/admin'

export default {
  data() {
    return {
      user: '', // 用户名
      password: '', // 密码
      err: { user: '', password: '', validate: '' }, // 错误信息
      btnInfo: { text: '登录', disabled: false } // 登录按钮的状态
    }
  },
  computed: {
    ...mapState({
      toPath: 'toPath'
    })
  },
  methods: {
    // 表单验证并登陆
    validateAndLonin(toPath) {
      if (!this.user) {
        this.err.user = '请填写用户名'
      }
      if (!this.password) {
        this.err.password = '请填写密码'
      }
      // “!!” ——两个叹号表示把目标值转化为布尔值，相当于使用Boolean()方法
      // 在if语句中,表达式的结果将被强制为布尔值，通过双重否定（!!）或强制转换为布尔值Boolean是不必要的
      if (!!this.password && !!this.user) {
        // 修改按钮显示的文字 不能再次点击
        this.btnInfo = { text: '登录中...', disabled: true }
        // admin 登陆
        adminLogin(this.user, this.password).then((res) => {
          console.log('登陆结果', res)
          this.btnInfo = { text: '登录', disabled: false }
          if (res.code === 200) {
            this.$store.commit('admin/SET_USER_INFO', res.data.userInfo)
            localStorage.setItem('validateToken', res.data.token)
            // 页面跳转
            this.$router.push({ path: toPath })
          } else if (res.code === -1) {
            // 错误提示
            this.err.validate = res.msg
          }
        })
        setTimeout(() => {
          this.btnInfo = { text: '登录', disabled: false }
        }, 5000)
      }
    },
    // 清除错误信息
    clearErr() {
      this.err = { user: '', password: '', validate: '' }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
  background: url('/img/login-bg.jpeg') 0 0 no-repeat;
  background-size: 100% 100%;
  color: #ffffff;
}

.form-content {
  box-sizing: border-box;
  position: relative;
  z-index: 100;
  border-radius: 5px;
  padding: 20px;
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .input,
  .pwd {
    display: flex;
    align-items: center;
    margin-top: 25px;
    width: 100%;

    label {
      position: absolute;
      display: inline-block;
      width: 75px;
      text-align: right;
      font-size: 14px;
    }

    input {
      box-sizing: border-box;
      flex-shrink: 1;
      width: 100%;
      outline: none;
      padding: 10px;
      border: 1px solid #ffffff;
      border-radius: 5px;
    }

    .input-box {
      display: inline-block;
      position: relative;
      width: 100%;
      flex-shrink: 1;
      margin-left: 80px;
      .err {
        color: red;
        position: absolute;
        top: 100%;
        left: 0;
        font-size: 14px;
      }

      .err-validate {
        color: red;
        font-size: 14px;
      }
    }
  }
  .submit {
    margin-top: 25px;
    button {
      outline: none;
      padding: 5px 25px;
      border: 1px solid #46afcb;
      border-radius: 5px;
      cursor: pointer;
      background: #46afcb;
      color: #ffffff;
    }
    button:hover {
      opacity: 0.9;
    }
    button[disabled] {
      cursor: wait;
    }
  }
}

.login-mask {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
}

@media screen and(max-width: 767px) {
  .form-content {
    width: 100%;
  }
}
</style>
