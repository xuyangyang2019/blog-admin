<template>
  <div class="admin-set">
    <h3>修改密码</h3>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
      <el-form-item label="原密码" :label-width="formLabelWidth" prop="oldPassword">
        <el-input
          v-model="ruleForm.oldPassword"
          type="password"
          placeholder="请输入原密码"
          clearable
          show-password
          maxlength="20"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
        <el-input
          v-model="ruleForm.newPassword"
          type="password"
          placeholder="请输入新密码"
          clearable
          show-password
          maxlength="20"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" :label-width="formLabelWidth" prop="checkNewPassword">
        <el-input
          v-model="ruleForm.checkNewPassword"
          type="password"
          placeholder="请再次输入新密码"
          clearable
          show-password
          maxlength="20"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="submitted" :loading="submitted" type="primary" @click="submitForm('ruleForm')">
          提交
        </el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表单 -->
    <form
      v-show="false"
      id="adminSetForm"
      class="admin-set-form"
      action="/"
      method="post"
      @submit.prevent="handleSubmit"
      @reset.prevent="handleReset"
    >
      <!-- 密码 -->
      <div class="form-item">
        <label class="form-item-label" for="oldPwd">原密码</label>
        <input
          id="oldPwd"
          v-model.trim.lazy="passwordForm.oldPwd"
          type="password"
          autocomplete="false"
          maxlength="20"
          class="form-item-input"
          placeholder="请输入原密码"
          @focus="errMsg.oldPwd = ''"
        />
      </div>
      <div class="error-msg" :class="{ 'error-msg-no': errMsg.oldPwd === '' }" v-text="errMsg.oldPwd"></div>
      <!-- 新密码 -->
      <div class="form-item">
        <label class="form-item-label" for="newPwd">新密码</label>
        <input
          id="newPwd"
          v-model.trim.lazy="passwordForm.newPwd"
          type="password"
          autocomplete="false"
          maxlength="20"
          class="form-item-input"
          placeholder="请输入新密码"
          @focus="errMsg.newPwd = ''"
        />
      </div>
      <div class="error-msg" :class="{ 'error-msg-no': errMsg.newPwd === '' }" v-text="errMsg.newPwd"></div>
      <!-- 确认密码 -->
      <div class="form-item">
        <label class="form-item-label" for="surePwd">新密码</label>
        <input
          id="surePwd"
          v-model.trim.lazy="passwordForm.surePwd"
          type="password"
          autocomplete="false"
          maxlength="20"
          class="form-item-input"
          placeholder="请再次输入新密码"
          @focus="errMsg.surePwd = ''"
        />
      </div>
      <div class="error-msg" :class="{ 'error-msg-no': errMsg.surePwd === '' }" v-text="errMsg.surePwd"></div>
      <!-- 提交 -->
      <div class="operation-btns">
        <button class="operation-btn btn-submit" type="submit" form="adminSetForm">
          {{ waitInfo.revise }}
        </button>
        <button class="operation-btn btn-reset" type="reset" form="adminSetForm">重置</button>
      </div>
    </form>

    <!-- 数据库备份 -->
    <div class="db-copy">
      <h3>数据库备份</h3>
      <button class="db-copy-btn" :disabled="waitInfo.copy === '备份中...'" @click="startCopy">
        {{ waitInfo.copy }}
      </button>
      <button class="db-copy-btn" @click="download">
        下载到本地
        <iframe name="downloadIframe" style="display: none" />
      </button>
    </div>

    <!-- 提示框 -->
    <transition name="set-mask">
      <div v-show="adminSetMask.show" class="adminset-mask">
        <div class="adminset-mask-box">
          <h3>{{ adminSetMask.info }}</h3>
          <button @click="exit">确认</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { reviseKey, copyData } from '../../api/admin'

export default {
  data() {
    // 表单验证旧密码
    const validateOldPwd = (rule, value, callback) => {
      const reg = /^[0-9a-z]{6,16}$/gi
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('密码6-16位是数字或字母!'))
      }
    }
    // 表单验证新密码
    const validateNewPwd = (rule, value, callback) => {
      const reg = /^[0-9a-z]{6,16}$/gi
      if (reg.test(value)) {
        if (this.ruleForm.checkNewPassword !== '') {
          this.$refs.ruleForm.validateField('validateCheckPwd')
        }
        callback()
      } else {
        callback(new Error('密码6-16位是数字或字母!'))
      }
    }
    // 表单验证确认密码
    const validateCheckPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formLabelWidth: '120px', // label宽度
      ruleForm: {
        oldPassword: '', // 账号名称
        newPassword: '', //  密码
        checkNewPassword: '' // 确认密码
      }, // 表单
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { validator: validateOldPwd, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validateNewPwd, trigger: 'blur' }
        ],
        checkNewPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validateCheckPwd, trigger: 'blur' }
        ]
      }, // 表单验证规则
      submitted: false,
      // ================================================================
      passwordForm: {
        oldPwd: '',
        newPwd: '',
        surePwd: ''
      }, // 表单用到的数据
      errMsg: { oldPwd: '', newPwd: '', surePwd: '' }, // 错误信息
      waitInfo: { revise: '确认修改', copy: '备份' }, // 状态信息
      adminSetMask: { show: false, info: '' }, // 显示提示框和信息
      showDownload: false // 显示download
    }
  },
  beforeRouteEnter(to, from, next) {
    document.title = '后台管理 -账户设置'
    next()
  },
  // watch: {
  //   passwordForm: {
  //     handler(val) {
  //       console.log(val)
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        // 验证通过
        if (valid) {
          this.submitted = true
          const { oldPassword, newPassword } = this.ruleForm
          reviseKey(oldPassword, newPassword).then((res) => {
            console.log(res)
            if (res.code === 200) {
              this.$alert('密码修改成功，请重新登陆！', '提示', {
                confirmButtonText: '确定',
                callback: () => {
                  this.exit()
                }
              })
            } else {
              this.$alert(res.msg, '提示', {
                type: 'warning',
                confirmButtonText: '确定'
              })
            }
            this.submitted = false
          })
          setTimeout(() => {
            this.submitted = false
          }, 3000)
        } else {
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 重新登陆
    exit() {
      this.adminSetMask.show = false
      // 删除本地保存的数据
      localStorage.removeItem('validateToken')
      localStorage.removeItem('userName')
      localStorage.removeItem('lastLogin')
      // 跳转到登陆页面
      this.$router.push({ name: 'login' })
    },
    // 开始拷贝
    startCopy() {
      this.waitInfo.copy = '备份中...'
      copyData().then((res) => {
        if (res.code === 200) {
          this.waitInfo.copy = '备份'
          this.adminSetMask = { show: true, info: '备份成功！' }
          this.showDownload = true
        } else {
          this.adminSetMask = { show: true, info: '备份失败！' }
        }
      })
    },
    // 下载
    download() {
      const a = document.createElement('a')
      const token = localStorage.getItem('validateToken')
      a.href = 'http://localhost:8098/api/downloadDb?authToken=' + token
      a.download = 'admin.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    // ===========================================
    // 提交表单
    handleSubmit() {
      this.errMsg = { oldPwd: '', newPwd: '', surePwd: '' }
      if (this.passwordForm.oldPwd.length === 0) {
        this.errMsg.oldPwd = '请填写旧密码'
        return
      } else if (this.passwordForm.newPwd.length === 0) {
        this.errMsg.newPwd = '请填写新密码'
        return
      } else if (this.passwordForm.surePwd.length === 0) {
        this.errMsg.surePwd = '请再次输入新密码'
        return
      } else if (this.passwordForm.surePwd !== this.passwordForm.newPwd) {
        this.errMsg.surePwd = '两次输入的密码不一致'
        return
      } else {
        this.waitInfo.revise = '修改中...'
        reviseKey(this.passwordForm.oldPwd, this.passwordForm.newPwd).then((res) => {
          if (res.code === 200) {
            this.waitInfo.revise = '确认修改'
            this.passwordForm = { oldPwd: '', newPwd: '', surePwd: '' }
            this.adminSetMask = { show: true, info: '修改成功,请重新登陆！' }
          } else {
            this.errMsg.oldPwd = '原密码不正确'
            this.waitInfo.revise = '确认修改'
          }
        })
      }
    },
    // 重置表单
    handleReset() {
      this.passwordForm = { oldPwd: '', newPwd: '', surePwd: '' }
      this.errMsg = { oldPwd: '', newPwd: '', surePwd: '' }
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-set {
  color: black;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .admin-set-form {
    padding: 10px;
    .form-item {
      display: flex;
      align-items: center;
      .form-item-label {
        width: 80px;
        font-size: 16px;
      }
      .form-item-input {
        font-size: 16px;
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #dcdfe6;
        &:focus {
          border: 1px solid #46b8da;
          outline: #46b8da;
        }
      }
    }
    .error-msg {
      height: 30px;
      color: red;
      padding: 5px;
      font-size: 16px;
      text-align: start;
      padding-left: 80px;
    }
    .error-msg-no {
      visibility: hidden;
    }
    .operation-btns {
      // border: solid red 1px;
      display: flex;
      justify-content: space-evenly;
      .operation-btn {
        // width: 80px;
        font-size: 16px;
        padding: 5px 20px;
        border-radius: 5px;
        outline: none;
        border: none;
        background-color: #409eff;
        color: #fff;
        cursor: pointer;
      }
      .btn-reset {
        background-color: #95989d;
      }
    }
  }
  .db-copy {
    // border: solid red 1px;
    .db-copy-btn {
      background: #409eff;
      border: 1px solid #409eff;
      border-radius: 5px;
      padding: 5px 10px;
      margin: 10px;
      font-size: 16px;
      color: #ffffff;
      cursor: pointer;
      outline: none;
    }
    .db-copy-btn:hover {
      opacity: 0.9;
    }
    .db-copy-btn[disabled] {
      // cursor: wait;
      cursor: not-allowed;
    }
  }
}

.adminset-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.5);
  button {
    padding: 5px 10px;
    border-radius: 4px;
    background: #67c23a;
    border: 1px solid #67c23a;
    color: #ffffff;
    cursor: pointer;
    margin-top: 38px;
  }
  button:hover {
    opacity: 0.9;
  }
  .adminset-mask-box {
    background: #ffffff;
    width: 25%;
    border-radius: 5px;
    margin: 150px auto;
    padding: 15px;
    text-align: center;
    h3 {
      margin-top: 60px;
    }
  }
}

@media screen and(max-width: 767px) {
  .input-warning-box {
    width: 80%;
    flex-shrink: 1;
  }
  .adminset-mask-box {
    width: 80%;
  }
}
</style>
