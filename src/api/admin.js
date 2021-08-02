/**
 * http后端接口
 * xuyangyang
 * 2021-1
 */

import fetch from '@/utils/fetch'

// ========================== 账户相关===================================

/**
 * 管理员登陆
 * @param {String} username 用户名
 * @param {String} password 密码
 */
function adminLogin(username, password) {
  return fetch.post('/api/user/login', { username: username, password: password })
}

/**
 * 获取用户信息
 * @param { String } token token
 */
function getUserInfo() {
  return fetch.get('/api/user/info')
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
 * 确认token
 */
function confirmToken() {
  return fetch.get('/api/confirmToken')
}

/**
 * 按条件分页查询文章列表
 * @param {Number} pageNum 第几页
 * @param {Number} pageSize 每页的文章数量
 * @param {Boolean} publish 是否发表 true发表 false未发表
 * @param {String} tag 文章标签
 */
function getArticlesList(pageNum, pageSize, publish, tag) {
  return fetch.get('/api/admin/articles/list', { pageNum: pageNum, pageSize: pageSize, publish: publish, tag: tag })
}

/**
 * 获取对应模块的文章总数，为分页按钮个数提供支持
 * @param {Boolean} publish 是否发表
 * @param {String} tag 标签
 */
function getArticlesCount(publish, tag) {
  return fetch.get('/api/admin/articles/count', { publish: publish, tag: tag })
}

/**
 * 添加文章
 * @param {String} title 文章标题
 * @param {String} abstract 文章摘要
 * @param {String} content 文章内容
 * @param {Array} tag 标签
 * @param {Boolean} publish 是否发表
 * @param {Boolean} original 是否原创
 */
function addArticle(title, abstract, content, tag, publish, original) {
  const parameters = {
    title: title,
    abstract: abstract,
    content: content,
    tag: tag,
    publish: publish,
    original: original,
    pv: 0, // 点击数
    commentNum: 0, // 评论数
    likeNum: 0 // 点赞数
  }
  return fetch.post('/api/article', parameters)
}

/**
 * 删除文章
 * @param {Array} ids 要删除的文章的id的集合
 */
function deleteArticles(ids) {
  return fetch.delete('/api/articles', { ids: ids })
}

/**
 * 更新文章
 * @param {Number} articleId 文章id
 * @param {String} title 文章标题
 * @param {String} abstract 文章摘要
 * @param {String} content 文章内容
 * @param {Array} tag 标签
 * @param {Boolean} publish 是否发表
 * @param {Boolean} original 是否原创
 */
function updateArticle(articleId, title, abstract, content, tag, publish, original) {
  const parameters = {
    articleId: articleId,
    title: title,
    abstract: abstract,
    content: content,
    tag: tag,
    publish: publish,
    original: original
  }
  return fetch.patch('/api/article', parameters)
}

// // 搜索文章
// SearchAdminArticles({ commit }, payload) {
//   fetch.get('/api/adminSearch', payload).then((data) => {
//     console.log(data)
//     commit('SET_ARTICLES_SEARCH', data)
//   })
// },

/**
 * 精准获取文章
 * @param {Number} articleId 文章的id
 */
function getArticle(articleId) {
  return fetch.get('/api/admin/getArticle', { id: articleId })
}
// ========================== 留言相关===================================

/**
 * 获取留言
 * @param {Number} pageNum 第几页
 * @param {Number} pageSize 每页的文章数量
 */
function getMsgBoard(pageNum, pageSize) {
  return fetch.get('/api/admin/messages/list', { pageNum: pageNum, pageSize: pageSize })
}

/**
 * 获取留言数量
 */
function getMsgCount() {
  return fetch.get('/api/admin/messages/count')
}

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
  return fetch.get('/api/admin/comments/list', { pageNum: pageNum, pageSize: pageSize })
}

/**
 * 获取评论数量
 */
function getCommentsCount() {
  return fetch.get('/api/admin/comments/count')
}

/**
 * 删除文章的评论
 * @param {Array} ids 评论的_id
 */
function deleteComments(ids) {
  return fetch.delete('/api/deleteComments', { ids: ids })
}

/**
 * 回复评论
 * @param {String} commentId 评论id
 * @param {String} aite 要回复的人
 * @param {String} content 回复的内容
 */
function replyComment(commentId, aite, content) {
  const parameter = {
    id: commentId,
    aite: aite,
    content: content,
    name: 'admin（管理员）',
    imgUrl: '/img/logo.png',
    like: 0,
    date: new Date().getTime()
  }
  return fetch.patch('/api/replyComment', parameter)
}

/**
 * 删除二级评论
 * @param {String} commentId 评论id
 * @param {String} replyId 二级评论id
 */
function updateComment(commentId, replyId) {
  return fetch.patch('/api/updateComment', { commentId: commentId, replyId: replyId })
}

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
  getUserInfo,
  reviseKey,
  copyData,
  downloadDb,
  getArticlesList,
  getArticlesCount,
  addArticle,
  updateArticle,
  deleteArticles,
  getArticle,
  getMsgBoard,
  getMsgCount,
  replyMsgBoard,
  deleteMsgBoards,
  updateMsgBoard,
  getCommentsList,
  getCommentsCount,
  deleteComments,
  updateComment,
  replyComment,
  confirmToken,
  getNews,
  getTags
}
