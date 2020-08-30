export default {
	name: 'allqualitytest',
	data() {
		return {
			statusTba: [{label: '全部',actived: true,},{label: '已质检',actived: false,},{label: '未质检',actived: false,}],
			statusTbaindex: 0,
			tableData: [
				{id: '1',founder: '马伟城',	creationtime: '2019-12-11 15:30',servicetime: '30分钟',user: '马伟城',grade: '5',},
				{id: '1',founder: '马伟城',	creationtime: '2019-12-11 15:30',servicetime: '30分钟',user: '马伟城',grade: '5',},
				 ],
			allqualitytestloading:false,
			pageindex:1,
			pagesize:10,
			total: 100,
			selectInput: '',
			options: [{value: '选项1',label: '黄金糕'}, ],
			value: '',
			value2: '',
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
			showdetail:false,
			detailloading:'',
			chartlistdata: [],
			percentage: 90,
			format(percentage) {
				return percentage;
			},
			scoringruleslist:[
				{
				icon:require('../../assets/score3.png'),
				title:'攻击客户',
				detail:'回复内容夹带粗言秽语等..',
				number:'10'
				},
				{
				icon:require('../../assets/score1.png'),
				title:'不回复',
				detail:'长时间搁置客户提出的问题等...',
				number:'10'
				},
				{
				icon:require('../../assets/score2.png'),
				title:'服务语气',
				detail:'服务态度不端正等.....',
				number:'10'
				}
			],
			textarea2:'',
			
		}
	},
	created() {
	},
	methods: {
		statusTbafun: function(index) {
			this.statusTba[index].actived = true;
			this.statusTba[this.statusTbaindex].actived = false;
			this.statusTbaindex = index;
		},
		change: function() {

		},
		clearIntput: function() {
			this.selectInput = '';
		},
		inputchange: function() {

		},
		showallqualitytestDetail: function(id) {
			this.showdetail = true;
			this.detailloading = '正在加载详情内容...';
			this.detailloading = '';
		},
		closeshowdetail: function() {
			
			this.showdetail = false;
		},
		datechange:function(e){
			
		}
	}
}
