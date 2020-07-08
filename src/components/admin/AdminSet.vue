<template>
  <div class="admin-set">
    <h3>修改密码</h3>
    <!-- 表单 -->
    <form
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
          type="password"
          autocomplete="false"
          maxlength="20"
          class="form-item-input"
          placeholder="请输入原密码"
          v-model.trim.lazy="passwordForm.oldPwd"
          @focus="errMsg.oldPwd = ''"
        />
      </div>
      <div class="error-msg" :class="{ 'error-msg-no': errMsg.oldPwd === '' }" v-text="errMsg.oldPwd"></div>
      <!-- 新密码 -->
      <div class="form-item">
        <label class="form-item-label" for="newPwd">新密码</label>
        <input
          id="newPwd"
          type="password"
          autocomplete="false"
          maxlength="20"
          class="form-item-input"
          placeholder="请输入新密码"
          v-model.trim.lazy="passwordForm.newPwd"
          @focus="errMsg.newPwd = ''"
        />
      </div>
      <div class="error-msg" :class="{ 'error-msg-no': errMsg.newPwd === '' }" v-text="errMsg.newPwd"></div>
      <!-- 确认密码 -->
      <div class="form-item">
        <label class="form-item-label" for="surePwd">新密码</label>
        <input
          id="surePwd"
          type="password"
          autocomplete="false"
          maxlength="20"
          class="form-item-input"
          placeholder="请再次输入新密码"
          v-model.trim.lazy="passwordForm.surePwd"
          @focus="errMsg.surePwd = ''"
        />
      </div>
      <div class="error-msg" :class="{ 'error-msg-no': errMsg.surePwd === '' }" v-text="errMsg.surePwd"></div>

      <!-- 提交 -->
      <div class="operation-btns">
        <button class="operation-btn btn-submit" type="submit" form="adminSetForm">{{ waitInfo.revise }}</button>
        <button class="operation-btn btn-reset" type="reset" form="adminSetForm">重置</button>
      </div>
    </form>
    <!-- 数据库备份 -->
    <!-- <div class="db-copy">
      <h3>数据库备份</h3>
      <button @click="startCopy" :disabled="waitInfo.copy === '备份中...'">{{ waitInfo.copy }}</button>
      <a href="javascript: void(0)" @click="download" v-show="showDownload">下载到本地</a>
    </div>-->

    <!-- 提示框 -->
    <transition name="set-mask">
      <div class="adminset-mask" v-show="adminSetMask.show">
        <div class="adminset-mask-box">
          <h3>{{ adminSetMask.info }}</h3>
          <button @click="adminSetMask.show = false">确认</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  data() {
    return {
      passwordForm: {
        oldPwd: "",
        newPwd: "",
        surePwd: ""
      }, // 表单用到的数据
      errMsg: { oldPwd: "", newPwd: "", surePwd: "" }, // 错误信息
      waitInfo: { revise: "确认修改", copy: "备份" },
      adminSetMask: { show: false, info: "" },
      showDownload: false
    }
  },
  beforeRouteEnter(to, from, next) {
    document.title = "后台管理 -账户设置"
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
    ...mapActions({
      reviseKey: "axios/ReviseKey",
      copyData: "axios/CopyData",
      downloadDb: "axios/DownloadDb"
    }),
    // 提交表单
    handleSubmit() {
      this.errMsg = { oldPwd: "", newPwd: "", surePwd: "" }
      if (this.passwordForm.oldPwd.length === 0) {
        this.errMsg.oldPwd = "请填写旧密码"
        return
      } else if (this.passwordForm.newPwd.length === 0) {
        this.errMsg.newPwd = "请填写新密码"
        return
      } else if (this.passwordForm.surePwd.length === 0) {
        this.errMsg.surePwd = "请再次输入新密码"
        return
      } else if (this.passwordForm.surePwd !== this.passwordForm.newPwd) {
        this.errMsg.surePwd = "两次输入的密码不一致"
        return
      } else {
        this.waitInfo.revise = "修改中..."
        this.reviseKey({
          oldKey: this.passwordForm.oldPwd,
          newKey: this.passwordForm.newPwd
        }).then(data => {
          if (data.code === 200) {
            // console.log("修改成功")
            this.waitInfo.revise = "确认修改"
            this.passwordForm = { oldPwd: "", newPwd: "", surePwd: "" }
            this.adminSetMask = { show: true, info: "修改成功！" }
          } else if (data.code === "oldkey-401") {
            this.errMsg.oldPwd = "原密码不正确"
            this.waitInfo.revise = "确认修改"
          }
        })
      }
    },
    // 重置表单
    handleReset() {
      this.passwordForm = { oldPwd: "", newPwd: "", surePwd: "" }
      this.errMsg = { oldPwd: "", newPwd: "", surePwd: "" }
    },
    // 开始拷贝
    startCopy() {
      let that = this
      this.waitInfo.copy = "备份中..."
      this.copyData().then(data => {
        if (data.code === 200) {
          that.waitInfo.copy = "备份"
          that.adminSetMask = { show: true, info: "备份成功！" }
          that.showDownload = true
        } else {
          that.adminSetMask = { show: true, info: "备份失败！" }
        }
      })
    },
    // 下载
    download() {
      // this.downloadDb()
      let a = document.createElement("a")
      let token = localStorage.getItem("map_blog_token_info_item_name")
      // a.href = "http://localhost: 8080/api/downloadDb?authToken=" + token
      a.href = "https://www.mapblog.cn/api/downloadDb?authToken=" + token
      a.click()
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
}

.submit-adminset {
  button {
    position: absolute;
    right: 0;
    top: 60px;
    padding: 5px 10px;
    border-radius: 4px;
    background: #5bc0de;
    border: 1px solid #5bc0de;
    color: #ffffff;
    cursor: pointer;
  }
  button:hover {
    opacity: 0.9;
  }
  button[disabled] {
    cursor: wait;
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
.db-copy {
  margin-top: 80px;
  text-align: center;
  a {
    text-decoration: none;
    color: #67c23a;
  }
  a:hover {
    text-decoration: underline;
  }
  button {
    margin-top: 50px;
    width: 25%;
    background: #409eff;
    border: 1px solid #409eff;
    border-radius: 5px;
    padding: 10px;
    color: #ffffff;
    cursor: pointer;
    outline: none;
  }
  button:hover {
    opacity: 0.9;
  }
  button[disabled] {
    cursor: wait;
  }
}
.set-mask-enter,
.set-mask-leave-to {
  opacity: 0;
}
.set-mask-enter-active,
.set-mask-leave-active {
  transition: all ease 0.5s;
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
