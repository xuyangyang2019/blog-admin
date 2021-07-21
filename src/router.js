import Vue from 'vue'
import Router from 'vue-router'

// 正常加载
import Admin from './views/Admin.vue'

import { getUserInfo } from './api/admin'
import store from './store'

// 按需（懒）加载（vue实现）推荐
// 没有指定webpackChunkName,每个组件打包成一个js文件
// const Login = () => import( /* webpackChunkName: "login" */ './views/Login.vue')

// vue异步组件技术
// 一个组件生成一个js文件
// const Login = resolve => require(["@/views/Login"], resolve)

// 按需（懒）加载（webpack动态导入）不推荐
// const Login = resolve => { require.ensure([], () => { resolve(require('./views/Login.vue')) }, 'login') }

// 后台管理界面
// const eachTag = (resolve) => require(['@/components/common/EachTag'], resolve)

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      redirect: '/admin/allArticles',
      meta: {
        requireAuth: true,
        keepAlive: true
      },
      children: [
        // 已发表文章
        {
          path: 'allArticles',
          name: 'allArticles',
          component: () => import(/* webpackChunkName: "admin" */ './components/admin/ArticlesPublished.vue'),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 指定标签的 已发表的文章
        {
          path: 'allArticles/:tag',
          name: 'eachTag',
          component: () => import(/* webpackChunkName: "admin" */ './components/common/EachTag.vue'),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 文章预览
        {
          path: 'review/:eTag/:articleId',
          name: 'review',
          component: () => import(/* webpackChunkName: "admin" */ './components/common/ReviewArticle.vue'),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 草稿箱
        {
          path: 'draft',
          name: 'draft',
          // component: draft,
          component: () => import(/* webpackChunkName: "admin" */ './components/admin/ArticlesDrafts.vue'),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 留言板
        {
          path: 'msgBoard',
          name: 'adminMsgBoard',
          component: () => import(/* webpackChunkName: "admin" */ './components/admin/AdminMsgBoard.vue'),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 文章评论
        {
          path: 'comments',
          name: 'comments',
          component: () => import(/* webpackChunkName: "admin" */ './components/admin/AdminComments.vue'),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 新消息
        {
          path: 'newMsg',
          name: 'newMsg',
          // component: newMsg,
          component: () => import(/* webpackChunkName: "admin" */ './components/admin/AdminNewMsg.vue'),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 账户设置
        {
          path: 'adminSet',
          name: 'adminSet',
          component: () => import(/* webpackChunkName: "admin" */ './components/admin/AdminSet.vue'),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        {
          path: '/admin/search/:base',
          name: 'search',
          component: () => import(/* webpackChunkName: "admin" */ './components/admin/search/Search.vue'),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        }
      ]
    },
    // 发表文章
    {
      path: '/admin/qe',
      name: 'qe',
      component: () => import(/* webpackChunkName: "admin" */ './components/admin/PublishArticle.vue'),
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/admin/md',
      name: 'md',
      component: () => import(/* webpackChunkName: "admin" */ './components/admin/PublishArticle.vue'),
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/admin/publish',
      name: 'publish',
      component: () => import(/* webpackChunkName: "admin" */ './components/ue/InitEditor.vue'),
      meta: {
        requireAuth: true
      }
    },
    // 草稿修改
    {
      path: '/admin/draftrevise',
      name: 'draftrevise',
      component: () => import(/* webpackChunkName: "admin" */ './components/ue/InitEditor.vue'),
      meta: {
        requireAuth: true
      }
    },
    // 更新文章
    {
      path: '/admin/update/:articleId',
      name: 'update',
      component: () => import(/* webpackChunkName: "admin" */ './components/ue/InitEditor.vue'),
      meta: {
        requireAuth: true
      }
    },
    // 登陆页面
    {
      path: '/admin/login',
      name: 'adminLogin',
      component: () => import(/* webpackChunkName: "admin" */ './views/Login.vue')
    },
    // 其他
    {
      path: '/admin/*',
      name: 'miss',
      component: () => import(/* webpackChunkName: "admin" */ '@/components/base/MissPage.vue')
    }
  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 如果要去的路由 需要验证
  if (to.matched.some((res) => res.meta.requireAuth)) {
    const token = localStorage.getItem('validateToken')
    if (token) {
      // 获取用户信息
      getUserInfo().then((res) => {
        if (res.code === 200) {
          store.commit('admin/SET_USER_INFO', res.data)
          next() // resolve 钩子
        }
      })
    } else {
      next({
        path: '/admin/login'
        // query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

// 全局解析守卫
router.beforeResolve((to, from, next) => {
  // console.log('全局解析守卫 beforeResolve ')
  // console.log(from.path)
  // console.log(to.path)
  next()
})

// 全局后置钩子
// router.afterEach((to, from) => {
//     console.log('router.afterEach')
//     console.log(to)
//     console.log(from)
// })

router.onError((e) => {
  console.log(e)
})

export default router
