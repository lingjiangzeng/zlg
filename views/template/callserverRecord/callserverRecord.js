import calldetail from 'components/calldetail/calldetail.vue';
import {publicmethod} from '../../utils/publicmethod.js';
import {mapMutations} from 'vuex';
export default{
	name:'callserverRecord',
	components: {
		calldetail: calldetail,
	},
	data(){
		return{
			selectInput:'',
			affirmedselectInput:'',
			tableData:[],
			selectInput:'',
			total:0,
			pagesize:12,
			pageindex:1,
			calldetail:false,
			row:12,
			
		}
	},
	created(){
		
	},
	mounted(){
		publicmethod.backlogin(this) ? this.init() : null;
	},
	methods:{
		...mapMutations('serverModule', {
			SETLOAD:'SETLOAD',
		}),
		init:function(){
			this.getcallserverRecorddata(0,this.affirmedselectInput,this.pageindex,this.row);
		},
		clearIntput: function() {
			this.selectInput = '';
			if(this.affirmedselectInput == ''){
				  return;
			}
			this.affirmedselectInput = '';
			this.pageindex=1;
			this.getcallserverRecorddata(0,this.affirmedselectInput,this.pageindex,this.row);
			
		},
		inputchange: function() {
			if(this.selectInput.replace(/ /g,'')==''){
				this.$message('请输入搜索的内容');
				return;
			}
			this.affirmedselectInput = this.selectInput;
			this.pageindex=1;
			this.getcallserverRecorddata(0,this.affirmedselectInput,this.pageindex,this.row);
		},
		change:function(page){
			this.pageindex = page;
			this.getcallserverRecorddata(0,this.affirmedselectInput,this.pageindex,this.row);
		},
		showcalldetail:function(chCallin){
			this.calldetail=true;
			this.SETLOAD(true);
			this.$nextTick(() => {
				 setTimeout(()=>{
					  this.$refs.calldetail.getcalldetail(chCallin);
				 },300)
			    
			 })
		},
		closecalldetail:function(){
			this.calldetail=false;
		},
		getcallserverRecorddata:function(isToday,selectValue,page,rows){
			this.SETLOAD(true);
			this.$api.server.callList(isToday,selectValue,page,rows).then(res => {
				if(res.status == 10000){
					this.total=res.data.iTotalRecords;
					this.tableData=res.data.data;
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
				
			});
		}
	}
}