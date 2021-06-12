import Vue from 'vue'
import Vuex from 'vuex'
import serverModule from './modules/serverModule'
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex)


export default new Vuex.Store({
    modules: {
        serverModule,
    },
	plugins: [
	    createPersistedState({
	      storage: window.sessionStorage,
	    })
	  ]
})