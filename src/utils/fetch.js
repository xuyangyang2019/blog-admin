/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */

// 序列化
const qs = require("qs")
// 引入axios
const axios = require("axios")
// 引入路由
import router from "../router"

// // 引入vuex
// import store from "../store"
// 有赞开源的ui
// import { Toast } from "vant"
/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
// const tip = (msg) => {
//   Toast({
//     message: msg,
//     duration: 1000,
//     forbidClick: true
//   })
// }

// /**
//  * 跳转登录页
//  * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
//  */
// const toLogin = () => {
//   router.replace({
//     path: "/login",
//     query: {
//       redirect: router.currentRoute.fullPath
//     }
//   })
// }

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      // toLogin()
      console.error("未登录状态，跳转登录页")
      break
    // 403 token过期
    case 403:
      // 清除token并跳转登录页
      // tip("登录过期，请重新登录")
      // localStorage.removeItem("token")
      // store.commit("loginSuccess", null)
      // setTimeout(() => {
      //   toLogin()
      // }, 1000)
      console.error("token过期")
      break
    // 404请求不存在
    case 404:
      // tip("请求的资源不存在")
      console.log("请求不存在")
      break
    default:
      console.log("未处理的错误码")
  }
}

// 配置方法的优先级是 axios请求配置 > axios实例配置 > axios全局配置

// axios全局配置
// axios.defaults.后边跟的就是axios的那些配置
// 一般修改的全局配置，也就下边这两个
// axios.defaults.timeout = 1000
// axios.defaults.baseURL = 'http://localhost:8080'
// 设置post请求头
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded; charset=UTF-8"

// 创建axios实例
// 如果需要访问多个服务地址，而这些服务请求和响应的结构也可能都完全不同
// 那么你可以通过axios.create创建不同的实例来处理。
const httpInstance = axios.create({
  // url: "/data.json", // 请求的路径
  // baseURL: "http://localhost:8080", // 请求的域名，基本地址
  timeout: 5000, // 请求的超时时长，单位毫秒
  method: "get,post,put,patch,delete", // 请求方法
  withCredentials: true, // 跨域
  params: {}, // 请求参数拼接在URL上
  data: {} // 请求参数放在请求体里
})
// // 设置post请求头
// httpInstance.defaults.headers.post["Content-Type"] =
//   "application/x-www-form-urlencoded; charset=UTF-8"

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
httpInstance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // if (process.env.NODE_ENV === "development") {
    //   config.url = `http://${location.host}` + config.url // 自定义反向代理
    // }
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    const token = localStorage.getItem("validateToken")
    token && (config.headers.Authorization = token)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器，后端验证token失败后跳转到登录界面
httpInstance.interceptors.response.use(
  (response) => {
    console.log("响应拦截器-请求成功", response)
    // // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // // 否则的话抛出错误
    // if (response.status === 200) {
    //   return Promise.resolve(response.data)
    // } else {
    //   return Promise.reject(response)
    // }
    // // 如果返回401
    // if (res.data.code && res.data.code === 401) {
    //   if (router.currentRoute.path !== "/login") {
    //     router.push({ name: "login" })
    //   }
    // }
    return response.data
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  (error) => {
    console.log("响应拦截器-请求失败", error)
    // if (error) {
    //   // 请求已发出，但是不在2xx的范围
    //   // errorHandle(error.status, error.data.message)
    //   // return Promise.reject(error)
    // } else {
    //   // 处理断网的情况
    //   // eg:请求超时或断网时，更新state的network状态
    //   // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
    //   // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
    //   // store.commit("changeNetwork", false)
    // }
    return Promise.reject(error)
  }
)

function apiAxios(method, url, params) {
  return new Promise((resolve, reject) => {
    httpInstance({
      url: url,
      method: method,
      // baseURL: "http://localhost:8080", // 开发模式下vue-cli已经配置了请求转发，所以不用基础路径即可
      params: method === "GET" || method === "DELETE" ? params : null,
      paramsSerializer: (params) => {
        return qs.stringify(params, { indices: false })
      },
      data:
        method !== "GET" && method !== "DELETE" ? qs.stringify(params) : null
      // data: method === "POST" || method === "PUT" ? params : null,
    })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export default {
  get: function(url, params) {
    return apiAxios("GET", url, params)
  },
  post: function(url, params) {
    return apiAxios("POST", url, params)
  },
  put: function(url, params) {
    return apiAxios("PUT", url, params)
  },
  patch: function(url, params) {
    return apiAxios("PATCH", url, params)
  },
  delete: function(url, params) {
    return apiAxios("DELETE", url, params)
  }
}
