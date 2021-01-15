<template>
  <div class="admin-page">
    <!-- header -->
    <div class="admin-header">
      <div class="admin-header-left">
        <i class="fa fa-home fa-2x" aria-hidden="true" title="管理首页"></i>
        <span class="xyy-admin can-not-select">管理首页</span>
      </div>
      <!-- 手机上的问好 -->
      <span class="phone-greet">{{ greet }}好，{{ userName }}！</span>
      <!-- 管理员的信息 -->
      <div class="admin-info">
        <img src="/img/logo.png" style="width: 20px; height: 20px; vertical-align: middle" alt="xyy" />
        <span>{{ greet }}好，{{ userName }}！上次登录是：{{ lastLogin }}</span>
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
        <!-- 搜索 -->
        <div v-if="$route.name === 'allArticles' || $route.name === 'draft'" class="location-search">
          <!-- 搜索框 -->
          <div class="search">
            <div v-show="choseType === 'key'" class="search-key">
              <input v-model="searchKey" type="text" placeholder="请输入关键词" @keyup.enter="searchArticle" />
            </div>
            <div v-show="choseType === 'time'" class="search-time">
              <input v-model="date.from" type="date" :class="{ 'err-border': err.from }" @focus="err.from = false" />
              至
              <input v-model="date.to" type="date" :class="{ 'err-border': err.to }" @focus="err.to = false" />
            </div>
            <select id v-model="choseType" name>
              <option value="key">关键字</option>
              <option value="time">时间</option>
            </select>
            <button @click="searchArticle">查询</button>
          </div>
        </div>

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
import { getTags } from '../api/admin'

export default {
  data() {
    return {
      lastLogin: localStorage.getItem('lastLogin') || 'My Lord', // 最近一次的登陆时间
      userName: localStorage.getItem('userName') || '', // 用户名
      // location: [], // 当前位置
      choseType: 'key', // 搜索类型
      searchKey: '', // 关键词
      date: { from: '', to: '' }, // 搜索时间
      err: { from: false, to: false }, // 错误信息
      showList: false, // 面包屑导航
      showPublishNav: false, // 显示发表文章的子菜单
      // showChildMenu: true, // 显示所有文章的子菜单
      menu: [
        {
          name: '首页',
          icon: 'fa fa-bell-o',
          path: '/admin/newMsg'
        },
        {
          name: '已发表',
          icon: 'fa fa-book',
          path: '/admin/allArticles'
        },
        {
          name: '草稿箱',
          icon: 'fa fa-dashboard',
          path: '/admin/draft'
        },
        {
          name: '留言板',
          icon: 'fa fa-comments-o',
          path: '/admin/msgBoard'
        },
        {
          name: '文章评论',
          icon: 'fa fa-commenting-o',
          path: '/admin/comments'
        },
        {
          name: '账户设置',
          icon: 'fa fa-user',
          path: '/admin/adminSet'
        }
      ]
    }
  },
  computed: {
    ...mapState('admin', {
      redSup: 'redSup', // 红点
      // tagsObj: "tagsObj", // 标签信息
      forLocation: 'forLocation'
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
  watch: {
    forLocation() {
      // if (this.forLocation.length) {
      //   this.location = this.forLocation
      // }
    }
  },
  created() {
    // 获取最新的标签
    getTags(true).then((res) => {
      console.log(res)
      // if (data.tags && data.tags.length) {
      //   commit('SET_TAGS', data)
      // }
    })
  },
  mounted() {
    // 添加监听事件
    window.addEventListener('resize', this.listen)
    // 初始话height
    // this.initHeight()
  },
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
          localStorage.removeItem('userName')
          localStorage.removeItem('lastLogin')
          // 跳转到登陆页面
          this.$router.push({ name: 'login' })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 路由跳转
    showPath(item) {
      // console.log(this.$route.path)
      if (this.$route.path === item.path) return
      if (item.path === '/admin/publish') {
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
          this.$router.push({ path: '/admin/qe' })
          // window.open(item.path, "_blank")
          break
        default:
          this.$router.push({ path: '/admin/publish' })
          break
      }
    },
    // 不管什么情况下都把list高度设为首屏高度
    initHeight: function () {
      if (this.$route.name === 'publish') {
        return
      } else {
        if (document.body.clientWidth > 767) {
          this.$refs.list.style.minHeight = document.body.clientHeight - 55 + 'px'
        } else {
          this.$refs.list.style = ''
        }
      }
    },
    // 函数去抖，避免频繁触发拖垮浏览器
    debounce(func, delay) {
      // eslint-disable-next-line consistent-this
      const context = this
      const args = arguments
      if (document.body.clientWidth < 768) {
        this.$refs.list.style = ''
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(function () {
        func.apply(context, args)
      }, delay)
    },
    listen() {
      this.debounce(this.initHeight, 500)
    },
    searchArticle() {
      if (this.choseType === 'key') {
        // 去除前后的空格
        this.searchKey = this.searchKey.replace(/(^\s*)|(\s*$)/g, '')
        if (this.searchKey.length) {
          this.$router.push({
            name: 'search',
            params: { base: this.searchKey }
          })
        }
      } else {
        if (!this.date.from) {
          this.err.from = true
        }
        if (!this.date.to) {
          this.err.to = true
          return
        }
        const date = this.date.from + 'to' + this.date.to
        this.$router.push({ name: 'search', params: { base: date } })
      }
    },
    showListDelay() {
      setTimeout(() => {
        this.showList = !this.showList
      }, 350)
    },
    // eslint-disable-next-line no-unused-vars
    analysisRoute: function (to, from) {
      const first = { pathName: 'allArticles', showName: '已发表文章' }
      let tag = to.params.tag
      switch (to.name) {
        case 'allArticles':
          this.location = [first]
          break
        case 'eachTag':
          if (tag === 'life') {
            tag = '生活'
          }
          this.location = [first, { pathName: 'eachTag', showName: tag, params: { tag: tag } }]
          break
        case 'review':
          this.location = this.forLocation

          break
        case 'draft':
          this.location = [{ pathName: 'draft', showName: '草稿箱' }]
          break
        case 'adminMsgBoard':
          this.location = [{ pathName: 'adminMsgBoard', showName: '留言板' }]
          break
        case 'comments':
          this.location = [{ pathName: 'comments', showName: '文章评论' }]
          break
        case 'newMsg':
          this.location = [{ pathName: 'newMsg', showName: '新消息' }]
          break
        case 'adminSet':
          this.location = [{ pathName: 'adminSet', showName: '账户设置' }]
          break
        case 'search':
          this.location = [{ pathName: 'search', showName: '搜索' }]
      }
    }
  },
  // 导航守卫 更新之前
  beforeRouteUpdate(to, from, next) {
    this.analysisRoute(to)
    next()
  },
  // 导航守卫 离开路由则解绑事件
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('resize', this.listen)
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
      .location-search {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 0;
        .location {
          display: flex;
        }
        .search {
          display: flex;
        }
      }
    }
  }
}

@media screen and(min-width: 768px) {
  .phone-greet {
    display: none;
  }
}

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
