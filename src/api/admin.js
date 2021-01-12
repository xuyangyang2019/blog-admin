/**
 * http后端接口
 * xuyangyang
 * 2021-1
 */

import fetch from '@/utils/fetch'
// import { generateTaskId } from '@/utils/util'

/* Common */
// export const queryUsers = data => Request.get('/api/products', data)

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

export { adminLogin, getArticleList }
