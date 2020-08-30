import {
	imServerStore
} from '../../store/imServerStore.js';
import {
	mapMutations,
	mapGetters
} from 'vuex';
import {
	publicmethod
} from '../../utils/publicmethod.js';
import $ from 'jquery';
export default {
	name: "chartList",
	data() {
		return {
			chartListexample: [{
					title: '正在沟通',
					index: '0',
					list: []
				},
				{
					title: '已结束',
					index: '1',
					list: []
				},
			],
			selectvlaue: '',
			uerlist: [],
			selecticon: false,
			visible: false,
			uerlistloading: false,
			userlistmsg: '',
		}
	},
	created() {},
	mounted() {
		publicmethod.backlogin(this) ? this.init() : null;
	},
	computed: {
		...mapGetters('serverModule', ['openuserchart']),
		chartList() {
			return imServerStore.state.chartList;
		},
		indexs() {
			return imServerStore.state.indexs;
		}
	},
	methods: {
		...mapMutations('serverModule', {
			set_someObj: 'SET_SOMEOBJ',
			SETLOAD: 'SETLOAD',
			SETOPENSUERCHART: 'SETOPENSUERCHART',
		}),
		//组件初始化方法
		init: function() {
			this.getchartlsitdata();
			let _that = this;
			//监听DOM中的点击事件
			$('div').each(function() {
				$(this).click(function() {
					if (_that.visible) {
						_that.visible = false;
						_that.selectvlaue = '';
						_that.selecticon = false;
					}
				})
			})
		},
		//选择聊天会话方法
		choiceChart(index) {
			let No = index.split('-');
			imServerStore.dispatch('changechartList', index);
			this.set_someObj(imServerStore.state.chartList[No[0]].list[No[2]]);
		},
		//表情解析方法
		analysis: function(text) {
			return publicmethod.expression(text, this);
		},
		//聊天会话数据回显处理
		getchartlsitdata: function() {
			this.SETLOAD(true);
			let isLeave;
			if (this.$route.path == '/index/chart') {
				isLeave = 0;
			} else if (this.$route.path == '/index/leaveword') {
				isLeave = 1;
			}
			var _that = this;
			let obj = {};
			this.$api.server.getchartlsit(isLeave).then(res => {
				this.chartListexample[0].list = [];
				this.chartListexample[1].list = [];
				if (res.status == 10000) {
					res.data.forEach(function(value, index) {
						value.sendTime = publicmethod.chartlsithandle(value.sendTime);
						/*消息数量 */
						value.messageaccount = 0;
						//未读消息回显处理
						if (value.timer != 0) {
							let handletime = parseInt(value.timer / 60);
							let handletimes = parseInt(value.timer % 60);
							let Minutes = handletime < 10 ? '0' + handletime : handletime;
							let seconds = handletimes < 10 ? '0' + handletimes : handletimes;
							value.time = Minutes + ' 分 ' + seconds + ' 秒 ';
						} else {
							value.time = '00 分 00 秒';
							value.timer = 0;
						}
						if (value.chatStatus <= 2) {
							value.selected = false;
							_that.chartListexample[0].list.push(value);
						} else {
							value.selected = false;
							_that.chartListexample[1].list.push(value);
						}
					})
					imServerStore.dispatch('chartList', _that.chartListexample);
					imServerStore.dispatch('startcounting');
					this.$nextTick(() => {
						this.SETLOAD(false);
						if (this.openuserchart != null) {
							let index = imServerStore.getters.getchartList(this.openuserchart);
							if (index != false) {
								let No = index.split('-');
								imServerStore.dispatch('changechartList', index);
								this.set_someObj(imServerStore.state.chartList[No[0]].list[No[2]]);
							} else {
								this.set_someObj(null);
							}
						}
					});

				} else {
					this.SETLOAD(false);
					if (res.status == 30000) {
						this.$message.error(res.message);
					} else {
						this.$message.error('未能接收到规定的Josn返回格式!');
					}
				}
			})

		},

		/* -搜索客户- */
		querySearchAsync: function() {
			this.visible = true;
			this.uerlist = [];
			if (this.selectvlaue == '') {
				this.$message.warning('请输入查询的客户信息!');
				return;
			}
			this.uerlistloading = true;
			this.userlistmsg = '';
			this.$api.server.queryUserInforByRemark(this.selectvlaue).then(res => {
				if (res.status == 10000) {
					if (res.data.userList != undefined) {
						this.uerlistloading = false;
						this.uerlist = res.data.userList;
					} else {
						this.$message('没有您查询的客户!');
						this.userlistmsg = '没有您查询的客户!';
					}
				} else {
					if (res.status == 30000) {
						this.$message.error(res.message);
					} else {
						this.$message.error('未能接收到规定的Josn返回格式!');
					}
					this.userlistmsg = '查询客户信息失败,请重试!';
				}
			})
		},
		//选中收索到的客户
		handleSelect(item) {
			this.selectvlaue = '';
			this.selecticon = false;
			let obj = item;
			let ifhaslsit = imServerStore.getters.getchartList(obj.userId);
			if (ifhaslsit == false) {
				this.set_someObj(obj);
				let objs = JSON.stringify(obj);
				imServerStore.dispatch('addchartList', JSON.parse(objs));
				let index;
				if (obj.chatStatus >= 3) {
					index = '1-' + obj.chatId + '-0';
				} else {
					index = '0-' + obj.chatId + '-0';
				}
				imServerStore.dispatch('changechartList', index);
			} else {
				let objs = JSON.stringify(obj);
				this.set_someObj(JSON.parse(objs));
				imServerStore.dispatch('changechartList', ifhaslsit);
			}
		},
		//开启/关闭搜索图标
		selectchange: function() {
			if (this.selectvlaue == '') {
				this.selecticon = false;
				this.visible = false;
			} else {
				this.selecticon = true;
			}
		},
		/* -搜索客户- */
	},
	//监听 openuserchart 数据的变化 打开聊天信息框 
	watch: {
		openuserchart: function(news, olds) {
			if (news != olds && news != null) {
				let index = imServerStore.getters.getchartList(this.openuserchart);
				if (index != false) {
					let No = index.split('-');
					imServerStore.dispatch('changechartList', index);
					this.set_someObj(imServerStore.state.chartList[No[0]].list[No[2]]);
				} else {
					this.set_someObj(null);
				}
			}

		}
	}
}
