import {publicmethod} from '../../utils/publicmethod.js'
import chartDetail from 'components/chartDetail/chartDetail.vue';
import {mapMutations} from 'vuex';
export default {
	name: 'serviceRecord',
	components: {
		chartDetail:chartDetail
	},
	data() {
		return {
			selectInput: '',
			affirmedselectInput:'',
			tableData: [],
			/* 当前页面 */
			pageindex:1,
			/*每页条数  */
			pagesize:13,
			total: 0,
			rows:13,
			/* 以下部分聊天详情数据 */
			showchartDetail: false,
			/*服务记录聊天详情 */
			chartlistdata: [],
			/* 列表加载提示 */
			loading:false,

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
			this.getdata(this.pageindex, this.affirmedselectInput,this.rows);
		},
		change:function(page) {
			this.pageindex=page;
			this.getdata(this.pageindex,this.affirmedselectInput,this.rows);
		},
		inputchange:function() {
			if(this.selectInput.replace(/ /g,'')==''){
				this.$message('请输入搜索的内容');
				return;
			}
			this.affirmedselectInput =this.selectInput;
			this.pageindex=1;
			this.getdata(this.pageindex,this.affirmedselectInput,this.rows);
		},
		clearIntput:function(){
			this.selectInput='';
			if(this.affirmedselectInput == ''){
				  return;
			}
			this.affirmedselectInput='';
			this.pageindex=1;
			this.getdata(this.pageindex,this.affirmedselectInput,this.rows);
		},
		getdata:function(pageindex,selectInput,rows){
			this.showchartDetail = false;
			this.SETLOAD(true);
			this.$api.server.servicerecord(pageindex,selectInput,rows).then(res => {
				if(res.status==10000){
					this.tableData = res.data.data;
					this.total=res.data.iTotalRecords;
					      this.$nextTick(() => {
								this.SETLOAD(false);
					      });
				}else{
					   this.SETLOAD(false);
					if(res.status == 30000){
						this.$message.error(res.message);
					}else{
						this.$message.error('未能接收到规定的Josn返回格式!');
					}
				}
			})
		},
		showchartDetailchange(charId) {
			this.showchartDetail = true;
			this.$nextTick(function(){
				this.$refs.chartDetail.getchartdata (charId);
			})
			
		},
		colseshowchartDetail: function() {
			this.showchartDetail = false;
		},
		rowstyle:function(){
			return {
				'background':'#FFFFFF',
			}
		}
	},
}
