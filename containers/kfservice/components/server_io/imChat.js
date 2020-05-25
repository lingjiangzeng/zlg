import commonChat from 'components/common/common_chat.vue';
import chartDetail from 'components/chartDetail/chartDetail.vue';
import {
	mapGetters,
	mapMutations
} from 'vuex';
import {
	imServerStore
} from '../../store/imServerStore.js'
import {
	publicmethod
} from '../../utils/publicmethod.js'
export default {
	components: {
		commonChat: commonChat,
		chartDetail: chartDetail
	},
	name:'imChat',
	data() {
		return {
			Listdata: {},
			userMsg: [],
			serverListStyle: false,
			passto: false,
			passtodata: [],
			checkedindex: null,
			showchartDetail: false,
			passTolistloading: false,
			showbill: false,
			ifbuildbill: true,
			deptStaffInfo: null,
			deptStaffInfovalue: '',
			deptStaffDtos: null,
			deptStaffDtosvlaue: '',
			woTypes: null,
			woTypesvalue: '',
			billtextarea: '',
			titleValue: '',
			radio: '',
			billdataloading: false,
			billlistdata: null,
		};
	},
	created() {},
	computed: {
		...mapGetters('serverModule', ['someObj','windowsize'])
	},
	watch: {},
	methods: {
		...mapMutations('serverModule', {
			SETLOAD:'SETLOAD',
		}),
		EndServe(userId) {
			var _that = this;
			this.$confirm('确定结束服务?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.SETLOAD(true);
				_that.$api.server.endoftheservice(this.Listdata.userId).then(res => {
					if (res.status == 10000) {
						this.$nextTick(()=>{
							this.SETLOAD(false);
						})
						_that.$message.success(res.message);
					} else {
						this.SETLOAD(false);
						if(res.status == 30000){
							this.$message.error(res.message);
						}else{
							this.$message.error('未能接收到规定的Josn返回格式!');
						}
					}
				})
			}).catch(() => {});
		},
		showserverList: function() {
			if (this.serverListStyle == false) {
				this.serverListStyle = true;
			} else {
				this.showchartDetail = false;
				this.serverListStyle = false;
			}
		},
		changuserinfo: function(obj) {
			if (obj != null) {
				this.Listdata = obj;
				this.$api.server.changuserinfo(obj.userId).then(res => {
					if (res.status == 10000) {
						this.userMsg = res.data;
						this.$refs.commonchat.getchartdata();
					}else{
						this.$refs.commonchat.getchartdata();
						if(res.status == 30000){
							this.$message.error(res.message);
						}else{
							this.$message.error('未能接收到规定的Josn返回格式!');
						}
					}
				})
			}
			this.initializestatus();
		},
		changeServer() {
			this.passTolistloading = true,
				this.passtodata = [];
			this.checkedindex = null;
			var _that = this;
			if (this.passto == false) {
				this.passto = true;
				this.$api.server.getkufulist().then(res => {
					if (res.status == 10000) {
						res.data.forEach(function(value, index) {
							value.checked = false;
							_that.passtodata.push(value);
						})
						this.passTolistloading = false;
					} else {
						this.passTolistloading = false;
						if(res.status == 30000){
							this.$message.error(res.message);
						}else{
							this.$message.error('未能接收到规定的Josn返回格式!');
						}
					}
				})
			} else {
				this.passto = false;
			}
		},
		choicePeople: function(index) {
			if (this.checkedindex != null) {
				if (this.checkedindex != index) {
					this.passtodata[index].checked = true;
					this.passtodata[this.checkedindex].checked = false;
					this.checkedindex = index;
				}
			} else {
				this.passtodata[index].checked = true;
				this.checkedindex = index;
			}
		},
		switchpeople: function() {
			if (this.checkedindex != null) {
				this.passto = false;
				this.SETLOAD(true);
				this.$api.server.deliverToOtherServer(this.Listdata.userId, this.passtodata[this.checkedindex].kefuId).then(res => {
					if (res.status == 10000) {
						this.$nextTick(()=>{
							this.SETLOAD(false);
						})
						this.checkedindex = null;
						imServerStore.dispatch('addendserver');
						this.$message.success(res.message);
					} else {
						this.SETLOAD(false);
						if(res.status == 30000){
							this.$message.error(res.message);
						}else{
							this.$message.error('未能接收到规定的Josn返回格式!');
						}
					}
				})
			} else {
				this.$message.warning('请选择的转交人员!');
			}
		},
		showchartDetailchange(item) {
			this.showchartDetail = true;
			this.$nextTick(function() {
				this.$refs.chartDetail.getchartdata(item.chatId);
			})

		},
		colseshowchartDetail: function() {
			this.showchartDetail = false;
		},
		revisedname: function() {
			this.$prompt('请输入备注名', '提示', {
				inputValue: this.userMsg.remark,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /\S/,
				inputErrorMessage: '请输入修改的备注名'
			}).then(({
				value
			}) => {
				this.SETLOAD(true);
				this.$api.server.remarkname(this.Listdata.userId, value).then(res => {
					if (res.status == 10000) {
						this.SETLOAD(false);
						this.userMsg.remark = value;
						this.Listdata.senderName = this.Listdata.senderName.split('(')[0] + '(' + value + ')';
						this.$message.success(res.message);
					} else {
						this.SETLOAD(false);
						if(res.status == 30000){
							this.$message.error(res.message);
						}else{
							this.$message.error('未能接收到规定的Josn返回格式!');
						}
					}
				})
			}).catch(() => {

			});
		},
		showbillfun: function(bloean) {
			this.showbill = bloean;
			if (this.showbill) {
				this.getuserbill();
			}else{
				this.ifbuildbill = true;
			}
		},
		fifbuildbillfun: function() {
			if (this.ifbuildbill) {
				this.initializebillform();
				this.ifbuildbill = false;
				if (this.woTypes == null) {
					this.billdataloading = true;
					this.$api.server.getWOTypeAndDeptInfo().then(res => {
						if (res.status == 10000) {
							this.deptStaffInfo = res.data.deptStaffInfo;
							this.woTypes = res.data.woTypes;
							this.billdataloading = false;
						} else {
							if(res.status == 30000){
								this.$message.error(res.message);
							}else{
								this.$message.error('未能接收到规定的Josn返回格式!');
							}
							this.billdataloading = false;
						}
					})
				}

			} else {
				this.ifbuildbill = true;
			}
		},
		deptStaffInfovaluefun: function(e) {
			var _that = this;
			this.deptStaffDtosvlaue ='';
			this.deptStaffInfo.forEach(function(value, index) {
				if (value.deptCode == e) {
					_that.deptStaffDtos = value.deptStaffDtos;

				}

			})
		},
		submitformdata: function() {
			if (this.deptStaffInfovalue == '' || this.deptStaffDtosvlaue == '' || this.woTypesvalue == '' || this.billtextarea ==
				'' || this.titleValue == '' || this.radio == '') {
				this.$message.warning('请填写完成的信息!');
				return;
			}
			this.billdataloading = true;
			this.$api.server.addWorkOrder(this.woTypesvalue, this.radio, this.titleValue, this.billtextarea, this.Listdata.userId,
				this.deptStaffDtosvlaue,this.Listdata.chatId).then(res => {
				if (res.status == 10000) {			
					this.billlistdata=null;
					this.getuserbill();								
					this.initializebillform();
					this.ifbuildbill = true;
					this.$message.success(res.message);
				} else {
					this.billdataloading = false;
					if(res.status == 30000){
						this.$message.error(res.message);
					}else{
						this.$message.error('未能接收到规定的Josn返回格式!');
					}
				}
			})
		},
		initializebillform: function() {
			this.deptStaffInfovalue = '';
			this.deptStaffDtosvlaue = '';
			this.woTypesvalue = '';
			this.billtextarea = '';
			this.titleValue = '';
			this.radio = '';
			this.deptStaffDtos = null;
		},
		initializestatus: function() {
			this.deptStaffInfo = null;
			this.woTypes = null;
			this.billlistdata = null;
			this.passto = false;
			this.showchartDetail = false;
			this.serverListStyle = false;
			this.showbill = false;
			this.ifbuildbill = true;
		},
		getuserbill: function() {
				this.billdataloading = true;
				this.$api.server.getAdminWOList(this.Listdata.userId).then(res => {
					if (res.status == 10000) {
						this.billlistdata = res.data;
						this.$nextTick(() => {
							this.billdataloading = false;
						 });
					} else {
						this.billdataloading = false;
						if(res.status == 30000){
							this.$message.error(res.message);
						}else{
							this.$message.error('未能接收到规定的Josn返回格式!');
						}
					}
				})

		},
		gotonbilldeatil:function(code,userId){
			this.$parent.showbillDetail(code,userId);
		}

	},
};
