import workorderdetail from 'components/workorderdetail/workorderdetail.vue';
import {mapMutations,} from 'vuex';
export default {
	name: "calldetail",
	components: {
		workorderdetail: workorderdetail,
	},
	data() {
		return {
			workorderdetail:false,
			loading:false,
			UserInfo:{},
			customerWOInfo:[],
			callInfo:{},
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
			chCallin:null,
		}
	},
	created(){
	},
	mounted(){
	},
	methods: {
		...mapMutations('serverModule', {
			SETLOAD:'SETLOAD',
		}),
		getcalldetail:function(chCallin){
			this.SETLOAD(true);
			this.chCallin=chCallin;
			this.$api.server.callCenterdetail(chCallin,0).then(res => {
				if(res.status == 10000){
					this.UserInfo=res.data.UserInfo;
					this.customerWOInfo=res.data.customerWOInfo;
					this.callInfo=res.data.callInfo;
					this.$refs.audio.src = this.callInfo.soundUrl;
					this.$nextTick(() => {
						 this.SETLOAD(false);
					 });
				}else{
					this.back();
					this.SETLOAD(true);
					if(res.status == 30000){
						this.$message.error(res.message);
					}else{
						this.$message.error('未能接收到规定的Josn返回格式!');
					}
					
				}
				
			});
		},
		back:function(){
			this.$parent.closecalldetail();
		},
		showbillDetail: function(code,userId) {
			this.workorderdetail = true;
			this.SETLOAD(true);
			this.$nextTick(() => {
				setTimeout(()=>{
					this.$refs.workorderdetail.getDetaildata(code,userId,'1');
				},300) 
			 });
		},
		closeworkorderdetail: function() {
			this.workorderdetail = false;
			this.getcalldetail(this.chCallin);
		},
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
		relaunchedconfirm: function() {
			if (this.deptStaffInfovalue == '' || this.deptStaffDtosvlaue == '' || this.woTypesvalue == '' || this.billtextarea == '' || this.titleValue == '' || this.radio == '') {
				this.$message.warning('请填写完成的信息!');
				return;
			}
			this.relaunchedVisible = false;
			this.SETLOAD(true);
			this.$api.server.addWorkOrder(this.woTypesvalue, this.radio, this.titleValue, this.billtextarea,this.UserInfo.userId,this.deptStaffDtosvlaue,'').then(res => {
				if (res.status == 10000) {
					this.$message.success('已经成功创建工单任务');
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
