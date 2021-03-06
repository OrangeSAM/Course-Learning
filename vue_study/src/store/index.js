import Vue from 'vue'
import Vuex from './sam-store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    add(state) {
      state.count++
    }
  },
  actions: {
    add({commit}) {
      setTimeout(() => {
        commit('add')
      }, 500)
    }
  },
  getters: {
    doubleCounter: state => {
      return state.count * 2;
    },
  },
  modules: {
  }
})
