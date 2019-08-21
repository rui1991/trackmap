import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  userId: '',
  firmData: [],
  firmCoord: '105.403119,38.028658',
  filialeData: [],
  filialeCoord: '105.403119,38.028658',
  projectData: [],
  projectCoord: '105.403119,38.028658',
  projectLevel: 12,
  projects: [],
  companyId: '',
  proId: 0,
  proName: '',
  proCoord: '105.403119,38.028658'
}

const getters = {

}

const mutations = {
  // 保存用户基本信息
  saveUserInfo (state, num) {
    state.userId = num
  },
  // 保存企业当前数据
  saveFirmData (state, arr) {
    state.firmData = arr
  },
  // 保存企业中心坐标
  saveFirmCoord (state, str) {
    state.firmCoord = str
  },
  // 保存分公司当前数据
  saveFilialeData (state, arr) {
    state.filialeData = arr
  },
  // 保存分公司中心坐标
  saveFilialeCoord (state, str) {
    state.filialeCoord = str
  },
  // 保存项目当前数据
  saveProjectData (state, arr) {
    state.projectData = arr
  },
  // 保存项目中心坐标
  saveProjectCoord (state, obj) {
    state.projectCoord = obj.coord
    state.projectLevel = obj.level
  },
  // 保存项目范围
  saveProScope (state, arr) {
    state.projects = arr
  },
  // 保存当前项目
  saveNowPro (state, obj) {
    state.proId = obj.id
    state.proName = obj.name
    state.companyId = obj.comId
    state.proCoord = obj.coord
  }
}

const actions = {
  setUserInfo ({ commit }, value) {
    commit('saveUserInfo', value)
  },
  // 企业
  setFirmData ({ commit }, value) {
    commit('saveFirmData', value)
  },
  setFirmCoord ({ commit }, value) {
    commit('saveFirmCoord', value)
  },
  // 分公司
  setFilialeData ({ commit }, value) {
    commit('saveFilialeData', value)
  },
  setFilialeCoord ({ commit }, value) {
    commit('saveFilialeCoord', value)
  },
  // 项目
  setProjectData ({ commit }, value) {
    commit('saveProjectData', value)
  },
  setProjectCoord ({ commit }, value) {
    commit('saveProjectCoord', value)
  },
  // 项目范围
  setProScope ({ commit }, value) {
    commit('saveProScope', value)
  },
  // 当前项目
  setNowPro ({ commit }, value) {
    commit('saveNowPro', value)
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export default store
