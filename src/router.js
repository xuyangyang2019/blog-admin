import Vue from "vue";
import Router from "vue-router";

// 正常加载
import Home from "./views/Home.vue";

// 按需（懒）加载（vue实现）推荐
// 没有指定webpackChunkName,每个组件打包成一个js文件
// const Login = () => import( /* webpackChunkName: "login" */ './views/Login.vue')

// vue异步组件技术
// 一个组件生成一个js文件
// const Login = resolve => require(["@/views/Login"], resolve)

// 按需（懒）加载（webpack动态导入）不推荐
// const Login = resolve => { require.ensure([], () => { resolve(require('./views/Login.vue')) }, 'login') }

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      meta: { requireAuth: true }
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/Login.vue")
    }
  ]
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 如果要去的路由 需要验证
  if (to.matched.some(res => res.meta.requireAuth)) {
    if (localStorage.getItem("validate-info-tk")) {
      next();
    } else {
      next({
        path: "/login"
        // query: { redirect: to.fullPath }
      });
    }
  } else {
    next();
  }
});

// 全局解析守卫
router.beforeResolve((to, from, next) => {
  // console.log('全局解析守卫 beforeResolve ')
  // console.log(from.path)
  // console.log(to.path)
  next();
});

// 全局后置钩子
// router.afterEach((to, from) => {
//     console.log('router.afterEach')
//     console.log(to)
//     console.log(from)
// })

router.onError(e => {
  console.log(e);
});

export default router;
