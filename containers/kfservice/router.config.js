import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
//路由表
const login = () =>
	import('./template/login/login.vue'); //登录页
const index = () =>
	import('./template/index/index.vue'); //首页
const Mobilechat = () =>
	import('./template/Mobilechat/Mobilechat.vue'); //Mobilechat
const chart = () =>
	import('./template/chart/chart.vue'); //聊天
const serviceRecord = () =>
	import('./template/serviceRecord/serviceRecord.vue'); //服务记录
const plogin = () =>
	import('./template/plogin/plogin.vue'); //移动端登录页
const allworkordermanagement = () =>
	import('./template/allworkordermanagement/allworkordermanagement.vue'); //全部工单
const Istarted = () =>
	import('./template/Istarted/Istarted.vue'); //创建的工单
const Idealwith = () =>
	import('./template/Idealwith/Idealwith.vue'); //我发起的工单
const Leave = () =>
	import('./template/Leave/Leave.vue'); //留言页面
const allqualitytest = () =>
	import('./template/allqualitytest/allqualitytest.vue'); //质检检测页面
const callenter = () =>
		import('./template/callenter/callenter.vue'); //呼叫中心
const callserverRecord = () =>
				import('./template/callserverRecord/callserverRecord.vue'); //呼叫记录
//基础路径
const basepath = '/h5/kfservice/';
const router = new Router({
	mode: 'history',
	base: basepath,
	//默认切换路由的时候滚动都在最顶部
	scrollBehavior(to, from, savedPosition) {
		return {
			x: 0,
			y: 0
		}
	},
	caseSensitive: true,
	routes: [
		//错误地址
		{
			path: '*',
			redirect: '/login'
		},
		//首页重定向
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			name: 'login',
			component: login
		},
		{
			path: '/index',
			name: 'index',
			component: index,
			children: [{
					name: 'chart',
					path: '/index/chart',
					component: chart
				},
				{
					name: 'serviceRecord',
					path: '/index/serviceRecord',
					component: serviceRecord
				},
				{
					name: 'allworkordermanagement',
					path: '/index/allworkordermanagement',
					component: allworkordermanagement
				},
				{
					name: 'Istarted',
					path: '/index/Istarted',
					component: Istarted
				},
				{
					name: 'Idealwith',
					path: '/index/Idealwith',
					component: Idealwith
				},
				{
					name: 'leaveword',
					path: '/index/leaveword',
					component: Leave
				},
				{
					name: 'allqualitytest',
					path: '/index/allqualitytest',
					component: allqualitytest
				},
				{
					name: 'callenter',
					path: '/index/callenter',
					component: callenter
				},
				{
					name: 'callserverRecord',
					path: '/index/callserverRecord',
					component: callserverRecord
				},
			]
		},
		{
			path: '/Mobilechat',
			name: 'Mobilechat',
			component: Mobilechat,
		},
		{
			path: '/plogin',
			name: 'plogin',
			component: plogin
		},
	]
});

router.beforeEach((to, from, next) => {
	const trackUrl = window.location.origin + basepath + to.path;
	if (typeof _czc != "undefined") {
		_czc.push(["_trackPageview", trackUrl]);
	}
	next();
});
export default router
