import Vue from 'vue'
import Vuex from 'vuex'
import register from './modules/register'
import app from './modules/app'
import axios from '@/utils/axios'
import moment from 'moment'
import cart from './modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: null,
    userId: null,
    token: null,
    userType: null,
    firstName: null,
    lastName: null,
    timezone: null,
    userLetter: null,
    userAvatar: null
  },
  mutations: {
    setUsername(state, value) {
      state.username = value
    },
    setToken(state, token) {
      state.token = token
      Vue.ls.set('Access-Token', token, 7 * 24 * 60 * 60 * 1000)
    },
    setUserType(state, userType) {
      state.userType = userType
      Vue.ls.set('User-Type', userType, 7 * 24 * 60 * 60 * 1000)
    },
    setTimezone(state, timezone) {
      state.timezone = timezone
      Vue.ls.set('Timezone', timezone, 7 * 24 * 60 * 60 * 1000)
    },
    setUserAvatar(state, userAvatar) {
      state.userAvatar = userAvatar
    },
    setUserInfo(state, result) {
      state.firstName = result.firstName
      state.lastName = result.lastName
      state.userLetter = result.userLetter
      state.userId = result.userId
      Vue.ls.set('UserInfo', result, 7 * 24 * 60 * 60 * 1000)
    },
    removeUserInfo(state) {
      state.firstName = null
      state.lastName = null
      state.userLetter = null
      state.userId = null
      state.userAvatar = null
      Vue.ls.remove('UserInfo')
    }
  },
  actions: {
    setLoginResult: ({ commit, dispatch }, result) => {
      commit('setUsername', result.email)
      commit('setToken', result.token)
      commit('setUserType', result.userType)
      commit('setTimezone', result.timezone)
      commit('setUserAvatar', result.userAvatar)
      commit('setUserInfo', result)
      if (!result.timezone) {
        var timezone = moment.tz.guess();
        var offset = moment.tz(timezone).utcOffset();
        dispatch('updateTimezone', { timezone, utcOffset: offset })
      }
    },
    updateTimezone({ commit }, { timezone, utcOffset }) {
      axios
        .post('/api/user/profile/update', { timezone, utcOffset })
        .then(result => {
          if (result.success) {
            commit('setTimezone', timezone)
          }
        })
    },
    logout({ commit }) {
      commit('setUsername', null)
      commit('setToken', null)
      commit('setUserType', null)
      commit('setTimezone', null)
      commit('removeUserInfo')
    }
  },
  modules: {
    register,
    app,
    cart
  }
})
