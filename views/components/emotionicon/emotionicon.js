import {publicmethod} from '../../utils/publicmethod.js'
export default {
	name: 'emotionicon',
	data() {
		return {
			icondata:[],
		}
	},
	created() {
		this.icondata = publicmethod.icondata;
	},
	methods: {
		myclick:function(items){
			this.$emit("emotionicon", items);
		}
	},
}