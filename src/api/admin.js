/**
 * http后端接口
 * xuyangyang
 * 2021-1
 */

import fetch from '@/utils/fetch'
// import { generateTaskId } from '@/utils/util'

// ========================== 账户相关===================================

/**
 * 管理员登陆
 * @param {String} username 用户名
 * @param {String} password 密码
 */
function adminLogin(username, password) {
  return fetch.post('/api/login', { username: username, password: password })
}

/**
 * 修改密码
 * @param {String} oldKey 老的密码
 * @param {String} newKey 新的密码
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

// ========================== 文章相关===================================

/**
 * 分页获取文章列表
 * @param {Number} pageNum 第几页
 * @param {Number} pageSize 每页的文章数量
 * @param {Number} publish 是否发表 1发表 0未发表
 * @param {String} tag 文章标签
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

// // 搜索文章
// SearchAdminArticles({ commit }, payload) {
//   fetch.get('/api/adminSearch', payload).then((data) => {
//     console.log(data)
//     commit('SET_ARTICLES_SEARCH', data)
//   })
// },

// // 删除文章
// RemoveArticle({ commit }, payload) {
//   return fetch.delete('/api/deleteArticle', payload)
// },

// // 精准获取文章
// GetArticle({ commit }, payload) {
//   return fetch.get('/api/getAdminArticle', payload).then((data) => {
//     if (data.length) {
//       commit('SET_ARTICLES_ONLY', data)
//       const _tag = data[0].tag[0]
//       let forLocation = []
//       if (data[0].publish) {
//         forLocation = [
//           { pathName: 'allArticles', showName: '已发表文章' },
//           { pathName: 'eachTag', showName: _tag, params: { tag: _tag } },
//           {
//             pathName: 'review',
//             showName: data[0].title,
//             params: { eTag: _tag, articleId: data[0].articleId }
//           }
//         ]
//       } else {
//         forLocation = [
//           { pathName: 'draft', showName: '草稿' },
//           {
//             pathName: 'review',
//             showName: data[0].title,
//             params: { eTag: _tag, articleId: data[0].articleId }
//           }
//         ]
//       }
//       commit('SET_FOR_LOCATION', forLocation)
//     }
//     return data
//   })
// },

/**
 * 确认token
 */
function confirmToken() {
  return fetch.get('/api/confirmToken')
}

// // 发表或保存文章
// SaveArticle({ commit }, payload) {
//   return fetch.post('/api/saveArticle', payload)
// },

// // 更新文章
// UpdateArticle({ commit }, payload) {
//   return fetch.patch('/api/updata', payload)
// }

// ========================== 留言相关===================================

/**
 * 获取留言
 * @param {Number} pageNum 第几页
 * @param {Number} pageSize 每页的文章数量
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
 * 回复留言
 * @param {String} id 留言id
 * @param {String} name 管理员名称
 * @param {String} aite 要@的人
 * @param {String} imgUrl 头像
 * @param {String} content 回复内容
 * @param {Date} data 日期
 */
function replyMsgBoard(id, name, aite, imgUrl, content, date) {
  return fetch.patch('/api/replyMsgBoard', {
    id: id,
    name: name,
    aite: aite,
    imgUrl: imgUrl,
    content: content,
    date: date
  })
}

/**
 * 删除留言
 * @param {Array} ids 要删除的留言的id的集合
 */
function deleteMsgBoards(ids) {
  return fetch.delete('/api/deleteMsgBoards', { ids: ids })
}

/**
 * 删除二级留言
 * @param {String} msgId 留言的id
 * @param {String} replyId 要删除的reply的id
 */
function updateMsgBoard(msgId, replyId) {
  return fetch.patch('/api/updateMsgBoard', { msgId: msgId, replyId: replyId })
}

// ========================== 评论相关===================================

/**
 * 获取评论列表
 * @param {Number} pageNum 第几页
 * @param {Number} pageSize 每页的文章数量
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

// // 添加评论
// AddCommentsReply({ commit }, payload) {
//   return fetch.patch('/api/addComment', payload)
// },

// // 移除评论
// RemoveComments({ commit }, payload) {
//   return fetch.delete('/api/removeComments', payload)
// },

// // 减少评论
// ReduceComments({ commit }, payload) {
//   return fetch.patch('/api/reduceComments', payload)
// },

// ========================== 消息相关===================================

/**
 * 获取新消息
 */
function getNews() {
  return fetch.get('/api/getNews')
}

/**
 * 获取技术文章的tag 生成导航
 * @param {Boolean} publish 已发布的文章标签
 */
function getTags(publish) {
  return fetch.get('/api/tags', { publish: publish })
}

export {
  adminLogin,
  reviseKey,
  copyData,
  downloadDb,
  getArticleList,
  getMsgBoard,
  replyMsgBoard,
  deleteMsgBoards,
  updateMsgBoard,
  getCommentsList,
  confirmToken,
  getNews,
  getTags
}
