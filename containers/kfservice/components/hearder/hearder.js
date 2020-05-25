import {mapGetters,mapMutations} from 'vuex'
import {imServerStore} from '../../store/imServerStore.js'
import {publicmethod} from '../../utils/publicmethod.js'
export default {
	name: "hearder",
	data() {
		return {
			stutasselect: [{
				value: 1,
				label: '在线',
				borderTop: "none",
				active:true,
			}, {
				value: 2,
				label: '离开',
				borderTop: "none",
				active:false,
			}, {
				value: 0,
				label: '下线',
				borderTop: "1px solid #E5E5E5",
				active:false,
			}, ],
			onlinevisible:false,
			onlinestatus:null,
			usermsg:{},
			busselect: [],
			busstr: '',
			busVisible: false,
			busNnmber: 0,
		}
	},
	created() {
		
	},
	mounted() {
		publicmethod.backlogin(this) ? this.init() : null;
	},
	computed: {
		...mapGetters('serverModule', ['someObj', 'zuixinnews','userInfo','businesstype','callwindow','path'])
	},
	methods: {
		...mapMutations('serverModule', {
			SETZUINNEWS: 'SETZUINNEWS',
			set_someObj: 'SET_SOMEOBJ',
			SETUSERINFO: 'SETUSERINFO',
			SETBUSINESSTYPE:'SETBUSINESSTYPE',
			RESTATUS:'RESTATUS',
			SETLOAD:'SETLOAD',
		}),
		init:function(){
			this.showbuss();
			this.showusermsg();
			let _that=this;
			$('div').each(function(){
				$(this).click(function(){
					if(_that.onlinevisible){
						_that.onlinevisible=false;
					}
				})
			})
		},
		onlinevisiblefun:function(){
			if(this.onlinevisible){
				this.onlinevisible=false;
			}else{
				this.onlinevisible=true;
			}
		},
		changestats: function(vlaue, label,index) {
			this.$confirm('确定要更改登录状态为  "' + label + '"', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.SETLOAD(true);
				this.$api.server.changeonlinestatus(vlaue).then(res => {
					if (res.status == 10000) {
						this.stutasselect.forEach((value,index)=>{
							value.active=false;
						})
						this.stutasselect[index].active=true;
						if (vlaue == 0) {
							 this.$parent.closewebsockit();
							imServerStore.dispatch('resetstate');
							 this.RESTATUS();
							sessionStorage.clear();
							this.SETLOAD(false);
							this.$router.replace({name:'login'});
							
						} else {
							this.SETLOAD(false);
							this.onlinestatus=vlaue;
							this.usermsg.onlinestatus=vlaue;
							this.SETUSERINFO(this.usermsg);
							this.$message.success('已经成功修改登录状态');
						}
						
					} else {
						this.SETLOAD(false);
						this.showusermsg();
						if(res.status == 30000){
							this.$message.error(res.message);
						}else{
							this.$message.error('未能接收到规定的Josn返回格式!');
						}
					}
				})
			}).catch(() => {
				this.showusermsg();
			});
		},
		analysis: function(text) {
			return publicmethod.expression(text);
		},
		handleClose: function() {
			this.busVisible = false;
			this.showbuss();
		},
		selectedfun: function(indexs) {
			if (this.busselect[indexs].checked) {
				this.busselect[indexs].checked = false;
				this.busNnmber--;
			} else {
				this.busselect[indexs].checked = true;
				this.busNnmber++;
			}
		},
		submitbus: function() {
			if (this.loading == true) {
				return;
			}
			let busarray = [];
			let busstr;
			this.busselect.forEach(function(value, index) {
				if (value.checked == true) {
					busarray.push(value.bussinessId);
				}
			})
			busstr = busarray.join(',');
			this.busVisible =false;
			this.SETLOAD(true);
			this.$api.server.updateAdminBusinessInfo(busstr).then(res => {
				if (res.status == 10000) {
					this.busVisible = false;
					 this.SETBUSINESSTYPE(JSON.parse(JSON.stringify(this.busselect)));
					this.$message.success('修改业务成功');
					this.SETLOAD(false);
				} else {
					this.showbuss();
					this.SETLOAD(false);
					if(res.status == 30000){
						this.$message.error(res.message);
					}else{
						this.$message.error('未能接收到规定的Josn返回格式!');
					}
				}
			})
		},
		showbuss:function(){
			var _that = this;
			_that.busNnmber=0;
			this.busselect=JSON.parse(JSON.stringify(this.businesstype));
			this.busselect.forEach(function(value, index) {
				if (value.checked == true) {
					_that.busNnmber++;
				}
			})
		},
		showusermsg:function(){
			this.usermsg = JSON.parse(JSON.stringify(this.userInfo));
			this.onlinestatus = this.usermsg.onlinestatus;
			this.stutasselect.forEach((value,index)=>{
				if(this.onlinestatus == value.value){
					value.active=true;
				}else{
					value.active=false;
				}
			})
		}
	},
	watch: {
		zuixinnews: function(news, olds) {
			if (news != null) {
				if (news.wsType == 1 || news.wsType == 2) {
					if (news.chatStatus >= 3) {
						this.$notify({
							dangerouslyUseHTMLString: true,
							message: '<strong><i class="el-icon-message-solid" style="color:#0054ff;font-size:15px;"></i>&emsp;会话已结束</strong><br/>&emsp;&emsp;<span>' +
								news.msg + '<span>'
						});
					} else {
						this.$notify({
							dangerouslyUseHTMLString: true,
							message: '<strong><i class="el-icon-message-solid" style="color:#0054ff;font-size:15px;"></i>&emsp;您有新的会话</strong><br/>&emsp;&emsp;<span>' +
								news.msg + '<span>'
						});
					}
				} else if(news.wsType == 3){
					if (news.senderType != 2) {
						if (this.someObj != null) {
							if (news.userId != this.someObj.userId || this.path != 'chart') {
								this.$notify({
									dangerouslyUseHTMLString: true,
									message: '<strong><i class="el-icon-chat-dot-round" style="color:#1AA034;font-size:15px;"></i>&emsp;您收到了条新消息</strong><br/>&emsp;&emsp;<span>' +
										news.senderName + ':' + this.analysis(news.content) + '<span>'
								});
							}

						} else {
							this.$notify({
								dangerouslyUseHTMLString: true,
								message: '<strong><i class="el-icon-chat-dot-round" style="color:#1AA034;font-size:15px;"></i>&emsp;您收到了新消息</strong><br/>&emsp;&emsp;<span>' +
									news.senderName + ':' + this.analysis(news.content) + '<span>'
							});
						}
					}
				}
			}
		},
	},
}
