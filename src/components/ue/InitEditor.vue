<template>
  <div class="ue-box">
    <!-- 返回|退出 -->
    <div class="back-home">
      <i class="fa fa-home fa-2x" aria-hidden="true" title="回到管理首页" @click="backHome"></i>
      <span class="client-greet">{{ greet }}好，admin！</span>
      <span class="phone-greet">{{ greet }}好，admin！</span>
      <i class="fa fa-sign-out" aria-hidden="true" title="退出管理界面" @click="exit"></i>
    </div>
    <!-- UEditor -->
    <UE ref="ue" :config="config"></UE>
  </div>
</template>

<script>
import UE from './UEditor'
import { confirmToken } from '../../api/admin'

export default {
  components: {
    UE
  },
  data() {
    return {
      config: {
        initialFrameWidth: null, // ue默认宽
        initialFrameHeight: null, // ue默认高
        // ue工具栏
        toolbars: [
          [
            'source',
            '|',
            'undo',
            'redo',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            '|',
            'forecolor',
            'backcolor',
            'selectall',
            'removeformat',
            '|',
            'justifyleft',
            'justifycenter',
            'justifyright',
            'justifyjustify',
            '|',
            'lineheight',
            'insertorderedlist',
            'insertunorderedlist',
            'imagenone',
            'imageleft',
            'imageright',
            'imagecenter',
            '|',
            'simpleupload',
            'insertimage',
            'emotion',
            'customstyle',
            'paragraph',
            'fontfamily',
            'fontsize',
            '|',
            'link',
            'anchor',
            '|',
            'attachment',
            'insertcode',
            'horizontal',
            'spechars',
            '|',
            'searchreplace',
            'drafts'
          ]
        ]
      }
    }
  },
  computed: {
    // 问候语
    greet() {
      const hour = new Date().getHours()
      if (hour >= 0 && hour < 6) {
        return '凌晨'
      }
      if (hour >= 6 && hour < 11) {
        return '上午'
      }
      if (hour >= 11 && hour < 14) {
        return '中午'
      }
      if (hour >= 14 && hour < 18) {
        return '下午'
      }
      if (hour >= 18 && hour < 24) {
        return '晚上'
      }
      return ''
    }
  },
  created() {
    // 先鉴权
    confirmToken().then((res) => {
      if (res.code !== 200) {
        this.$alert('你没有权限到这个页面！', '提示', {
          confirmButtonText: '确定',
          callback: () => {
            this.$router.push({
              name: 'adminLogin'
            })
          }
        })
      }
    })
  },
  methods: {
    // 返回首页
    backHome() {
      this.$router.push({ name: 'admin' })
    },
    // 退出
    exit() {
      localStorage.removeItem('validateToken')
      this.$store.commit('admin/SET_USER_INFO', {})
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style lang="scss">
.ue-box {
  background: #195f88;
  height: 100%;
  display: flex;
  flex-direction: column;
  // overflow: hidden;

  .back-home {
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ccc;
    border-bottom: 1px solid #ccc;
    .fa {
      font-size: 26px;
      cursor: pointer;
    }
  }
}
</style>
