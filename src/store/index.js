import Vue from "vue"
import Vuex from "vuex"
import modules from "./modules"

// import { uploadFile } from "@/api/upload";

// state
const state = {
  toPath: "/admin",
  tagsObj: {},
  redSup: { c: false, m: false, l: false, p: false },
  forLocation: []
}

// getters
const getters = {
  toPath: state => state.toPath,
  tagsObj: state => state.tagsObj,
  redSup: state => state.redSup,
  forLocation: state => state.forLocation
}

// actions
const actions = {
  // 文件上传
  // UploadFile({ commit }, formData) {
  //   return new Promise((resolve, reject) => {
  //     uploadFile(formData)
  //       .then(response => {
  //         let data = response.data.data;
  //         resolve(data);
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // }
}

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
  strict: process.env.NODE_ENV !== "production"
})
