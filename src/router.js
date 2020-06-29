import Vue from "vue"
import Router from "vue-router"

// 正常加载
import Admin from "./views/Admin.vue"

// 按需（懒）加载（vue实现）推荐
// 没有指定webpackChunkName,每个组件打包成一个js文件
// const Login = () => import( /* webpackChunkName: "login" */ './views/Login.vue')

// vue异步组件技术
// 一个组件生成一个js文件
// const Login = resolve => require(["@/views/Login"], resolve)

// 按需（懒）加载（webpack动态导入）不推荐
// const Login = resolve => { require.ensure([], () => { resolve(require('./views/Login.vue')) }, 'login') }

//后台管理界面
const miss = resolve => require(["@/components/base/miss"], resolve)
const allArticles = resolve => require(["@/components/article/allArticles"], resolve)
const eachTag = resolve => require(["@/components/article/eachTag"], resolve)
const review = resolve => require(["@/components/article/review"], resolve)
const search = resolve => require(["@/components/search/search"], resolve)
// const initEditor = (resolve) =>
//   require(["@/components/ue/initEditor"], resolve);

// const draft = resolve => require(["@/components/article/draft"], resolve)
// const adminMsgBoard = resolve => require(["@/components/msgboard/adminMsgBoard"], resolve)
// const comments = resolve => require(["@/components/comment/comments"], resolve)
// const newMsg = resolve => require(["@/components/news/newMsg"], resolve)
// const adminSet = resolve => require(["@/components/adminSet/adminSet"], resolve)

Vue.use(Router)

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
      // redirect: "/admin/allArticles",
      meta: {
        requireAuth: true,
        keepAlive: true
      },
      children: [
        {
          path: "allArticles",
          name: "allArticles",
          component: allArticles,
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        {
          path: "allArticles/:tag",
          name: "eachTag",
          component: eachTag,
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        {
          path: "review/:eTag/:articleId",
          name: "review",
          component: review,
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 草稿箱
        {
          path: "draft",
          name: "draft",
          // component: draft,
          component: () => import(/* webpackChunkName: "admin" */ "./components/article/Draft.vue"),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 留言板
        {
          path: "msgBoard",
          name: "adminMsgBoard",
          component: () => import(/* webpackChunkName: "admin" */ "./components/msgboard/AdminMsgBoard.vue"),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 文章评论
        {
          path: "comments",
          name: "comments",
          component: () => import(/* webpackChunkName: "admin" */ "./components/comment/Comments.vue"),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 新消息
        {
          path: "newMsg",
          name: "newMsg",
          // component: newMsg,
          component: () => import(/* webpackChunkName: "admin" */ "./components/news/NewMsg.vue"),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        // 账户设置
        {
          path: "adminSet",
          name: "adminSet",
          component: () => import(/* webpackChunkName: "admin" */ "./components/adminSet/AdminSet.vue"),
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        {
          path: "/admin/search/:base",
          name: "search",
          component: search,
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        }
      ]
    },
    //操作文章的路由
    // {
    //   path: "/admin/publish",
    //   name: "publish",
    //   component: initEditor,
    //   meta: {
    //     requireAuth: true
    //   }
    // },
    // {
    //   path: "/admin/draftrevise",
    //   name: "draftrevise",
    //   component: initEditor,
    //   meta: {
    //     requireAuth: true
    //   }
    // },
    // {
    //   path: "/admin/update",
    //   name: "update",
    //   component: initEditor,
    //   meta: {
    //     requireAuth: true
    //   }
    // },
    {
      path: "/login",
      name: "login",
      component: () => import(/* webpackChunkName: "admin" */ "./views/Login.vue")
    },
    {
      path: "/*",
      name: "miss",
      component: miss
    }
  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 如果要去的路由 需要验证
  if (to.matched.some(res => res.meta.requireAuth)) {
    if (localStorage.getItem("validateToken")) {
      next()
    } else {
      next({
        path: "/login"
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

router.onError(e => {
  console.log(e)
})

export default router
