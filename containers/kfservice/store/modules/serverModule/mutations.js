import * as types from './mutations-types'
import {
	stat
} from 'fs';

const mutations = {
	[types.SETZUINNEWS](state, data) {
		state.zuixinnews = data;
	},
	[types.SET_SOMEOBJ](state, obj) {
		state.someObj = obj;
	},
	[types.SET_WEBSOCKITSENDMSF](state, obj) {
		state.websockitsendmsg = obj;
	},
	[types.SETUSERINFO](state, obj) {
		state.userInfo = obj;
	},
	[types.SETBUSINESSTYPE](state, arr) {
		state.businesstype = arr;
	},
	[types.SETPATH](state, str) {
		state.path = str;
	},
	[types.RESTATUS](state) {
		state.callwindow.timer !=null ? clearInterval(state.callwindow.timer) :null
		state.zuixinnews = null;
		state.someObj = null;
		state.websockitsendmsg = null;
		state.userInfo = null;
		state.businesstype = null;
		state.path = null;
		state.callwindow.ifshow=3;
		state.callwindow.phone='';
		state.callwindow.time=0;
		state.callwindow.timestr='00:00:00';
		state.callwindow.timer=null;
		state.callwindow.username='';
		state.callwindow.imgurl='';
		state.callwindow.chCallin='';
		state.windowsize = null;
		state.allloading = false;
		state.openuserchart =null;
		
		
	},
	[types.SETCALLTIME](state,obj) {
		clearInterval(state.callwindow.timer);
		
			state.callwindow.ifshow=obj.ifshow;
			state.callwindow.phone=obj.phone;
			state.callwindow.time=obj.callTime;
			state.callwindow.timestr='00:00:00';
			state.callwindow.timer=null;
			state.callwindow.username=obj.name;
			state.callwindow.imgurl=obj.headImg;
			state.callwindow.chCallin=state.callwindow.chCallin == '' ? obj.chCallin : state.callwindow.chCallin;
			
			
			state.callwindow.timer=setInterval(()=>{
			state.callwindow.time=state.callwindow.time+1;
			let hour = parseInt(state.callwindow.time / 3600);
			let handletime = parseInt(state.callwindow.time / 60);
			let handletimes = parseInt(state.callwindow.time % 60);
			let hours = hour < 10 ? '0' + hour : hour;
			let Minutes = handletime < 10 ? '0' + handletime : handletime;
			let seconds = handletimes < 10 ? '0' + handletimes : handletimes;
			state.callwindow.timestr =hours + ':' + Minutes + ':' + seconds;
		},1000)
	},
	[types.COSLESETCALLTIME](state) {
			clearInterval(state.callwindow.timer);
			state.callwindow.ifshow=3;
			state.callwindow.phone='';
			state.callwindow.time=0;
			state.callwindow.timestr='00:00:00';
			state.callwindow.timer=null;
			state.callwindow.username='';
			state.callwindow.imgurl='';
			state.callwindow.chCallin='';
			
	},
	[types.SETWINDOWSIZE](state,number) {
		state.windowsize=number;
	},
	[types.SETLOAD](state,bolean) {
		state.allloading=bolean;
	},
	[types.SETOPENSUERCHART](state,Id) {
		state.openuserchart=Id;
	},

}

export default mutations
