import api from 'api/base'
import {
	Dialog,
	ImagePreview,
	Toast
} from 'vant';
import {
	publicmethod
} from '../../utils/publicmethod.js'
import {
	mapGetters,
} from 'vuex'
import $ from 'jquery';
export default {
	name: "Mobilechat",
	data() {
		return {
			chartdata: [],
			valuetext: '',
			socket: null,
			userId: '',
			recordId: '',
			userName: '',
			endbtn: false,
			showinput: true,
			linkmsg: '',
			writetime: 'yyyy-mm-dd hh:mm:ss',
			pictruearry: [],
			upLoadpictureLoding: '',
			loadingcompleted: false,
			base64: null,
			websockitsetInterval: null,
			overtimeInterval: null,
			ifwebsockitobj: true,
			startouch: 0,
			endtouch: 0,
			storagemsg: [],
		}
	},
	created() {
		this.userId = this.$route.query.userId;
		this.recordId = this.$route.query.recordId;
		this.getchartlist();
	},
	mounted() {},
	computed: {
		...mapGetters('serverModule', ['icondata'])
	},
	methods: {
		endcomfirm: function() {
			Dialog.confirm({
				message: '您确定要结束当前会话'
			}).then(() => {
				this.$api.server.endoftheservice(this.userId).then(res => {
					if (res.status == 10000) {
						this.endbtn = false;
					} else {
						Toast.fail(res.msg);
					}
				})
			}).catch(() => {});
		},
		afterRead: function(file) {
			let f0 = file.file;
			this.upLoadpictureLoding = "压缩中..."
			publicmethod.filecompression(f0, this);
		},
		uploadpictrue: function(base64) {
			this.upLoadpictureLoding = "上传中..."
			this.$api.server.moblieuploadpictures(base64, this.userId, 'wx').then(res => {
				if (res.status == 10000) {
					this.base64 = null;
					Toast.success('上传成功');
					this.upLoadpictureLoding = '';
				} else {
					this.base64 = null;
					Toast.fail('上传失败');
					this.upLoadpictureLoding = '';
				}
			})
		},
		linkwebsokit: function() {
			let _that = this;
			let recordId = this.recordId;
			let type = 'wx' + recordId;
			let srv = api.test.replace('https', 'wss') + 'websocket/';
			this.socket = new WebSocket(srv + '"kefuId":"' + sessionStorage.getItem("adminId") + '","type":"' + type + '"');
			this.socket.onopen = function(event) {}
			this.socket.onmessage = function(msg) {
				_that.disposewebsockitmsg(msg);
			}
			this.socket.onerror = function(e) {
				clearInterval(_that.websockitsetInterval);
				if (_that.ifwebsockitobj) {
					_that.ifwebsockitobj = false;
					_that.linkwebsokit();
					_that.overtime();
				}
			};
			this.socket.onclose = function(e) {
				clearInterval(_that.websockitsetInterval);
				if (_that.ifwebsockitobj) { 
						_that.ifwebsockitobj = false;
						_that.linkwebsokit();
						_that.overtime();
				}

			};
		},
		overtime: function() {
			this.overtimeInterval = setTimeout(() => {
				this.socket.close();
				setTimeout(()=>{
					this.ifwebsockitobj = true;
					this.linkwebsokit();
				},2000)
			}, 1000 * 60)
		},
		disposewebsockitmsg: function(msg) {
			if (msg.data == "success") {
				this.goEnd();
				this.loadingcompleted = false;
				this.ifwebsockitobj = true;
				clearTimeout(this.overtimeInterval);
				this.websockitsetInterval = setInterval(() => {
					this.socket.send(JSON.stringify({
						type: 'heart',
					}));
				}, 1000 * 60 * 10);
			}else{
				let data = JSON.parse(msg.data);
				if (data.type == 'wx') {
					if (data.msg == undefined) {
						data.sendTime = publicmethod.handletime(data.sendTime, this);
						if (data.contentType == 2) {
							data.pictrueindex = this.pictruearry.length;
							this.pictruearry.push(data.content);
							if (this.userId == data.userId) {
								this.chartdata[this.chartdata.length - 1].chatRecordDTOList.push(data);
								this.goend = true;
								this.goEnd();
							}
						} else {
							if (this.userId == data.userId) {
								this.chartdata[this.chartdata.length - 1].chatRecordDTOList.push(data);
								this.goend = true;
								this.goEnd();
							}
						}

					} else {
						this.linkmsg = data.msg;
						if (data.kefuId == "") {
							this.endbtn = false;
							this.showinput = true;
						} else {
							if (data.kefuId != sessionStorage.getItem("adminId")) {
								this.showinput = false;
								this.endbtn = false;
							} else {
								this.showinput = true;
								this.endbtn = true;
							}

						}

					}
				}
			}
		},
		getchartlist: function() {
			let _that = this;
			_that.loadingcompleted = true;
			this.$api.server.mbbliegetMsgHis(this.userId).then(res => {
				if (res.status == 10000) {
					res.data.chatDtoList.forEach(function(value, index) {
						value.chatRecordDTOList.forEach(function(value, index) {
							value.sendTime = publicmethod.handletime(value.sendTime, _that);
							if (value.contentType == 2) {
								value.pictrueindex = _that.pictruearry.length;
								_that.pictruearry.push(value.content);
							}
							if(value.senderType == 1 && _that.userName == ''){
								_that.userName=value.senderNmae;
							}
						})
					})
					if(res.data.chatDtoList.length >= 3){
						this.chartdata.unshift(res.data.chatDtoList.pop());
						this.chartdata.unshift(res.data.chatDtoList.pop());
						this.chartdata.unshift(res.data.chatDtoList.pop());
					} else {
						if(res.data.chatDtoList.length == 2){
							this.chartdata.unshift(res.data.chatDtoList.pop());
							this.chartdata.unshift(res.data.chatDtoList.pop());
						}else if(res.data.chatDtoList.length == 1){
							this.chartdata.unshift(res.data.chatDtoList.pop());
						}
					}
					this.storagemsg = res.data.chatDtoList;
					this.linkwebsokit();
				} else {
					_that.loadingcompleted = false;
					Toast.fail('聊天信息加载失败,请重试！');
				}
			})
		},
		send: function() {
			let msg = this.valuetext;
			this.valuetext = '';
			if (msg == '') {
				return;
			}
			let params = {
				"type": "wx",
				"wsType": "3",
				"chatId": "",
				"contentType": "1",
				"content": msg,
				"recordId": this.recordId,
				"kefuId": sessionStorage.getItem("adminId")
			};
			this.socket.send(JSON.stringify(params));
		},
		goEnd: function() {
			this.$nextTick(() => {
				if (this.goend) {
					setTimeout(() => {
						this.$refs.chartcontent.scrollTop = this.$refs.chartcontent.scrollHeight;
					},0);
				}

			});
		},
		analysis: function(text) {
			return publicmethod.expression(text, this);
		},
		pictrueview: function(pictrueindex) {
			let _that = this;
			ImagePreview({
				images: _that.pictruearry,
				startPosition: pictrueindex,
				onClose() {}
			});
		},
		touchstartfun: function(e) {
			this.startouch = e.changedTouches[0].pageY;
		},
		touchmovefun: function(e) {
			this.endtouch = e.changedTouches[0].pageY;
			(this.endtouch - this.startouch > 50) && (this.$refs.chartcontent.scrollHeight <= this.$refs.chartcontent.offsetHeight+1)? this.addminmsg() : false;
		},
		scrollfun:function(e){
			if(this.$refs.chartcontent.scrollTop<=1){
				this.addminmsg();
			}
		},
		addminmsg: function() {
			let  lastChartId = this.$refs.chartclassifys[0].id;
			if(this.storagemsg.length >= 3){
					this.chartdata.unshift(this.storagemsg.pop());
					this.chartdata.unshift(this.storagemsg.pop());
					this.chartdata.unshift(this.storagemsg.pop());
			} else {
					if(this.storagemsg.length == 2){
						this.chartdata.unshift(this.storagemsg.pop());
						this.chartdata.unshift(this.storagemsg.pop());
					}else if(this.storagemsg.length == 1){
						this.chartdata.unshift(this.storagemsg.pop());
					}else{
						Toast.fail('已经展示全部的聊天信息!');
					}
			}
			this.$nextTick(() => {
					setTimeout(()=>{
						this.$el.querySelector('#'+lastChartId).scrollIntoView();
					},50)
			});
			

		}
	},
	watch: {
		base64: function(news, olds) {
			if (news != null) {
				this.uploadpictrue(news);
			}
		},
	}
}
