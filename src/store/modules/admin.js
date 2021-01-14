import Vue from 'vue'

// initial state
const state = {
  allArticles: [], // 所有的文章
  draftsArticles: [], // 草稿箱
  pageArray: [], // 已发表页码数组
  msgBoard: [], // 留言板
  comments: [], // 评论
  // =============================================
  tagsObj: {}, // 标签
  // 红点提示
  redSup: {
    c: false, // 评论
    m: false, // 留言
    l: false, // 点赞
    p: false // 点击
  },
  forLocation: [], // 不知道有什么用
  // 消息
  news: {
    pvNum: 0, // 点击数
    comment: [], // 评论
    msgboard: [], // 留言板
    like: [], // 点赞
    pv: [] // 点击
  },
  // 文章列表
  articles: {
    all: [], // 所有文章
    drafts: [], // 草稿箱
    tags: [], // 标签
    search: [], // 搜索结果
    only: [] // 要预览的文章
  }
}

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  // 设置所有的文章列表
  SET_ALL_ARTICLES(state, data) {
    state.allArticles = data
  },
  // 设置草稿箱
  SET_DRAFTS_ARTICLES(state, data) {
    state.draftsArticles = data
  },
  // 设置留言版信息
  SET_MSG_BOARD(state, msgBoardData) {
    state.msgBoard = msgBoardData
  },
  // 设置评论
  SET_COMMENTS(state, commentsData) {
    state.comments = commentsData
  },
  // 分页
  SET_PAGE_ARRAY(state, payload) {
    // 默认size为10
    const count = Math.ceil(payload / 10)
    const arr = []
    for (let i = 1; i < count + 1; i++) {
      arr.push(i)
    }
    state.pageArray = arr
  },
  // =======================================
  // 处理新消息
  HANDLE_NEWS(state, data) {
    // 从编辑器回退到管理主页，清除先前获取到的数据
    state.news = { pvNum: 0, comment: [], msgboard: [], like: [], pv: [] }
    state.news.pvNum = data.pvNum
    data.newsArr.forEach((item) => {
      switch (item.type) {
        case 'comment':
          state.news.comment.push(item)
          state.redSup.c = true
          break
        case 'msgboard':
          state.news.msgboard.push(item)
          state.redSup.m = true
          break
        case 'like':
          state.news.like.push(item)
          state.redSup.l = true
          break
        case 'pv':
          state.news.pv.push(item)
          state.redSup.p = true
          break
      }
    })
  },
  // 设置标签
  SET_TAGS(state, tags) {
    state.tagsObj = tags
  },
  // 设置文章
  SET_ARTICLES(state, dataObj) {
    const payload = dataObj.payload
    const data = dataObj.data
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
  SET_ARTICLES_SEARCH(state, data) {
    state.articles.search = data
  },
  // 减少数据
  REDUCE_ARR(state, payload) {
    // 删除指定index的文章
    if (payload.name === 'allArticles') {
      state.articles.all.splice(payload.index, 1)
    }
    if (payload.name === 'eachTag') {
      state.articles.tags.splice(payload.index, 1)
    }
    if (payload.name === 'draft') {
      state.articles.drafts.splice(payload.index, 1)
    }
    // 删除留言
    if (payload.name === 'adminMsgBoard') {
      // 删除一级留言
      if (payload.oneIndex !== -1 && payload.twoIndex === -1) {
        state.msgBoard.splice(payload.oneIndex, 1)
        // 删除二级留言
      } else {
        state.msgBoard[payload.oneIndex].reply.splice(payload.twoIndex, 1)
      }
    }
    // 删除评论
    if (payload.name === 'comments') {
      if (payload.oneIndex !== -1 && payload.twoIndex === -1) {
        // 删除一级评论
        state.comments.splice(payload.oneIndex, 1)
      } else {
        // 删除二级评论
        state.comments[payload.oneIndex].reply.splice(payload.twoIndex, 1)
      }
    }
  },
  // 减少数据 all
  REDUCE_ARR_ALL(state, payload) {
    // 删除多篇文章
    if (payload.name === 'allArticles') {
      state.articles.all = state.articles.all.filter((item) => {
        return payload.removeArr.indexOf(item.articleId) < 0
      })
    }
    if (payload.name === 'eachTag') {
      state.articles.tags = state.articles.tags.filter((item) => {
        return payload.removeArr.indexOf(item.articleId) < 0
      })
    }
    if (payload.name === 'draft') {
      state.articles.drafts = state.articles.drafts.filter((item) => {
        return payload.removeArr.indexOf(item.articleId) < 0
      })
    }
    if (payload.name === 'adminMsgBoard') {
      state.msgBoard = state.msgBoard.filter((item) => {
        return payload.removeArr.indexOf(item._id) < 0
      })
    }
    if (payload.name === 'comments') {
      state.comments = state.comments.filter((item) => {
        return payload.removeArr.indexOf(item._id) < 0
      })
    }
  },
  ADD_LOCAL_WORD(state, add) {
    state.msgBoard.forEach((item, index) => {
      if (item._id === add._id) {
        state.msgBoard.splice(index, 1, add)
        return
      }
    })
  },
  ADD_LOCAL_COMMENT(state, add) {
    state.comments.forEach((item, index) => {
      if (item._id === add._id) {
        state.comments.splice(index, 1, add)
        return
      }
    })
  },
  ClearOnly(state) {
    state.articles.only = []
    state.forLocation = []
  },
  SET_ARTICLES_ONLY(state, oa) {
    // state.articles.only = oa
    Vue.set(state.articles, 'only', oa)
  },
  SET_FOR_LOCATION(state, fl) {
    state.forLocation = fl
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
