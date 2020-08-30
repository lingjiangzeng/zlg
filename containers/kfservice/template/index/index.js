import hearder from '../../components/hearder/hearder.vue';
import silder from '../../components/silder/silder.vue';
import api from 'api/base';
import {
	imServerStore
} from '../../store/imServerStore.js';
import {
	publicmethod
} from '../../utils/publicmethod.js';
import {
	mapGetters,
	mapMutations,
} from 'vuex';
export default {
	components: {
		hearder,
		silder,
	},
	name: "index",
	data() {
		return {
			websockitobj: null,
			ifwebsockitobj: true,
			websockitsetInterval: null,
			overtimeInterval: null,
			myNotification: null,
			billNotification: null,
			position: {
				top: '80px',
				right: '24px',
			},
			callLitteWindowmove: false,
			offsetX: 0,
			offsetY: 0,
			internetspeed: '0',
			windowifonfocus: false,
			logobase: require('../../assets/Notificationlogo.png'),
			websokitloading: true,
		}
	},
	created() {},
	mounted() {
		publicmethod.backlogin(this) ? this.init() : null;

	},
	computed: {
		...mapGetters('serverModule', ['someObj', 'websockitsendmsg', 'userInfo', 'callwindow', 'windowsize', 'allloading'])
	},
	methods: {
		...mapMutations('serverModule', {
			set_someObj: 'SET_SOMEOBJ',
			SETZUINNEWS: 'SETZUINNEWS',
			SETCALLTIME: 'SETCALLTIME',
			COSLESETCALLTIME: 'COSLESETCALLTIME',
			SETWINDOWSIZE: 'SETWINDOWSIZE',
			SETPATH: 'SETPATH',
			SETLOAD: 'SETLOAD',
			SETOPENSUERCHART: 'SETOPENSUERCHART',
		}),
		init: function() {
			this.linkwebsockit();
			this.listenwindow();
			var _that = this;
			window.onbeforeunload = function() {
				_that.closewebsockit();
			};
		},
		linkwebsockit: function() {
			this.websokitloading = true;
			var _that = this;
			this.websockitobj = null;
			let srv;
			let type = 'pc';
			srv = api.test.replace('https', 'wss') + 'websocket/';
			this.websockitobj = new WebSocket(srv + '"kefuId":"' + this.userInfo.id + '","type":"' + type + '"');
			this.websockitobj.onopen = function(event) {};
			this.websockitobj.onmessage = function(msg) {
				_that.disposewebsockitmsg(msg);
			};
			this.websockitobj.onerror = function(e) {
				window.clearInterval(_that.websockitsetInterval);
				if (_that.ifwebsockitobj) {
					_that.ifwebsockitobj = false;
					_that.linkwebsockit();
					_that.overtime();

				}
			};
			this.websockitobj.onclose = function(e) {
				window.clearInterval(_that.websockitsetInterval);
				if (_that.ifwebsockitobj) {
					_that.ifwebsockitobj = false;
					_that.linkwebsockit();
					_that.overtime();
				}
			};
		},
		closewebsockit: function() {
			this.ifwebsockitobj = false;
			this.websockitobj.close();
		},
		overtime: function() {
			this.overtimeInterval = setTimeout(() => {
				this.websockitobj.close();
				setTimeout(() => {
					this.linkwebsockit();
					this.ifwebsockitobj = true;
				}, 2000)
			}, 1000 * 60)
		},
		disposewebsockitmsg: function(msg) {
			if (msg.data == 'success') {
				this.ifwebsockitobj = true;
				window.clearTimeout(this.overtimeInterval);
				this.websockitsetInterval = setInterval(() => {
					this.websockitobj.send(JSON.stringify({
						type: 'heart',
					}));
				}, 1000 * 60 * 10);
				this.websokitloading = false;
			} else {
				const data = JSON.parse(msg.data);
				if (data.type == 'pc') {
					this.SETZUINNEWS(data);
					if (data.wsType == 1) {} else if (data.wsType == 2) {
						imServerStore.dispatch('updataliststatus', data);
					} else if (data.wsType == 3) {
						let timehandle = data;
						timehandle.sendTime = publicmethod.chartlsithandle(timehandle.sendTime);
						imServerStore.dispatch('addchartList', timehandle);
						if (timehandle.senderType == 1) {
							this.sendwindowmsg(timehandle);
						}
					} else if (data.wsType == 6) {
						data.callTime = data.time;
						data.ifshow = 1;
						data.name = '';
						data.headImg = '';
						this.SETCALLTIME(data);
					} else if (data.wsType == 7) {
						data.callTime = data.time;
						data.ifshow = 2;
						data.chCallin = '';
						this.SETCALLTIME(data);

					} else if (data.wsType == 8) {
						this.COSLESETCALLTIME();
					} else if (data.wsType == 9) {
						this.showbillwindowmsg(data);
					}
				}
			};
		},
		sendwindowmsg: function(data) {
			let _that = this;
			if (this.windowifonfocus) {
				document.title = "您有新的消息";
				this.myNotification != null ? this.myNotification.close() : null;
				let msgcontent = data.contentType == 2 ? '[图片]' : data.content;
				this.myNotification = new window.Notification(data.senderName, {
					body: msgcontent,
					icon: data.senderImg,
					requireInteraction: true,
					tag: 'msg',
				});
				this.myNotification.onclick = function() {
					_that.SETOPENSUERCHART(data.userId);
					_that.SETPATH('chart');
					window.focus();

				}
			}
		},
		showbillwindowmsg: function(data) {
			let _that = this;
			this.billNotification != null ? this.billNotification.close() : null;
			this.billNotification = new window.Notification('您有工单需要处理', {
				body: data.msg,
				icon: _that.logobase,
				tag: 'bill',
				requireInteraction: true,
			});
			this.billNotification.onclick = function() {
				_that.SETPATH('Idealwith');
				window.focus();
			}
		},
		callLitteWindowdown: function(e) {
			e = window.event || e;
			e.preventDefault();
			this.callLitteWindowmove = true;
			this.offsetX = e.offsetX;
			this.offsetY = e.offsetY;
		},
		callLitteWindowup: function(e) {
			e.preventDefault();
			e = window.event || e;
			this.callLitteWindowmove = false;
		},
		callLitteWindowleave: function(e) {
			e.preventDefault();
			e = window.event || e;
			this.callLitteWindowmove = false;

		},
		movefun: function(e) {
			e.preventDefault();
			e = window.event || e;
			if (this.callLitteWindowmove) {
				this.position.top = (e.clientY - this.offsetY) + 'px';
				this.position.right = (window.innerWidth - e.clientX - (424 - this.offsetX)) + 'px';
			}

		},
		listenwindow: function() {
			this.SETWINDOWSIZE(window.innerWidth)
			let _that = this;
			let onlinemsg;
			window.onresize = function() {
				_that.SETWINDOWSIZE(window.innerWidth);
			}
			window.addEventListener('online', function() {
				onlinemsg.close();
				_that.linkwebsockit();
			});
			window.addEventListener('offline', function() {
				_that.closewebsockit();
				_that.SETLOAD(true);
				onlinemsg = _that.$message({
					message: '网络异常,请检查网络！',
					type: 'error',
					duration: 0,
				});
			});
			window.onfocus = function() {
				_that.windowifonfocus = false;
			};
			window.onblur = function() {
				_that.windowifonfocus = true;
			};
		},
		gocallenter: function(e) {
			e.preventDefault();
			this.SETPATH('callenter');
		}
	},
	watch: {
		$route: {
			handler: function(val, oldVal) {
				if (val.fullPath == '/index/chart') {
					this.myNotification != null ? this.myNotification.close() : null;
				} else if (val.fullPath == '/index/leaveword') {

				} else {
					this.$api.server.deleteKFWindowlocationRedis().then(res => {
						if (res.status == 10000) {

						} else {
							if (res.status == 30000) {
								this.$message.error(res.message);
							} else {
								this.$message.error('未能接收到规定的Josn返回格式!');
							}
						}
					});
					if (val.fullPath == '/index/Idealwith') {
						this.billNotification != null ? this.billNotification.close() : null;
					}
				}
			},
			deep: true
		},
		websockitsendmsg: function(news, olds) {
			if (news != null) {
				this.websockitobj.send(JSON.stringify(news));
			}

		}
	}
}
