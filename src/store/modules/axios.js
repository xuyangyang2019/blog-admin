// import Vue from "vue";
import fetch from "@/utils/fetch";

// initial state
const state = {
  //   wechats: [] // 当前用户绑定的微信
};

// getters
const getters = {
  wechats: state => state.wechats
};

// actions
const actions = {
  // 登陆
  // eslint-disable-next-line no-unused-vars
  Login({ commit, state }, payload) {
    console.log("登陆");
    console.log(payload);
    return fetch.post("/api/login", payload);
  }
};

// mutations
const mutations = {
  SET_WECHATS: (state, wechats) => {
    state.wechats = wechats;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
