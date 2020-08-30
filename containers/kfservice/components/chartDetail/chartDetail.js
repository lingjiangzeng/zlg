import {
	publicmethod
} from '../../utils/publicmethod.js';
import {
	mapGetters,
} from 'vuex';
import $ from 'jquery';
export default {
	name: 'chartDetail',
	data() {
		return {
			chartDetailloading: false,
			chartlistdata: [],
			serviceTime: 'YYYY-MM-DD HH:MM:SS',
			finishTime: 'YYYY-MM-DD HH:MM:SS',
			srcList: [],
		}
	},
	computed: {
		...mapGetters('serverModule', ['icondata'])
	},
	methods: {
		/* 获取聊天信息记录 */
		getchartdata: function(chatId) {
			this.chartDetailloading = true;
			this.passto = false;
			this.$api.server.serviceRecordDetail(chatId).then(res => {
				if (res.status == 10000) {
					this.chartlistdata = res.data;
					this.serviceTime = res.data.serviceTime;
					this.finishTime = res.data.finishTime;
					this.$nextTick(() => {
						setTimeout(() => {
							this.$el.querySelector('#windowdeatil' + chatId).scrollIntoView();
							this.chartDetailloading = false;
						}, 50)
					})
				} else {
					this.chartDetailloading = false;
					if (res.status == 30000) {
						this.$message.error(res.message);
					} else {
						this.$message.error('未能接收到规定的Josn返回格式!');
					}
				}

			})
		},
		/* 关闭聊天信息记录弹窗 */
		colseshowchartDetail: function() {
			this.$parent.colseshowchartDetail();
		},
		/* 表情解析方法 */
		analysis: function(text) {
			return publicmethod.expression(text, this);
		},
		/* 图片预览方法 */
		pictrueview: function(url) {
			this.srcList = [];
			this.srcList.push(url);
		},
	}
}
