import {
	mapGetters,
	mapMutations
} from 'vuex'
import emotionicon from '../emotionicon/emotionicon.vue';
import {
	publicmethod
} from '../../utils/publicmethod.js';
import {
	imServerStore
} from '../../store/imServerStore.js';
import $ from 'jquery';
export default {
	name: 'common_chat',
	components: {
		emotionicon: emotionicon
	},
	data() {
		return {
			srcList: [],
			imgcode: [],
			writetime: 'yyyy-mm-dd hh:mm:ss',
			chartmsgArry: [],
			base64: null,
			sendtype: 1,
			file: null,
			savechartmsgArry: [],
			setTimeoutFun: true,
		};
	},
	created() {},
	computed: {
		...mapGetters('serverModule', ['someObj', 'zuixinnews', 'userInfo'])
	},
	watch: {
		//接收到websockit 推送过来的消息
		zuixinnews: function(news, olds) {
			if (news != null) {
				//判断是否websockit 推送过来的消息是否是当前聊天信息窗口的信息
				if (news.wsType == 3) {
					if (this.someObj != null && news.userId == this.someObj.userId && news.location == 'window') {
						news.sendTime = publicmethod.handletime(news.sendTime, this);
						this.chartmsgArry[this.chartmsgArry.length - 1].chatRecordDTOList.push(news);
					}
				} else if (news.wsType == 4 && news.userId == this.someObj.userId) {//后台没有能成功收到前端推送的消息
					this.chartmsgArry[this.chartmsgArry.length - 1].chatRecordDTOList.forEach((value, index) => {
						if (value.code == news.code) {
							value.msgsendstatus = 3;
						}
					})
				} else if (news.wsType == 5 && news.userId == this.someObj.userId) {//后台已经成功收到前端推送消息
					this.chartmsgArry[this.chartmsgArry.length - 1].chatRecordDTOList.forEach((value, index) => {
						if (value.code == news.code) {
							value.msgsendstatus = 1;
						}
					})
				}
				this.goEnd();
			}
		},
		base64: function(news, olds) {
			if (news != null) {
				this.uploadpictrue(news);
			}
		}
	},
	mounted() {},
	methods: {
		...mapMutations('serverModule', {
			SET_WEBSOCKITSENDMSF: 'SET_WEBSOCKITSENDMSF',
			SETLOAD: 'SETLOAD',
		}),
		/* 请求聊天信息 */
		getchartdata: function() {
			this.$api.server.getMsgHis(this.someObj.userId).then(res => {
				if (res.status == 10000) {
					this.writetime = 'yyyy-mm-dd hh:mm:ss';
					this.replacetime(res.data, );
				} else {
					this.SETLOAD(false);
					if (res.status == 30000) {
						this.$message.error(res.message);
					} else {
						this.$message.error('未能接收到规定的Josn返回格式!');
					}
				}
			});
		},
		/* 消息 发送方法*/
		send() {
			let msg = this.$refs.inputContent.innerHTML;
			let msgs = msg
			if (msgs.replace(/ /g, '') == '') {
				this.$message('发送消息内容不能为空!');
				return;
			}
			if (this.sendtype == 1) {
				msg = this.replacehtml(msg);
				this.sendtext(msg);
			} else if (this.sendtype == 2) {
				publicmethod.filecompression(this.file, this);
				this.$refs.inputContent.innerHTML = '';
			}
			this.sendtype = 1;
		},
		//监听键盘事件 按回车调用 send（） 放松信息。
		inputContent_keydown: function(e) {
			if (e.shiftKey && e.keyCode == 13) {

			} else if (e.keyCode == 13) {
				this.send();
				e.returnValue = false;
				return;
			}
		},
		//模拟浏览器 intput点击事件方法
		fileUpload_click: function(fileType) {
			this.$refs.uploadFiles.click();
		},
		//获取input文件流 
		filechang: function(e) {
			e = window.event || e;
			e.preventDefault();
			let f0 = this.$refs.uploadFiles.files[0];
			publicmethod.filecompression(f0, this);
		},
		//获取文件流 this.refs.unloadFiles.files[0]
		// this.refs.unloadFiles.files[0]
		//图片压缩上传方法
		uploadpictrue: function(base64) {
			let msgid = this.getmsgid();
			let sendObj = {
				code: msgid,
				msgsendstatus: 2,
				senderType: 2,
				senderImg: this.userInfo.imgUrl,
				senderName: this.userInfo.userName,
				contentType: 2,
				content: base64,
				sendTime: publicmethod.getTime(this),
			}
			imServerStore.dispatch('updatalistchart', sendObj);
			this.chartmsgArry[this.chartmsgArry.length - 1].chatRecordDTOList.push(sendObj);
			this.goEnd();
			this.$api.server.uploadpictures(base64, this.someObj.userId, 'pc').then(res => {
				if (res.status == 10000) {
					this.$refs.uploadFiles.value = '';
					this.base64 = null;
					this.file = null;
					this.chartmsgArry[this.chartmsgArry.length - 1].chatRecordDTOList.forEach((value, index) => {
						if (value.code == msgid) {
							value.msgsendstatus = 1;
						}
					})
				} else {
					this.$refs.uploadFiles.value = '';
					this.base64 = null;
					this.file = null;
					this.chartmsgArry[this.chartmsgArry.length - 1].chatRecordDTOList.forEach((value, index) => {
						if (value.code == msgid) {
							value.msgsendstatus = 3;
						}
					})
					if (res.status == 30000) {
						this.$message.error(res.message);
					} else {
						this.$message.error('未能接收到规定的Josn返回格式!');
					}
				}
			})
		},
		//客服发送消息处理的方法，需要将消息回显到会话列表，和聊天窗口。
		sendtext: function(msg) {
			let msgid = this.getmsgid();
			let params = {
				code: msgid,
				chatId: this.someObj.chatId,
				userId: this.someObj.userId,
				contentType: 1,
				content: msg,
				type: 'pc',
				kefuId: this.userInfo.id
			};
			let sendObj = {
				msgsendstatus: 2,
				code: msgid,
				chatId: this.someObj.chatId,
				userId: this.someObj.userId,
				senderType: 2,
				senderImg: this.userInfo.imgUrl,
				senderName: this.userInfo.userName,
				contentType: 1,
				content: msg,
				sendTime: publicmethod.getTime(this),
				kefuId: this.userInfo.id,
			}
			this.SET_WEBSOCKITSENDMSF(params);
			this.chartmsgArry[this.chartmsgArry.length - 1].chatRecordDTOList.push(sendObj);
			imServerStore.dispatch('updatalistchart', sendObj);
			this.$refs.inputContent.innerHTML = '';
			this.imgcode = [];
			this.goEnd();
			setTimeout(() => {
				this.chartmsgArry[this.chartmsgArry.length - 1].chatRecordDTOList.forEach((value, index) => {
					if (value.code == msgid && value.msgsendstatus == 2) {
						value.msgsendstatus = 3;
					}
				})
			}, 10000)
		},
		//消息窗口滚动到底部
		goEnd: function() {
			this.$nextTick(() => {
				$("#common_chat_main").animate({
					scrollTop: $("#common_chat_main").prop("scrollHeight"),
				}, 500);
			});
		},
		//图片消息预览
		pictrueview: function(url) {
			this.srcList = [];
			this.srcList.push(url);
		},
		//消息的事件处理事件处理
		replacetime: function(data, _this) {
			let _that = this;
			let chartdata = data;
			chartdata.chatDtoList.forEach(function(value, index) {
				value.chatRecordDTOList.forEach(function(value, index) {
					value.msgsendstatus = 1; /* 1 发送成功 2 发送中 3 发送失败*/
					value.sendTime = publicmethod.handletime(value.sendTime, _that);
				})
			})
			if (chartdata.chatDtoList.length >= 3) {
				this.chartmsgArry.unshift(chartdata.chatDtoList.pop());
				this.chartmsgArry.unshift(chartdata.chatDtoList.pop());
				this.chartmsgArry.unshift(chartdata.chatDtoList.pop());
			} else {
				if (chartdata.chatDtoList.length == 2) {
					this.chartmsgArry.unshift(chartdata.chatDtoList.pop());
					this.chartmsgArry.unshift(chartdata.chatDtoList.pop());
				} else if (chartdata.chatDtoList.length == 1) {
					this.chartmsgArry.unshift(chartdata.chatDtoList.pop());
				}
			}
			this.savechartmsgArry = chartdata;
			this.$nextTick(() => {
				setTimeout(() => {
					this.SETLOAD(false);
					this.goEnd();
				}, 500)
			});
		},
		//选择表情，输入框输入框显示表情
		emotioniconCtr: function(items) {
			this.imgcode.push(items.code);
			let msgObj = this.$refs.inputContent;
			msgObj.innerHTML = msgObj.innerHTML + '<img src="' + items.imgurl + '"></img>';
		},
		//把输入框的表情解析成 微信识别表情code 编码
		replacehtml: function(str) {
			let str1 = str;
			this.imgcode.forEach(function(value, index) {
				str1 = str1.replace(/<\s?img[^>]*>/i, '/' + value);
			})
			return str1;
		},
		//表情解析
		analysis: function(text) {
			return publicmethod.expression(text, this);
		},
		//图片和文本复制粘贴的方法
		pastefun: function(e) {
			let _that = this;
			e.preventDefault();
			let msgObj = this.$refs.inputContent;
			for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
				var item = e.clipboardData.items[i];
				if (item.kind === "string") {
					if (_that.sendtype == 2) {
						_that.sendtype = 1;
						_that.file = null;
						msgObj.innerHTML = '';
					}
					item.getAsString(function(str) {
						let patt = /<[^>]+>/g;
						if (!patt.test(str)) {
							msgObj.innerHTML = msgObj.innerHTML + str;
						}
					})
				} else if (item.kind === "file") {
					msgObj.innerHTML = '';
					let f0 = item.getAsFile();
					_that.file = f0;
					_that.sendtype = 2;
					let image = new Image();
					let reader = new FileReader();
					reader.readAsDataURL(f0);
					reader.onload = function(ev) {
						let inputWidth = msgObj.offsetWidth;
						let inputHeight = msgObj.offsetHeight;
						image.src = ev.target.result;
						image.onload = function() {
							let width;
							let height;
							this.width / inputWidth > 0.8 ? width = '25%' : width = this.width / inputWidth * 60 + '%';
							this.height / inputHeight > 0.8 ? height = '50%' : height = this.width / inputWidth * 90 + '%';
							image.style.width = width;
							image.style.height = height;
							msgObj.appendChild(image);
						}
					}
				}
			}
		},

		divinput: function(e) {
			if (this.$refs.inputContent.innerHTML == '') {
				this.sendtype = 1;
			}
			if (this.sendtype == 2) {
				this.sendtype = 1;
				this.file = null;
				this.$refs.inputContent.innerHTML = '';
			}
		},
		//使用时间作为消息的id（精确到毫秒）
		getmsgid: function() {
			let Dates = new Date();
			let Milliseconds = Dates.getMilliseconds();
			let Seconds = Dates.getSeconds();
			let Minutes = Dates.getMinutes();
			let Hours = Dates.getHours();
			let Day = Dates.getDate();
			let Monthly = Dates.getMonth();
			let Year = Dates.getFullYear();
			return Year + '' + Monthly + '' + Day + '' + Hours + '' + Minutes + '' + Seconds + '' + Milliseconds;
		},
		//鼠标滚动加载聊天信息
		scrollfun: function(e) {
			if (e.deltaY > 1) {
				return;
			}
			if (this.$refs.common_chat_main.scrollTop < 1) {
				let lastChartId = this.$refs.chartclassifys[0].id;
				if (this.savechartmsgArry.chatDtoList.length >= 3) {
					this.chartmsgArry.unshift(this.savechartmsgArry.chatDtoList.pop());
					this.chartmsgArry.unshift(this.savechartmsgArry.chatDtoList.pop());
					this.chartmsgArry.unshift(this.savechartmsgArry.chatDtoList.pop());
				} else {
					if (this.savechartmsgArry.chatDtoList.length == 2) {
						this.chartmsgArry.unshift(this.savechartmsgArry.chatDtoList.pop());
						this.chartmsgArry.unshift(this.savechartmsgArry.chatDtoList.pop());
					} else if (this.savechartmsgArry.chatDtoList.length == 1) {
						this.chartmsgArry.unshift(this.savechartmsgArry.chatDtoList.pop());
					} else {
						if (this.setTimeoutFun) {
							this.setTimeoutFun = false;
							this.$message('聊天内容已经全部展示！');
							etTimeout(() => {
								this.setTimeoutFun = true;
							}, 2000)
						}
					}
				}
				//要准确回显消息的位置设定延迟100毫秒
				this.$nextTick(() => {
					setTimeout(() => {
						this.$el.querySelector('#' + lastChartId).scrollIntoView();
					}, 100)
				});
			}

		},
	},

}
