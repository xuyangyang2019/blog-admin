<template>
  <div class="admin-page">
    <!-- header -->
    <div class="admin-header">
      <div class="admin-header-left">
        <i class="fa fa-home fa-2x" aria-hidden="true" title="管理首页"></i>
        <span class="xyy-admin can-not-select">管理首页</span>
      </div>
      <!-- 手机上的问好 -->
      <span class="phone-greet">{{ greet }}好，{{ userInfo.nickname }}！</span>
      <!-- 管理员的信息 -->
      <div class="admin-info">
        <img src="../assets/images/logo.png" style="width: 20px; height: 20px; vertical-align: middle" alt="xyy" />
        <span>{{ greet }}好，{{ userInfo.nickname }}！上次登录是：{{ userInfo.lastLoginTime }}</span>
      </div>
      <!-- 面包屑导航 -->
      <div class="toggle-btn" @click="showList = !showList">
        <div class="btn-box">
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>
      </div>
    </div>
    <!-- main -->
    <div class="admin-body">
      <!-- aside -->
      <div ref="list" class="admin-aside">
        <ul class="aside-menu" @click="showListDelay">
          <!-- 发布文章 -->
          <li class="aside-item" @click="showPublishNav = !showPublishNav">
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            <span class="item-name">发布文章</span>
            <i class="fa fa-angle-right more-nav" :class="{ 'fa-angle-down': showPublishNav }" aria-hidden="true"></i>
          </li>
          <ul v-if="showPublishNav" class="child-navs">
            <li class="child-navs-item" @click="publishArticle('ue')">UEditor</li>
            <li class="child-navs-item" @click="publishArticle('md')">MarkDown</li>
            <li class="child-navs-item" @click="publishArticle('qe')">QuillEditor</li>
          </ul>
          <!-- menu -->
          <li
            v-for="(item, index) in menu"
            :key="index"
            class="aside-item"
            :class="{ 'current-item': $route.path === item.path }"
            @click="showPath(item)"
          >
            <i :class="item.icon" aria-hidden="true"></i>
            <sup v-if="index === 3 && (redSup.c || redSup.m || redSup.l || redSup.p)" class="red-sup"></sup>
            <span class="item-name" v-text="item.name"></span>
          </li>
          <!-- 退出 -->
          <li class="aside-item" @click="exit()">
            <i class="fa fa-sign-out" aria-hidden="true"></i>
            <span class="item-name">退出系统</span>
          </li>
        </ul>
      </div>

      <!-- content -->
      <div ref="content" class="admin-content">
        <!-- 子路由 -->
        <keep-alive v-if="$route.meta.keepAlive">
          <router-view />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      showList: false, // 面包屑导航
      showPublishNav: false, // 显示发表文章的子菜单
      menu: [
        {
          name: '首页',
          icon: 'fa fa-bell-o',
          path: '/newMsg'
        },
        {
          name: '已发表',
          icon: 'fa fa-book',
          path: '/allArticles'
        },
        {
          name: '草稿箱',
          icon: 'fa fa-dashboard',
          path: '/draft'
        },
        {
          name: '留言板',
          icon: 'fa fa-comments-o',
          path: '/msgBoard'
        },
        {
          name: '文章评论',
          icon: 'fa fa-commenting-o',
          path: '/comments'
        },
        {
          name: '账户设置',
          icon: 'fa fa-user',
          path: '/adminSet'
        }
      ]
    }
  },
  computed: {
    ...mapState('admin', {
      redSup: 'redSup', // 红点
      userInfo: 'userInfo' // 用户信息
    }),
    // 问候语
    greet() {
      const hour = new Date().getHours()
      if (hour >= 0 && hour < 6) {
        return '凌晨'
      } else if (hour >= 6 && hour < 11) {
        return '上午'
      } else if (hour >= 11 && hour < 14) {
        return '中午'
      } else if (hour >= 14 && hour < 18) {
        return '下午'
      } else if (hour >= 18 && hour < 24) {
        return '晚上'
      } else {
        return ''
      }
    }
  },
  // mounted() {
  //   // 添加监听事件
  //   window.addEventListener('resize', this.listen)
  // },
  methods: {
    // 退出登录
    exit() {
      // 删除本地保存的数据
      this.$confirm('即将退出登陆?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('validateToken')
          this.$store.commit('admin/SET_USER_INFO', {})
          // 跳转到登陆页面
          this.$router.push({ name: 'adminLogin' })
        })
        .catch(() => {})
    },
    // 路由跳转
    showPath(item) {
      if (this.$route.path === item.path) return
      if (item.path === '/publish') {
        window.open(item.path, '_blank')
      } else {
        this.$router.push({ path: item.path })
      }
    },
    // 发布文章路由 默认是富文本
    publishArticle(pModel) {
      switch (pModel) {
        case 'md':
          this.$toast({
            message: '敬请期待！',
            type: 'warning',
            duration: 2000
          })
          break
        case 'qe':
          this.$toast({
            message: 'qeqeqeqeqe',
            type: 'info',
            duration: 2000
          })
          this.$router.push({ path: '/qe' })
          // window.open(item.path, "_blank")
          break
        default:
          this.$router.push({ path: '/publish' })
          break
      }
    },
    // // 不管什么情况下都把list高度设为首屏高度
    // initHeight: function () {
    //   if (this.$route.name === 'publish') {
    //     return
    //   } else {
    //     if (document.body.clientWidth > 767) {
    //       this.$refs.list.style.minHeight = document.body.clientHeight - 55 + 'px'
    //     } else {
    //       this.$refs.list.style = ''
    //     }
    //   }
    // },
    // // 函数去抖，避免频繁触发拖垮浏览器
    // debounce(func, delay) {
    //   // eslint-disable-next-line consistent-this
    //   const context = this
    //   const args = arguments
    //   if (document.body.clientWidth < 768) {
    //     this.$refs.list.style = ''
    //   }
    //   if (this.timer) {
    //     clearTimeout(this.timer)
    //   }
    //   this.timer = setTimeout(function () {
    //     func.apply(context, args)
    //   }, delay)
    // },
    // listen() {
    //   this.debounce(this.initHeight, 500)
    // },
    showListDelay() {
      setTimeout(() => {
        this.showList = !this.showList
      }, 350)
    }
  },
  // 导航守卫 更新之前
  beforeRouteUpdate(to, from, next) {
    // this.analysisRoute(to)
    next()
  },
  // 导航守卫 离开路由则解绑事件
  beforeRouteLeave(to, from, next) {
    // window.removeEventListener('resize', this.listen)
    next()
  }
}
</script>

<style lang="scss" scoped>
.admin-page {
  font-size: 14px;
  font-family: Arial;
  height: 100%;
  display: flex;
  flex-direction: column;
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #195f88;
    height: 55px;
    min-height: 55px;
    overflow: hidden;
    .admin-header-left {
      margin-left: 10px;
      display: flex;
      align-items: center;
      .fa-home {
        margin-right: 8px;
      }
      .xyy-admin {
        font-weight: 600;
        font-size: 22px;
      }
    }
    .admin-info {
      margin-right: 20px;
      span {
        vertical-align: middle;
      }
    }
    .toggle-btn {
      display: none;
      cursor: pointer;
      float: right;
      padding: 4px;
      border: 1px solid #eee;
      border-radius: 5px;
      margin-right: 5px;
      .btn-box {
        .line {
          height: 2px;
          width: 26px;
          border-radius: 2px;
          background: #eee;
          margin: 4px;
        }
      }
    }
  }
  .admin-body {
    flex: 1 1 auto;
    display: flex;
    height: auto;
    overflow: hidden;
    .admin-aside {
      width: 250px;
      min-width: 250px;
      background: #1c2b36;
      transition: all ease 0.5s;
      .aside-menu {
        .aside-item {
          color: #ffffff;
          font-family: Arial;
          text-decoration: none;
          padding: 15px;
          display: flex;
          align-items: center;
          position: relative;
          cursor: pointer;
          .fa {
            width: 20px;
            font-size: 18px;
          }
          .item-name {
            width: 80px;
            font-size: 16px;
            text-align: start;
            margin-left: 10px;
          }
          .more-nav {
            position: absolute;
            right: 10px;
          }
          .red-sup {
            position: absolute;
            top: 15px;
            left: 35px;
            width: 6px;
            height: 6px;
            border-radius: 3px;
            background: red;
          }
          &:hover {
            background: #0f1215;
          }
        }
        .current-item {
          background: #4895fc;
          &:hover {
            background: #4895fc;
          }
        }

        .child-navs {
          margin-left: 38px;
          .child-navs-item {
            text-align: start;
            padding: 10px 5px;
            &:hover {
              background: #0f1215;
              cursor: pointer;
            }
          }
        }
      }
    }
    .admin-content {
      background: #fff;
      box-sizing: border-box;
      padding: 10px 10px;
      flex: 1 1 auto;
      overflow: hidden;
    }
  }
}

// 平板
@media screen and(min-width: 768px) {
  .phone-greet {
    display: none;
  }
}

// 手机端
@media screen and(max-width: 767px) {
  .admin-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    .xyy-admin {
      display: none;
    }
    .admin-info {
      display: none;
    }
    .toggle-btn {
      display: block !important;
    }
  }

  .location {
    display: none;
  }

  .admin-body {
    display: block;
    // margin-top: 55px;
  }
  .admin-content {
    width: 100%;
    padding: 5px;
  }
  // .admin-aside {
  //   position: fixed;
  //   overflow: hidden;
  //   top: 55px;
  //   left: 0;
  //   width: 100%;
  //   max-height: 0;
  //   z-index: 100;
  //   background: rgba(28, 43, 54, 0.9);
  // }
}
</style>
