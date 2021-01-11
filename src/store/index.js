import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

// state
const state = {
  toPath: '/admin'
}

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  // 设置token
  SET_TOKEN: (state, token) => {
    state.token = token
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  state,
  getters,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
