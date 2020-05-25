import imChat from 'components/server_io/imChat.vue';
import chartList from '../../components/chartList/chartList.vue';
import {publicmethod} from '../../utils/publicmethod.js';
import workorderdetail from 'components/workorderdetail/workorderdetail.vue';
import {mapGetters,mapMutations} from 'vuex';
export default {
	components: {
		chartList:chartList,
		imChat:imChat,
		workorderdetail:workorderdetail,
	},
	name: "chart",
	data() {
		return {
			workorderdetail:false,
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
			SETOPENSUERCHART:'SETOPENSUERCHART',
		}),
		init:function(){
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
			 this.$refs.imChatfun.showbillfun(true);
		},
	},
	computed: {
		...mapGetters('serverModule', ['someObj','windowsize']),
	},
	watch: {
		someObj(news, olds) {
			if (news != null) {
				this.SETLOAD(true);
				this.SETOPENSUERCHART(this.someObj.userId);
				this.$refs.imChatfun.changuserinfo(this.someObj);
			}
		},
},
}
