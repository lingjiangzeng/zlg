"use strict";
import Vue from 'vue';
import App from './App';
import router from './router.config';
import Router from 'vue-router'
import store from './store'
// 全局挂载api
import api from 'api';
Vue.prototype.$api = api

// 路由跳转同个的时候
const originalPush = Router.prototype.replace
Router.prototype.replace = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}
Vue.config.productionTip = false;
/*全局引入挂载  element ui  */
import ElementUI from 'element-ui';
Vue.use(ElementUI);

import './public.less';
new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
});
