import {publicmethod} from '../../utils/publicmethod.js';
import workorderdetail from 'components/workorderdetail/workorderdetail.vue';
import {mapMutations} from 'vuex';
export default {
	components: {
		workorderdetail: workorderdetail,
	},
	name:'allworkordermanagement',
	data() {
		return {
			tablabel:'未完成',
			tabBoxdata: [{label: '全部',value: 4,actiuve: false},
						{label: '未完成',value: 1,actiuve: true},
						{label: '已完成',value: 2,actiuve: false},
						{label: '已关闭',value: 3,actiuve: false},
						],
			oldindex: 1,
			tableData: [],
			pagesize:12,
			total:0,
			selectInput: '',
			affirmedselectInput:'',
			billtypevalue:'',
			billtype:[],
			datavalue:'',
			 pickerOptions: {
			          shortcuts: [{
			            text: '最近一周',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
			              picker.$emit('pick', [start, end]);
			            }
			          }, {
			            text: '最近一个月',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
			              picker.$emit('pick', [start, end]);
			            }
			          }, {
			            text: '最近三个月',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
			              picker.$emit('pick', [start, end]);
			            }
			          }]
			        },
			
			workorderdetail:false,
			/*每个工单页都有自己type 一直不变,tab 选项默认时全部*/
			type:3,
			status:1,
			/*当前页数 */
			pageindex:1,
			/*返回的条数*/
			rows:12,
			
			/* 创建工单 */
			relaunchedVisible: false,
			/* 部门 和 部门d id */
			deptStaffInfo: null,
			deptStaffInfovalue: '',
			/* 处理人  处理人id */
			deptStaffDtos: null,
			deptStaffDtosvlaue: '',
			/* 工单类型 类型id */
			woTypes: null,
			woTypesvalue: '',
			billtextarea: '',
			titleValue: '',
			radio:'',

		}
	},
	created() {
	},
	mounted() {
		publicmethod.backlogin(this) ? this.init() : null;
	},
	methods: {
		...mapMutations('serverModule', {
			SETLOAD:'SETLOAD',
		}),
		init:function(){
			this.getbilllist(this.type,this.status,this.affirmedselectInput,this.datavalue,this.billtypevalue,this.pageindex,this.rows);
		},
		actiuvetab: function(newindex,value) {
			if(newindex == this.oldindex ){
				return;
			}
			this.tabBoxdata[this.oldindex].actiuve = false;
			this.tabBoxdata[newindex].actiuve = true;
			this.oldindex = newindex;
			this.status=value;
			this.tablabel=this.tabBoxdata[newindex].label;
			this.selectInput = '';
			this.affirmedselectInput = '';
			this.datavalue = '';
			this.billtypevalue = '';
			this.pageindex = 1;
			this.getbilllist(this.type,this.status,this.affirmedselectInput,this.datavalue,this.billtypevalue,this.pageindex,this.rows);
		},
		change: function(page) {
			this.pageindex = page;
			this.getbilllist(this.type,this.status,this.affirmedselectInput,this.datavalue,this.billtypevalue,this.pageindex,this.rows);
		},
		clearIntput: function() {
			this.selectInput = '';
			if(this.affirmedselectInput == ''){
				  return;
			}
			this.affirmedselectInput = '';
			this.pageindex=1;
			this.getbilllist(this.type,this.status,this.affirmedselectInput,this.datavalue,this.billtypevalue,this.pageindex,this.rows);
		},
		inputchange: function() {
			if(this.selectInput.replace(/ /g,'')==''){
				this.$message('请输入搜索的内容');
				return;
			}
			this.affirmedselectInput = this.selectInput;
			this.pageindex = 1;
			this.getbilllist(this.type,this.status,this.affirmedselectInput,this.datavalue,this.billtypevalue,this.pageindex,this.rows);
		},
		datechange:function(e){
			this.pageindex = 1;
			this.datavalue = e;
			if(e==null){
				this.datavalue='';
			}
			this.getbilllist(this.type,this.status,this.affirmedselectInput,this.datavalue,this.billtypevalue,this.pageindex,this.rows);
		},
		billtypechange:function(e){
			this.pageindex = 1 ;
			if(e==null){
				this.billtypevalue='';
			}
			this.getbilllist(this.type,this.status,this.affirmedselectInput,this.datavalue,this.billtypevalue,this.pageindex,this.rows);
		},
		showbillDetail: function(code,userId) {
			this.workorderdetail = true;
			this.SETLOAD(true);
			this.$nextTick(() => {
				setTimeout(()=>{
					this.$refs.workorderdetail.getDetaildata(code,userId,this.type);
				},300)
			 });
		},
		closeworkorderdetail: function() {
			this.getbilllist(this.type,this.status,this.affirmedselectInput,this.datavalue,this.billtypevalue,this.pageindex,this.rows);
			this.workorderdetail = false;
		},
		resetlist:function(){
			this.tablabel='未完成';
			this.tabBoxdata.forEach(function(value,index){
				value.actiuve=false;
			});
			this.tabBoxdata[0].actiuve = true;
			this.oldindex = 0;
			this.selectInput = '';
			this.affirmedselectInput = '';
			this.billtypevalue = '';
			this.datavalue = '';
			this.status = 4;
			this.pageindex = 1;
			this.getbilllist(this.type,this.status,this.affirmedselectInput,this.datavalue,this.billtypevalue,this.pageindex,this.rows);
			this.workorderdetail = false;
		},
		getbilllist:function(type,status,selectValue,createTime,woType,page,rows){
			let createTimes = createTime==null ? '' : createTime;
			this.SETLOAD(true);
			this.$api.server.billlist(type,status,selectValue,createTimes,woType,page,rows).then(res => {
				if (res.status == 10000) {
					this.total=res.data.listData.iTotalRecords;
					this.tableData=res.data.listData.data;
					if(this.billtype.length<=0){
						this.billtype=res.data.woTypes;
					}
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
			this.$api.server.addWorkOrder(this.woTypesvalue, this.radio, this.titleValue, this.billtextarea, '',this.deptStaffDtosvlaue,'').then(res => {
				if (res.status == 10000) {
					this.$message.success('已经成功创建工单任务');
					this.SETLOAD(false);
					this.relaunchedClose();
				} else {
					this.SETLOAD(false);
					this.relaunchedClose();
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
