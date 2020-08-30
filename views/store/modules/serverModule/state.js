
const state = {
	zuixinnews:null,
	someObj: null, 
	websockitsendmsg:null,
	userInfo:null,
	businesstype:null,
	path:null,
	callwindow:{
		ifshow:3, /* 1 待接通中 2通话中  3 通话结束 默认未3*/
		phone:'',
		time:0,
		timestr:'00:00:00',
		timer:null,
		username:'',
		imgurl:'',
		chCallin:'',
	},
	windowsize:null,
	allloading:false,
	openuserchart:null,

}

export default state