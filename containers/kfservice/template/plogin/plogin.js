export default {
	name: "plogin",
	data() {
		return {}	
	},
	created() {
		if (document.domain == 'wetest.baoyitech.com.cn' || document.domain == 'mp.baoyitech.com.cn') { //阿里云服务器
			this.getOpenid();
		} else{
			localStorage.setItem('wxopenId', 'orDrnt6V-G93ehsrPHQiSjbc66v4');
			this.pLogin();
		}
	},
	mounted() {},
	methods: {
		// 移动端获取openId
		getOpenid: function () {
			let appid;
			if (document.domain == 'wetest.baoyitech.com.cn') { //阿里云测试服务器
				appid = 'wx51427e73dc14ac70';
			} else if (document.domain == 'mp.baoyitech.com.cn') { //正式服
				appid = 'wxbc615258558f9058';
			}else{
				appid = 'wx51427e73dc14ac70';
			}
			/*获取code*/
			let code = this.$route.query.code; //获取链接参数code
			let param = {};
			param.code = code;
			if (code) { //如果code存在，则请求api获取openid
				this.$api.server.pgetOpenId(param).then(res => {
					if (res.status == 10000) {
						localStorage.setItem('wxopenId', res.data.openId);
						this.pLogin();
					} else {
					}
				});
			} else { //如果code不存在，则重定向获取code
				let urlS = '';
				if (window.location.href.split('?')[1]) {
					urlS = '?' + window.location.href.split('?')[1];
				}
				let urlStr = window.location.origin + '/h5/kfservice/plogin' + urlS;
				let redirect_uri = encodeURIComponent(urlStr);
				let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_base&state=STATE';
				window.location.href = url;
			}
		},

		/// 移动端登录
		pLogin: function () {
			this.$api.server.pLogin().then(res => {
				if (res.status == 10000) {
					sessionStorage.setItem("userName", res.data.adminName);
					sessionStorage.setItem("adminId", res.data.adminId);
					sessionStorage.setItem("headerimg", res.data.headImgUrl);
					sessionStorage.setItem("selectValue", '在线');
					let param = {};
					param.userId = this.$route.query.userId;
					param.recordId = this.$route.query.recordId;
					this.$router.push({
						path: '/Mobilechat',
						query: param
					})
				} else if (res.status == 30000) {
					this.error = res.message;
				}
			});
		}
	}

}