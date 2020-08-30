import workorderdetail from 'components/workorderdetail/workorderdetail.vue';
import {
	mapMutations,
} from 'vuex';
export default {
	name: "calldetail",
	components: {
		workorderdetail: workorderdetail,
	},
	data() {
		return {
			workorderdetail: false,
			loading: false,
			UserInfo: {},
			customerWOInfo: [],
			callInfo: {},
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
			chCallin: null,
		}
	},
	created() {},
	mounted() {},
	methods: {
		...mapMutations('serverModule', {
			SETLOAD: 'SETLOAD',
		}),
		/* 获取呼叫详情数据的方法 */
		getcalldetail: function(chCallin) {
			//打开全局Loading加载动画
			this.SETLOAD(true);
			this.chCallin = chCallin;
			this.$api.server.callCenterdetail(chCallin, 0).then(res => {
				if (res.status == 10000) {//res.status 为10000后端返回数据成功
					//把获取到的数据渲染到页面
					this.UserInfo = res.data.UserInfo;
					this.customerWOInfo = res.data.customerWOInfo;
					this.callInfo = res.data.callInfo;
					this.$refs.audio.src = this.callInfo.soundUrl;
					//页面渲染完成时才关闭全局Loading加载动画
					this.$nextTick(() => {
						this.SETLOAD(false);
					});
				} else {
					//res.status 不是一万的处理
					this.back();
					this.SETLOAD(true);
					if (res.status == 30000) {
						this.$message.error(res.message);
					} else {
						this.$message.error('未能接收到规定的Josn返回格式!');
					}

				}

			});
		},
		///关闭呼叫详情方法
		back: function() {
			this.$parent.closecalldetail();
		},
		//打开工单详情方法
		showbillDetail: function(code, userId) {
			this.workorderdetail = true;
			this.SETLOAD(true);
			this.$nextTick(() => {
				setTimeout(() => {
					this.$refs.workorderdetail.getDetaildata(code, userId, '1');
				}, 300)
			});
		},
		//关闭工单详情方法
		closeworkorderdetail: function() {
			this.workorderdetail = false;
			this.getcalldetail(this.chCallin);
		},
		//打开创建工单的表单
		relaunched: function() {
			this.relaunchedVisible = true;
			this.deptStaffInfovalue = '';
			this.deptStaffDtosvlaue = '';
			this.woTypesvalue = '';
			this.billtextarea = '';
			this.titleValue = '';
			this.radio = '';
			this.getbilltypeandhandles();
		},
		//创建工单提交工单信息方法
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
					this.getcalldetail(this.chCallin);
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
		/* 关闭创建工单方法 */
		relaunchedClose: function() {
			this.relaunchedVisible = false;
			this.deptStaffInfovalue = '';
			this.deptStaffDtosvlaue = '';
			this.woTypesvalue = '';
			this.billtextarea = '';
			this.titleValue = '';
			this.radio = '';
		},
		//获取创建工单需要的信息
		getbilltypeandhandles: function() {
			if (this.deptStaffInfo == null) {
				this.$api.server.getWOTypeAndDeptInfo().then(res => {
					if (res.status == 10000) {
						this.deptStaffInfo = res.data.deptStaffInfo;
						this.woTypes = res.data.woTypes;
					} else {
						if (res.status == 30000) {
							this.$message.error(res.message);
						} else {
							this.$message.error('未能接收到规定的Josn返回格式!');
						}
					}
				})
			}
		},
		//下拉部分筛选方法
		deptStaffInfovaluefun: function(e) {
			let _that = this;
			this.deptStaffDtosvlaue = '';
			this.deptStaffInfo.forEach(function(value, index) {
				if (value.deptCode == e) {
					_that.deptStaffDtos = value.deptStaffDtos;
				}
			})
		},

	}
}
