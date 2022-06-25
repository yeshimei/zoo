import { set } from 'lodash'
import { createStore } from 'vuex'

export default createStore({
  state() {
    return {}
  },
  getters: {},
  mutations: {
    saveGameData(state, data) {
      Object.assign(state, data)
    },
    set(state, [key, value]) {
      set(state, key, value)
    }
  }
})
