<template>
  <div class="admin-set">
    <h3>发表文章</h3>
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
      waitInfo: { revise: "确认修改", copy: "备份" }, // 状态信息
      adminSetMask: { show: false, info: "" }, // 显示提示框和信息
      showDownload: false // 显示download
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
      console.log("开始拷贝")
      this.waitInfo.copy = "备份中..."
      this.copyData().then(data => {
        if (data.code === 200) {
          this.waitInfo.copy = "备份"
          this.adminSetMask = { show: true, info: "备份成功！" }
          this.showDownload = true
        } else {
          this.adminSetMask = { show: true, info: "备份失败！" }
        }
      })
    },
    // 下载
    download() {
      console.log("下载")
      // this.downloadDb()
      // let a = document.createElement("a")
      // let token = localStorage.getItem("map_blog_token_info_item_name")
      // a.href = "http://localhost: 8080/api/downloadDb?authToken=" + token
      // a.href = "https://www.mapblog.cn/api/downloadDb?authToken=" + token
      // a.click()
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
