import {mapMutations} from 'vuex';
export default {
	name: "login",
	data() {
		return {
			form: {
				name: '',
				password: '',
			},
			loading: '加载中',
			businesstype: [],
			ifselectbox: false,

		}
	},
	created() {
		sessionStorage.clear();
		this.getbusiness();
	},
	mounted() {},
	methods: {
		...mapMutations('serverModule', {
			SETUSERINFO: 'SETUSERINFO',
			SETBUSINESSTYPE: 'SETBUSINESSTYPE',
		}),
		onSubmit() {
			if (this.loading != '') {
				return;
			}
			let businessIds = [];
			this.businesstype.forEach(function(value, index) {
				if (value.checked == true) {
					businessIds.push(value.bussinessId);
				}
			})
			if (this.form.name == '') {
				this.$message.warning('请输入用户名!');
				return;

			}
			if (this.form.password == '') {
				this.$message.warning('请输入密码!');
				return;
			}
			this.loading = '登录中';
			this.$api.server.login(this.form.name, this.form.password, businessIds.join(',')).then(res => {
        let data= {
          id: 1,
          imgUrl:'',
          userName:'哈药六厂',
          status:1,
          onlinestatus: 1,
          openId:'',
          isLeaveMsgRole: 2,
          isKFLeader: 1
        }
        this.loading = '';
        data.onlinestatus = 1;
        this.SETUSERINFO(data);
        this.SETBUSINESSTYPE(this.businesstype);
        this.$router.replace({
        	name: 'chart'
        });
				// if (res.status == 10000) {
				// 	this.loading = '';
				// 	res.data.onlinestatus = 1;
				// 	this.SETUSERINFO(res.data);
				// 	this.SETBUSINESSTYPE(this.businesstype);
				// 	this.$router.replace({
				// 		name: 'chart'
				// 	});
				// } else{
				// 	this.loading = '';
				// 	if(res.status == 30000){
				// 		this.$message.error(res.message);
				// 	}else{
				// 		this.$message.error('未能接收到规定的Josn返回格式!');
				// 	}
					
				// }
			})

		},
		selectedfun: function(indexs) {
			if (this.businesstype[indexs].checked) {
				this.businesstype[indexs].checked = false;
			} else {
				this.businesstype[indexs].checked = true;
			}
		},
		mousemovefun: function(e) {
			e = window.event || e;
			e.preventDefault();
			this.ifselectbox = true;

		},
		mouseleavefun: function(e) {
			e = window.event || e;
			e.preventDefault();
			this.ifselectbox = false;
		},
		getbusiness: function() {
			let _that = this;
			this.$api.server.getAllBusiness().then(res => {
				if (res.status == 10000) {
					this.loading = '';
					res.data.forEach(function(value, index) {
						value.checked = false;
						_that.businesstype.push(value);
					})
				} else {
					this.loading = '';
					this.$message.error('未能获取业务信息,请刷新一下');
				}

			})
		}
	}

}
