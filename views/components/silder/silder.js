import {mapGetters,mapMutations} from 'vuex'
import {publicmethod} from '../../utils/publicmethod.js';
export default {
	name: "silder",
	data() {
		return {
			meunListData: [{
				title: '消息中心',
				index: '1',
				icon: require('../../assets/charticon.png'),
				display:true,
				secondlyLevel: [{
					active:false,
					title: '聊天会话',
					index: 'chart',
					display:sessionStorage.getItem("vuex") ? (JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.isLeaveMsgRole == 0 || JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.isLeaveMsgRole == 2) ? true : false:true,
				}, {
					active:false,
					title: '服务记录',
					index: 'serviceRecord',
					display:true,
				},{
					active:false,
					title: '留言管理',
					index: 'leaveword',
					display:sessionStorage.getItem("vuex") ? (JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.isLeaveMsgRole == 1 || JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.isLeaveMsgRole == 2) ? true : false:true,
				},
				 ]
			},
			{
				title: '工单管理',
				index: '2',
				icon: require('../../assets/gogndna.png'),
				display:true,
				secondlyLevel: [
					{
					active:false,
					title: '全部工单',
					index: 'allworkordermanagement',
					display:sessionStorage.getItem("vuex") ? JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.isKFLeader == 1 ? true : false:true,
				}, {
					active:false,
					title: '我创建的',
					index: 'Istarted',
					display:true,
				},
				{
					active:false,
					title: '我处理的',
					index: 'Idealwith',
					display:true,
				},
				 ]
			},
			{
				title: '质检管理',
				index: '3',
				icon: require('../../assets/zhiliang.png'),
				display:true,
				secondlyLevel: [
					{
					active:false,
					title: '质量检测',
					index: 'allqualitytest',
					display:true,
					},
				 ]
			},
			{
				title: '呼叫中心',
				index: '4',
				icon: require('../../assets/meunphone.png'),
				display:true,
				secondlyLevel: [
					{
					active:false,
					title: '呼叫中心',
					index: 'callenter',
					display:true,
					},
					{
					active:false,
					title: '呼叫记录',
					index: 'callserverRecord',
					display:true,
					},
				 ]
			},
			 ],
		paths: '',
		}
	},
	created() {
	},
	mounted() {
		publicmethod.backlogin(this) ? this.init() : null;
	},
	computed: {
		...mapGetters('serverModule', ['path','userInfo'])
	},
	methods: {
		...mapMutations('serverModule', {
			SETPATH: 'SETPATH',
		}),
		init:function(){
			this.showmeun();
		},
		choiceMeun: function(index) {
			this.SETPATH(index);
		},
		showmeun:function(){
			if(this.userInfo.isLeaveMsgRole == 1){
				this.SETPATH('serviceRecord');
				this.$router.replace({
					name:'serviceRecord',
				});
			}
			
			this.paths = this.path == null ? 'chart' : this.path;
			this.meunListData.forEach((value,index)=>{
				value.secondlyLevel.forEach((value,index)=>{
					if(value.index == this.paths){
						value.active=true;
					}else{
						value.active=false;
					}
				})
			})
		}
		
	},
	watch: {
		path: function(news, olds) {
				this.paths=news;
				this.meunListData.forEach((value,indexs)=>{
					value.secondlyLevel.forEach((value,indexs)=>{
						if(value.index == news){
							value.active=true;
						}else{
							value.active=false;
						}
					})
				})
				this.$router.replace({
					name: news
				});
			
		}
	}
}
