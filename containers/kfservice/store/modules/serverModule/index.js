import * as getters from './getters'
import state from './state'
import mutations from './mutations'
export default {
    namespaced: true, //使用命名空间
    getters,
    state,
    mutations,
}
