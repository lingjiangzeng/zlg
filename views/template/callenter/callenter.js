import {
	publicmethod
} from '../../utils/publicmethod.js';
import workorderdetail from 'components/workorderdetail/workorderdetail.vue';
import {
	mapGetters,
	mapMutations
} from 'vuex';
export default {
	name: 'callenter',
	components: {
		workorderdetail: workorderdetail,
	},
	data() {
		return {
			callDuration: '00:00:00',
			name: '林油价(算法计算框架双方的军事回复接口是否设计的)',
			phonenumber: '15897710005',
			todaycall: [],
			todaycallindex: null,
			UserInfo: {},
			customerWOInfo: [],
			callInfo: {},
			purchasedList: [],
			tableData: [],
			relaunchedVisible: false,
			deptStaffInfo: null,
			deptStaffInfovalue: '',
			deptStaffDtos: null,
			deptStaffDtosvlaue: '',
			woTypes: null,
			woTypesvalue: '',
			billtextarea: '',
			titleValue: '',
			radio: '',
			workorderdetail: false,
			chCallin: '',
		}
	},
	created() {
	},
	mounted() {
		publicmethod.backlogin(this) ? this.init() : null;
	},
	computed: {
		...mapGetters('serverModule', ['callwindow'])
	},
	methods: {
		...mapMutations('serverModule', {
			SETLOAD:'SETLOAD',
		}),
		init:function(){
			this.getcallcenterdata(1, '', '', '');
		},
		showbillDetail: function(code, userId) {
			this.workorderdetail = true;
			this.SETLOAD(true);
			this.$nextTick(() => {
				setTimeout(()=>{
					this.$refs.workorderdetail.getDetaildata(code, userId, '1');
				},300)
			});
		},
		closeworkorderdetail: function() {
			this.workorderdetail = false;
			this.getcalldetail(this.chCallin);
		},
		todaycallfun: function(index) {
			if(this.todaycallindex != null){
				this.todaycall[index].active = true;
				this.getcalldetail(this.todaycall[index].chCallin);
				this.todaycall[this.todaycallindex].active = false;
				this.todaycallindex = index;
			}else{
				this.todaycall[index].active = true;
				this.getcalldetail(this.todaycall[index].chCallin);
				this.todaycallindex = index;
			}
			
		},
		getcallcenterdata: function(isToday, selectValue, page, rows) {
			let _that = this;
			this.SETLOAD(true);
			this.$api.server.callList(isToday, selectValue, page, rows).then(res => {
				if (res.status == 10000) {
					if (res.data.data.length > 0) {
						if (_that.callwindow.ifshow == 3) {
							res.data.data.forEach((value, index) => {
								if (index == 0) {
									value.active = true;
									_that.getcalldetail(value.chCallin);
									_that.chCallin = value.chCallin;
									this.todaycallindex =0;
								} else {
									value.active = false;
								}
							})
						} else {
							res.data.data.forEach((value, index) => {
								value.active = false;
							})
							let _callwindow = JSON.parse(JSON.stringify(this.callwindow));
							this.getcalldetail(_callwindow.chCallin);
							this.chCallin = _callwindow.chCallin;
						}

					} else {
						if (this.callwindow.ifshow == 3) {
							this.SETLOAD(false);
						} else {
							let _callwindow = JSON.parse(JSON.stringify(this.callwindow));
							this.getcalldetail(_callwindow.chCallin);
							this.chCallin = _callwindow.chCallin;
						}
					}
					this.todaycall = res.data.data;
				} else {
					if (this.callwindow.ifshow != 3) {
						let _callwindow = JSON.parse(JSON.stringify(this.callwindow));
						this.getcalldetail(_callwindow.chCallin);
						this.chCallin = _callwindow.chCallin;
					} else {
						this.SETLOAD(false);
					}
					if(res.status == 30000){
						this.$message.error(res.message);
					}else{
						this.$message.error('未能接收到规定的Josn返回格式!');
					}
				}

			});
		},
		getcalldetail: function(chCallin) {
			if(chCallin == ''){
				return;
			}
			this.SETLOAD(true);
			this.chCallin = chCallin;
			this.$api.server.callCenterdetail(chCallin, 1).then(res => {
				if (res.status == 10000) {
					this.callInfo = res.data.callInfo;
					this.$refs.audio.src = this.callInfo.soundUrl;
					this.UserInfo = res.data.UserInfo;
					this.customerWOInfo = res.data.customerWOInfo;
					this.purchasedList = res.data.purchasedList;
					this.$nextTick(() => {
						this.SETLOAD(false);
					});
				} else {
					this.SETLOAD(false);
					if(res.status == 30000){
						this.$message.error(res.message);
					}else{
						this.$message.error('未能接收到规定的Josn返回格式!');
					}
				}

			});
		},


		/*-------创建工单代码块----- */
		relaunched: function() {
			this.relaunchedVisible = true;
			this.getbilltypeandhandles();
		},
		/* 提交工单表单 */
		relaunchedconfirm: function() {
			if (this.deptStaffInfovalue == '' || this.deptStaffDtosvlaue == '' || this.woTypesvalue == '' || this.billtextarea ==
				'' || this.titleValue == '' || this.radio == '') {
				this.$message.warning('请填写完成的信息!');
				return;
			}
			this.relaunchedVisible = false;
			this.SETLOAD(true);
			this.$api.server.addWorkOrder(this.woTypesvalue, this.radio, this.titleValue, this.billtextarea, this.UserInfo.userId,
				this.deptStaffDtosvlaue, '').then(res => {
				if (res.status == 10000) {
					this.$message.success('已经成功创建工单任务');
					this.SETLOAD(false);
					this.getcalldetail(this.chCallin);
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
		/* 工单表单关闭 */
		relaunchedClose: function() {
			this.relaunchedVisible = false;
			this.deptStaffInfovalue = '';
			this.deptStaffDtosvlaue = '';
			this.woTypesvalue = '';
			this.billtextarea = '';
			this.titleValue = '';
			this.radio = '';
		},
		/* 获取工单类型和处理人信息 */
		getbilltypeandhandles: function() {
			if (this.deptStaffInfo == null) {
				this.$api.server.getWOTypeAndDeptInfo().then(res => {
					if (res.status == 10000) {
						this.deptStaffInfo = res.data.deptStaffInfo;
						this.woTypes = res.data.woTypes;
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
		/* 转交/重现发起选择部门数据联动 */
		deptStaffInfovaluefun: function(e) {
			let _that = this;
			this.deptStaffDtosvlaue = '';
			this.deptStaffInfo.forEach(function(value, index) {
				if (value.deptCode == e) {
					_that.deptStaffDtos = value.deptStaffDtos;
				}
			})
		},
		/*------创建工单代码块------*/
	},
}
