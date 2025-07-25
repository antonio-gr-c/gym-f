import { createStore } from 'vuex';

export default createStore({
  state: {
    token: null,
    id_usuario: null
  },
  mutations: {
    setAuth(state, { token, id_usuario }) {
      state.token = token;
      state.id_usuario = id_usuario;
    },
    clearAuth(state) {
      state.token = null;
      state.id_usuario = null;
    }
  },
  actions: {
    // Eliminado login/logout relacionados a API
    login({ commit }, { token = null, id_usuario = null }) {
      // Solo para pruebas: setea valores manualmente
      commit('setAuth', { token, id_usuario });
    },
    logout({ commit }) {
      commit('clearAuth');
    }
  },
  getters: {
    isAuthenticated: state => !!state.id_usuario,
    getToken: state => state.token,
    getUserId: state => state.id_usuario
  }
});
