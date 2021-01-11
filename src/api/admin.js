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
  return fetch.post('/api/adminLogin', { username: username, password: password })
}

export { adminLogin }
