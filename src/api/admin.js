/**
 * http后端接口
 * xuyangyang
 * 2021-1
 */

import fetch from '@/utils/fetch'
// import { generateTaskId } from '@/utils/util'

/**
 * 管理员登陆
 * @param {string} username 用户名
 * @param {string} password 密码
 */
function adminLogin(username, password) {
  return fetch.post('/api/login', { username: username, password: password })
}

/**
 * 分页获取文章列表
 * @param {number} pageNum 第几页
 * @param {number} pageSize 每页的文章数量
 * @param {number} publish 是否发表 1发表 0未发表
 * @param {string} tag 文章标签
 */
function getArticleList(pageNum, pageSize, publish, tag) {
  return fetch.get('/api/getArticleList', { pageNum: pageNum, pageSize: pageSize, publish: publish, tag: tag })
}

// 获取对应模块的文章总数，为分页按钮个数提供支持
// GetArticlesCount({ commit }, payload) {
//   return fetch.get("/api/getCount", payload).then((data) => {
//     commit("PAGE_ARRAY", data)
//   })
// },

/**
 * 获取留言
 * @param {number} pageNum 第几页
 * @param {number} pageSize 每页的文章数量
 */
function getMsgBoard(pageNum, pageSize) {
  return fetch.get('/api/getMsgBoard', { pageNum: pageNum, pageSize: pageSize })
}

// // 获取留言数量
// GetMsgCount({ commit }) {
//   return fetch.get('/api/getMsgCount').then((res) => {
//     commit('PAGE_ARRAY', res.data.count || 0)
//   })
// },

/**
 * 获取评论列表
 * @param {number} pageNum 第几页
 * @param {number} pageSize 每页的文章数量
 */
function getCommentsList(pageNum, pageSize) {
  return fetch.get('/api/getCommentsList', { pageNum: pageNum, pageSize: pageSize })
}

// 获取评论数
// GetCommentsCount({ commit }) {
//   return fetch.get("/api/getCommentsCount").then((data) => {
//     commit("PAGE_ARRAY", data)
//   })
// },

// =============================================================

/**
 * 修改密码
 * @param {string} oldKey 老的密码
 * @param {string} newKey 新的密码
 */
function reviseKey(oldKey, newKey) {
  return fetch.patch('/api/reviseKey', { oldKey: oldKey, newKey: newKey })
}

/**
 * 拷贝数据
 */
function copyData() {
  return fetch.get('/api/copyData')
}

/**
 * 下载数据库 用不到的接口
 */
function downloadDb() {
  return fetch.get('/api/downloadDb')
}

export { adminLogin, getArticleList, getMsgBoard, getCommentsList, reviseKey, copyData, downloadDb }
