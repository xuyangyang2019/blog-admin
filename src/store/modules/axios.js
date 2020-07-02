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
    return fetch.post("/api/login", payload)
  },
  // 获取新消息
  GetNews({ commit }) {
    return fetch.get("/api/getNews").then(data => {
      if (data.newsArr && data.newsArr.length) {
        commit("HANDLE_NEWS", data)
      }
      return data
    })
  },
  // 获取技术文章的tag 生成导航
  GetTagsclass({ commit }, payload) {
    return fetch.get("/api/adminTags", { publish: payload.publish }).then(data => {
      if (data.tags && data.tags.length) {
        // data.tags.forEach((item, index, arr) => {
        //   if (item.tag === "life") {
        //     item.tag = "生活"
        //   }
        // })
        // state.tagsObj = data
        commit("SET_TAGS", data)
      }
      // return data
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
      // console.log(data)
      commit("SET_ARTICLES", { data: data, payload: payload })
      // return data
    })
  },
  // 获取对应模块的文章总数，为分页按钮个数提供支持
  GetArticlesCount({ commit, state }, payload) {
    return fetch.get("/api/getCount", payload).then(data => {
      commit("PAGE_ARRAY", data)
    })
  },
  // 删除文章
  RemoveArticle({ commit }, payload) {
    return fetch.delete("/api/deleteArticle", payload)
  },
  // 精准获取文章
  GetArticle({ commit, state }, payload) {
    return fetch.get("/api/getAdminArticle", payload).then(data => {
      if (data.length) {
        state.articles.only = data
        let _tag = data[0].tag[0]
        if (data[0].publish) {
          state.forLocation = [
            { pathName: "allArticles", showName: "已发表文章" },
            { pathName: "eachTag", showName: _tag, params: { tag: _tag } },
            { pathName: "review", showName: data[0].title, params: { eTag: _tag, articleId: data[0].articleId } }
          ]
        } else {
          state.forLocation = [
            { pathName: "draft", showName: "草稿" },
            { pathName: "review", showName: data[0].title, params: { eTag: _tag, articleId: data[0].articleId } }
          ]
        }
      }
      return data
    })
  },
  // ========================================================================
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
  // 处理新消息
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
  // 分页
  PAGE_ARRAY(state, payload) {
    let count = Math.ceil(payload / 10)
    let arr = []
    for (let i = 1; i < count + 1; i++) {
      arr.push(i)
    }
    state.pageArray = arr
  },
  // 设置标签
  SET_TAGS(state, tagsObj) {
    state.tagsObj = tagsObj
  },
  // 设置文章
  SET_ARTICLES(state, dataObj) {
    let payload = dataObj.payload
    let data = dataObj.data
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
  },
  // 减少数据
  REDUCE_ARR(state, payload) {
    // 删除指定index的文章
    if (payload.name === "allArticles") {
      state.articles.all.splice(payload.index, 1)
    }
    if (payload.name === "eachTag") {
      state.articles.tags.splice(payload.index, 1)
    }
    if (payload.name === "draft") {
      state.articles.drafts.splice(payload.index, 1)
    }
    //删除留言
    if (payload.name === "adminMsgBoard") {
      //删除一级留言
      if (payload.oneIndex !== -1 && payload.twoIndex === -1) {
        state.msgBoard.splice(payload.oneIndex, 1)
        //删除二级留言
      } else {
        state.msgBoard[payload.oneIndex].reply.splice(payload.twoIndex, 1)
      }
    }
    if (payload.name === "comments") {
      //删除一级留言
      if (payload.oneIndex !== -1 && payload.twoIndex === -1) {
        state.comments.splice(payload.oneIndex, 1)
        //删除二级留言
      } else {
        state.comments[payload.oneIndex].reply.splice(payload.twoIndex, 1)
      }
    }
  },
  // 减少数据 all
  REDUCE_ARR_ALL(state, payload) {
    // 删除多篇文章
    if (payload.name === "allArticles") {
      state.articles.all = state.articles.all.filter((item, index, arr) => {
        return payload.removeArr.indexOf(item.articleId) < 0
      })
    }
    if (payload.name === "eachTag") {
      state.articles.tags = state.articles.tags.filter((item, index, arr) => {
        return payload.removeArr.indexOf(item.articleId) < 0
      })
    }
    if (payload.name === "draft") {
      state.articles.drafts = state.articles.drafts.filter((item, index, arr) => {
        return payload.removeArr.indexOf(item.articleId) < 0
      })
    }
    if (payload.name === "adminMsgBoard") {
      state.msgBoard = state.msgBoard.filter((item, index, arr) => {
        return payload.removeArr.indexOf(item._id) < 0
      })
    }
    if (payload.name === "comments") {
      state.comments = state.comments.filter((item, index, arr) => {
        return payload.removeArr.indexOf(item._id) < 0
      })
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
