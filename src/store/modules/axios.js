// import Vue from "vue";
import fetch from "@/utils/fetch"

// initial state
const state = {
  tagsObj: {}, // 标签
  redSup: { c: false, m: false, l: false, p: false }, // 红点提示
  forLocation: [], // location
  news: { pvNum: 0, comment: [], msgboard: [], like: [], pv: [] },
  articles: { all: [], drafts: [], tags: [], search: [], only: [] }, // 文章列表
  pageArray: [], // 已发表页码数组
  msgBoard: [], // 留言板
  comments: [] // 评论
}

// getters
const getters = {
  tagsObj: state => state.tagsObj,
  redSup: state => state.redSup,
  forLocation: state => state.forLocation,
  news: state => state.news,
  articles: state => state.articles,
  pageArray: state => state.pageArray,
  msgBoard: state => state.msgBoard,
  comments: state => state.comments
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
  // 获取技术文章的tag生成导航
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
  },
  // 获取文章
  GetArticles({ commit, state }, payload) {
    let params = {}
    if (!payload.tag) {
      params = {
        publish: payload.publish,
        page: payload.page
      }
    } else {
      params = payload
    }
    return fetch.get("/api/getAdminArticles", params).then(data => {
      console.log(data)
      if (data.length) {
        if (!payload.tag) {
          if (payload.publish === true) {
            state.articles.all = data
          } else {
            state.articles.drafts = data
          }
        } else {
          state.articles.tags = data
        }
      }
      return data
    })
  },
  // 获取对应模块的文章总数，为分页按钮个数提供支持
  GetArticlesCount({ commit, state }, payload) {
    return fetch.get("/api/getCount", payload).then(data => {
      commit("PAGE_ARRAY", data)
      console.log(data)
    })
  },
  // 获取留言
  GetMsgBoard({ commit, state }, payload) {
    return fetch.get("/api/getAdminBoard", payload).then(data => {
      if (data.length) {
        state.msgBoard = data
      }
      return data
    })
  },
  // 获取留言数量
  GetMsgCount({ commit }, payload) {
    return fetch.get("/api/getMsgCount").then(data => {
      commit("PAGE_ARRAY", data)
    })
  },
  // 获取评论
  GetAdminComments({ commit, state }, payload) {
    return fetch.get("/api/getAdminComments", payload).then(data => {
      if (data.length) {
        state.comments = data
      }
      return data
    })
  },
  // 获取评论数
  GetCommentsCount({ commit, state }) {
    return fetch.get("/api/getCommentsCount").then(data => {
      commit("PAGE_ARRAY", data)
    })
  }
}

// mutations
const mutations = {
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
  },
  PAGE_ARRAY(state, payload) {
    let count = Math.ceil(payload / 10)
    let arr = []
    for (let i = 1; i < count + 1; i++) {
      arr.push(i)
    }
    state.pageArray = arr
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
