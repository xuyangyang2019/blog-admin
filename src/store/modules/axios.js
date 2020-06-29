// import Vue from "vue";
import fetch from "@/utils/fetch"

// initial state
const state = {
  //   wechats: [] // 当前用户绑定的微信
}

// getters
const getters = {
  wechats: state => state.wechats
}

// actions
const actions = {
  // 登陆
  Login({ commit }, payload) {
    console.log("登陆")
    console.log(payload)
    return fetch.post("/api/login", payload)
  },
  // 获取通知
  GetNews({ commit }) {
    return fetch.get("/api/getNews").then(data => {
      if (data.newsArr && data.newsArr.length) {
        commit("HANDLE_NEWS", data)
      }
      return data
    })
  },
  //获取技术文章的tag生成导航
  GetTagsclass({ state }, payload) {
    return fetch.get("/api/adminTags", { publish: payload.publish }).then(data => {
      if (data.tags && data.tags.length) {
        data.tags.forEach((item, index, arr) => {
          if (item.tag === "life") {
            item.tag = "生活"
          }
        })
        state.tagsObj = data
      }
      return data
    })
  }
}

// mutations
const mutations = {
  SET_WECHATS: (state, wechats) => {
    state.wechats = wechats
  },
  HANDLE_NEWS(state, data) {
    //从编辑器回退到管理主页，清除先前获取到的数据
    state.news = { pvNum: 0, comment: [], msgboard: [], like: [], pv: [] }
    state.news.pvNum = data.pvNum
    data.newsArr.forEach((item, index, arr) => {
      switch (item.type) {
        case "comment":
          state.news.comment.push(item)
          state.redSup.c = true
          break
        case "msgboard":
          state.news.msgboard.push(item)
          state.redSup.m = true
          break
        case "like":
          state.news.like.push(item)
          state.redSup.l = true
          break
        case "pv":
          state.news.pv.push(item)
          state.redSup.p = true
          break
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
