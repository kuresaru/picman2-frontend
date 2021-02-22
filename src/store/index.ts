import Vue from 'vue'
import Vuex from 'vuex'
import { AxiosInstance } from 'axios'

Vue.use(Vuex)

const ax: AxiosInstance = (<any>window).axios;

export default new Vuex.Store({
  state: {
    user: null as Picman.UserDetail | null,
    loaded: false as boolean,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      state.loaded = true;
    }
  },
  actions: {
    updateUser(context) {
      ax
        .get("/api/my")
        .then(resp => {
          context.commit('setUser', resp.data.data);
        })
        .catch(err => {
          context.commit('setUser', null);
        });
    },
    checkUser(context) {
      if (!context.getters.loaded) {
        context.dispatch('updateUser');
      }
    }
  },
  getters: {
    nickname: state => {
      if (state.user) {
        return state.user.sacUserPrincipal.nickname;
      }
      return undefined;
    },
    loggedIn: state => {
      return state.loaded && (!!state.user);
    },
    notLogin: state => {
      return state.loaded && (!state.user);
    }
  },
  modules: {
  }
})
