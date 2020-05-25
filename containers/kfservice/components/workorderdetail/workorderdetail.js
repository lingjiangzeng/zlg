import chartDetail from 'components/chartDetail/chartDetail.vue';
import {mapMutations,} from 'vuex';
export default {
	name: "workorderdetail",
	components: {
		chartDetail:chartDetail
	},
	data() {
		return {
			FlowInfo: [],
			dialogVisible: false,
			remark: '',
			remarktype: null,
			WOInfo: {},
			UserInfo: {},
			ButtonInfo: '',
			billmsgerror: '工单详情信息查询失败,请重试!',
			billmsgsuccess:'工单信息查询成功',
			billtype: '',
			operationtype: '',
			PassedVisible: false,
			billtextarea:'',
			relaunchedVisible: false,
			deptStaffInfo: null,
			deptStaffInfovalue: '',
			deptStaffDtos: null,
			deptStaffDtosvlaue: '',
			woTypes: null,
			woTypesvalue: '',
			billtextarea: '',
			titleValue: '',
			radio:'',
			showchartDetail:false,
		}
	},
	methods: {
		...mapMutations('serverModule', {
			SETLOAD:'SETLOAD',
		}),
		back: function() {
			this.$parent.closeworkorderdetail();
		},
		getDetaildata: function(code, userId, type) {
			let userIds=userId;
			if(userIds==null){userIds='';}
			this.billtype = type;
			this.SETLOAD(true);
			this.$api.server.getWorkOrderDetail(code, userIds, type).then(res => {
				if (res.status == 10000) {
					this.FlowInfo = res.data.FlowInfo;
					this.WOInfo = res.data.WOInfo;
					this.UserInfo = res.data.UserInfo;
					 this.$message.success(this.billmsgsuccess);
					this.ButtonInfo = res.data.ButtonInfo.join("-");
					this.$nextTick(() => {
						this.SETLOAD(false);
					});
				} else {
					if(res.status == 30000){
						this.$message.error(this.billmsgerror);
					}else{
						this.$message.error('未能接收到规定的Josn返回格式!');
					}
					this.back();
				}

			})
		},
		accept: function() {
			this.$confirm('你确定要接受该工单任务?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.SETLOAD(true);
				this.$api.server.acceptWorkOrder(this.WOInfo.code).then(res => {
					if (res.status == 10000) {
						this.billmsgsuccess = "已成功接受工单任务,并且更新工单信息成功";
						this.billmsgerror = "已成功接受工单任务,但是更新工单信息成功,请重新打开该工单详情!";
						this.getDetaildata(this.WOInfo.code, this.WOInfo.userId, this.billtype);

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
		sendback: function() {
			this.remarktype = 1;
			this.operationtype = '你确定要退回工单任务?';
			this.dialogVisible = true;

		},
		beensolved: function() {
			this.remarktype = 2;
			this.operationtype = '你确定已经完成工单任务任务?';
			this.dialogVisible = true;
		},
		handleClose: function() {
			this.operationtype = '';
			this.dialogVisible = false;
			this.remark = '';
			this.remarktype = null;
		},
		confirm: function() {
			if (this.remark == '') {this.$message.warning('请填写备注信息!');return;}
			this.dialogVisible = false;
			this.SETLOAD(true);
			if (this.remarktype == 1) {
				this.$api.server.returnWorkOrder(this.WOInfo.code, this.remark).then(res => {
					if (res.status == 10000) {
						this.billmsgsuccess = "已成功退回工单任务,并且更新工单信息成功";
						this.billmsgerror = "已成功退回工单任务,但是更新工单信息成功 ,请重新打开该工单详情!";
						this.handleClose();
						this.getDetaildata(this.WOInfo.code, this.WOInfo.userId, this.billtype);
					} else {
						this.SETLOAD(false);
						this.handleClose();
						if(res.status == 30000){
							this.$message.error(res.message);
						}else{
							this.$message.error('未能接收到规定的Josn返回格式!');
						}
					}

				})
			} else if (this.remarktype == 2) {
				this.$api.server.finishWorkOrder(this.WOInfo.code, this.remark).then(res => {
					if (res.status == 10000) {
						this.billmsgsuccess = "工单任务已解决操作成功,并且更新工单信息成功";
						this.billmsgerror = "工单任务已解决操作成功,但是更新工单信息成功,请重新打开该工单详情!";
						this.handleClose();
						this.getDetaildata(this.WOInfo.code, this.WOInfo.userId, this.billtype);
					} else {
						this.SETLOAD(false);
						this.handleClose();
						if(res.status == 30000){
							this.$message.error(res.message);
						}else{
							this.$message.error('未能接收到规定的Josn返回格式!');
						}
					}

				})
			}
		},
		closebill: function() {
			this.$confirm('你确定要关闭该工单任务?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.SETLOAD(true);
				this.$api.server.closeWorkOrder(this.WOInfo.code).then(res => {
					if (res.status == 10000) {
						this.billmsgsuccess = "关闭工单任务成功,并且更新工单信息成功";
						this.billmsgerror = "关闭工单任务成功,但是更新工单信息成功,请重新打开该工单详情!";
						this.getDetaildata(this.WOInfo.code, this.WOInfo.userId, this.billtype);

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
		deliverto: function() {
			this.PassedVisible = true;
			this.getbilltypeandhandles();
		},
		PassedClose: function() {
			this.PassedVisible = false;
			this.deptStaffInfovalue = '';
			this.deptStaffDtosvlaue = '';
			this.woTypesvalue = '';
			this.billtextarea = '';
			this.titleValue = '';
			this.radio = '';
		},
		Passedconfirm: function() {
			if (this.deptStaffInfovalue == '' || this.deptStaffDtosvlaue == '' || this.delivertoremark == '') {this.$message.warning('请填写完整信息!');return;}
			this.PassedVisible = false;
			this.SETLOAD(true);
			this.$api.server.deliverWorkOrder(this.WOInfo.code, this.deptStaffDtosvlaue,this.delivertoremark).then(res => {
				if (res.status == 10000) {
					this.$message.success('转交成功,已回到列表中!');
					this.$parent.resetlist();
				} else {
					this.SETLOAD(false);
					if(res.status == 30000){
						this.$message.error(res.message);
					}else{
						this.$message.error('未能接收到规定的Josn返回格式!');
					}
				}
			})
		},
		deptStaffInfovaluefun: function(e) {
			let _that = this;
			this.deptStaffDtosvlaue = '';
			this.deptStaffInfo.forEach(function(value, index) {
				if (value.deptCode == e) {
					_that.deptStaffDtos = value.deptStaffDtos;
				}
			})
		},
		relaunched: function() {
			this.relaunchedVisible = true;
			this.getbilltypeandhandles();

		},
		relaunchedconfirm: function() {
			if (this.deptStaffInfovalue == '' || this.deptStaffDtosvlaue == '' || this.woTypesvalue == '' || this.billtextarea == '' || this.titleValue == '' || this.radio == '') {
				this.$message.warning('请填写完成的信息!');
				return;
			}
			this.relaunchedVisible = false;
			this.SETLOAD(true);
			this.$api.server.addWorkOrder(this.woTypesvalue, this.radio, this.titleValue, this.billtextarea, this.WOInfo.userId,this.deptStaffDtosvlaue, this.WOInfo.chatId).then(res => {
				if (res.status == 10000) {
					this.$message.success('重新发起成功成功,已回到列表中');
					this.$parent.resetlist();
				} else {
					this.SETLOAD(false);
					if(res.status == 30000){
						this.$message.error(res.message);
					}else{
						this.$message.error('未能接收到规定的Josn返回格式!');
					}
				}
			})

		},
		relaunchedClose: function() {
			this.relaunchedVisible = false;
			this.deptStaffInfovalue = '';
			this.deptStaffDtosvlaue = '';
			this.woTypesvalue = '';
			this.billtextarea = '';
			this.titleValue = '';
			this.radio = '';
		},
		getbilltypeandhandles: function() {
			if (this.deptStaffInfo == null || this.radio == '') {
				this.$api.server.getWOTypeAndDeptInfo().then(res => {
					if (res.status == 10000) {
						this.deptStaffInfo = res.data.deptStaffInfo;
						this.woTypes = res.data.woTypes;
						this.getbillform();
					} else {
						if(res.status == 30000){
							this.$message.error(res.message);
						}else{
							this.$message.error('未能接收到规定的Josn返回格式!');
						}
					}
				})
			}
		},
		getbillform: function() {
			let _that = this;
			this.$api.server.reLaunchWorkOrder(this.WOInfo.code, ).then(res => {
				if (res.status == 10000) {
					if(this.PassedVisible ==false){
						this.woTypesvalue = res.data.type;
						this.billtextarea = res.data.content;
						this.titleValue = res.data.title;
						this.radio = res.data.priority;
						this.deptStaffInfovalue = res.data.deptId;
						this.deptStaffInfovaluefun(this.deptStaffInfovalue);
						this.deptStaffDtosvlaue = res.data.handlerId;
					}
					
				} else {
					if(res.status == 30000){
						this.$message.error(res.message);
					}else{
						this.$message.error('未能接收到规定的Josn返回格式!');
					}
				}
			})
		},
		showchartDetailchange() {
			this.showchartDetail = true;
			this.$nextTick(function(){
				this.$refs.chartDetail.getchartdata (this.WOInfo.chatId);
			})
			
		},
		colseshowchartDetail: function() {
			this.showchartDetail = false;
		},
	}
}
