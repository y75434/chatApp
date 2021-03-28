import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  currentUser: 'lin'
}

const mutations = {}

const actions = {}

const getters = {
  currentUser: state => state.currentUser
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default store
