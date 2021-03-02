<template>
  <div class="login">
    <div class="login-img"></div>
    <el-form ref="loginForm" :model="loginForm" :rules="rules" :size="'medium'" status-icon class="my-login-form">
      <!-- 用户名 -->
      <el-form-item prop="name">
        <el-input
          v-model="loginForm.name"
          clearable
          :maxlength="20"
          placeholder="输入用户名"
          prefix-icon="el-icon-user"
        ></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="pass">
        <el-input
          v-model="loginForm.pass"
          type="password"
          autocomplete="off"
          clearable
          show-password
          placeholder="输入密码"
          :maxlength="20"
          prefix-icon="el-icon-unlock"
        ></el-input>
      </el-form-item>
      <!-- 记住密码 -->
      <el-form-item>
        <el-checkbox v-model="rememberPwd">记住密码</el-checkbox>
      </el-form-item>
      <!-- 登录 -->
      <el-form-item class="login_btn_box">
        <el-button
          type="primary"
          size="medium"
          :loading="loading"
          :disabled="loading"
          class="login-btn"
          @click="submitForm('loginForm')"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { adminLogin } from '../api/admin'

export default {
  data() {
    // 自定义的用户名规则
    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    // 自定义的密码校验规则
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      rememberPwd: false, // 记住密码
      loading: false, // 登陆中
      loginForm: {
        name: '',
        pass: ''
      }, // 登陆表单
      rules: {
        name: [
          { required: true, message: '请输入用户名' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入密码' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      } // 表单校验规则
    }
  },
  computed: {
    ...mapState({
      toPath: 'toPath'
    }),
    // 从本地读取用户名
    localName() {
      if (localStorage.getItem('localNameOfBlog')) {
        return localStorage.getItem('localNameOfBlog')
      }
      return ''
    },
    // 从本地读取密码
    localPwd() {
      if (localStorage.getItem('localPwdOfBlog')) {
        return localStorage.getItem('localPwdOfBlog')
      }
      return ''
    }
  },
  watch: {
    // 监听记住密码
    rememberPwd(val) {
      if (val) {
        localStorage.setItem('remarkPwdOfBlog', 1)
      } else {
        localStorage.removeItem('remarkPwdOfBlog')
        localStorage.removeItem('localNameOfBlog')
        localStorage.removeItem('localPwdOfBlog')
      }
    }
  },
  created() {
    // 记住密码
    if (localStorage.getItem('remarkPwdOfBlog')) {
      this.rememberPwd = true
      if (this.localName && this.localPwd) {
        this.loginForm.name = this.localName
        this.loginForm.pass = this.localPwd
      }
    }
  },
  methods: {
    // 登陆
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 表单验证通过，可以登陆
          console.log('表单验证通过，可以登陆')
          // 记住密码
          if (this.rememberPwd) {
            localStorage.setItem('localNameOfBlog', this.loginForm.name)
            localStorage.setItem('localPwdOfBlog', this.loginForm.pass)
          }
          // 显示loading
          this.loading = true
          // const timer = setTimeout(() => {
          //   // this.btnInfo = { text: '登录', disabled: false }
          //   console.log('setTimeOut')
          //   this.loading = false
          // }, 5000)
          // admin 登陆
          const { name, pass } = this.loginForm
          adminLogin(name, pass)
            .then((res) => {
              console.log('登陆结果', res)
              this.loading = false
              if (res.code === 200) {
                this.$store.commit('admin/SET_USER_INFO', res.data.userInfo)
                localStorage.setItem('validateToken', res.data.token)
                // 页面跳转
                this.$router.push({ path: this.toPath })
              } else if (res.code === -1) {
                // 错误提示
                this.$message.error('账号或密码错误！')

                // this.$refs['loginForm'].clearValidate()
                // 手动操作校验、展示登录错误信息
                this.rules.pass.push({
                  // js新增一个自定义校验
                  validator: (rule, value, callback) => {
                    callback(new Error(res.msg ? res.msg : '账号或密码错误！'))
                  },
                  trigger: 'blur'
                })
                this.$refs['loginForm'].validateField('pass') // 手动校验
                this.rules.pass = this.rules.pass.slice(3, 1) // 删除校验，这个看自己之前写了几个校验来定split也可
              }
            })
            .catch((err) => {
              console.log(err)
              this.loading = false
              // this.$alert('登陆超时！')
            })
        } else {
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
  .login-img {
    width: 100%;
    height: 100%;
    background: url('/img/login-bg.jpeg') 0 0 no-repeat;
    background-size: cover;
    position: absolute;
    top: 0;
    right: 0;
    filter: brightness(0.6);
  }
}

::v-deep .my-login-form {
  padding: 20px;
  z-index: 100;
  display: flex;
  width: 400px;
  flex-direction: column;
  justify-content: space-between;

  .login_btn_box {
    display: flex;
    justify-content: center;
    .login-btn {
      width: 150px;
    }
  }
}

@media screen and(max-width: 767px) {
  .my-login-form {
    width: 100%;
    max-width: 400px;
  }
}
</style>
