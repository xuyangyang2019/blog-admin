import Vue from "vue";
import Router from "vue-router";
import store from "./store";

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
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      // route level code-splitting
      // this generates a separate chunk (login.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/Login.vue")
    }
  ]
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // console.log('全局前置守卫:router.beforeEach')
  // console.log(from.path)
  // console.log(to.path)
  const token = store.getters.token;
  if (token) {
    // console.log('有token', token)
    if (to.path == "/login") {
      next("/conversation");
    } else {
      next();
    }
  } else {
    // console.log('没有token 跳转到登陆页面')
    if (to.path == "/login") {
      //如果是登录页面路径，就直接next()
      next();
    } else {
      //不然就跳转到登录；
      next("/login");
    }
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
