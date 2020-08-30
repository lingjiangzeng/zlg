import Vue from 'vue';
import Vuex from 'vuex';
import server from '../request/api/Server.js';
Vue.use(Vuex);
export const imServerStore = new Vuex.Store({
	state: {
		chartList: [],
		indexs: 'a-b-c',
		timer:null,
	},
	getters: {
		
		getchartList: (state) => (userId) => {
			let weizhi = 0;
			let indexs = 0;
			let chartId = 0;
			state.chartList[0].list.forEach(function(value, index) {
				if (value.userId == userId) {
					weizhi = 1;
					indexs = index;
					chartId = value.chatId;
				}
			})
			state.chartList[1].list.forEach(function(value, index) {
				if (value.userId == userId) {
					weizhi = 2;
					indexs = index;
					chartId = value.chatId;
				}
			})
			if (weizhi == 0) {
				return false;
			} else if (weizhi == 1) {
				return '0-' + chartId + '-' + indexs;

			} else if (weizhi == 2) {
				return '1-' + chartId + '-' + indexs;
			}
		},
	},
	mutations: {
		chartList(state, chartList) {
			state.chartList = chartList;
		},
		changechartList(state, str) {
			let No = str.split('-');
			let NOs = state.indexs.split('-');
			state.indexs = str;
			if (NOs[0] == 'a') {
				state.chartList[No[0]].list[No[2]].selected = true;
				
				/* 选中默认已经阅读消息，未读消息数量设置为0 */
				state.chartList[No[0]].list[No[2]].messageaccount = 0;
				
				state.chartList[No[0]].list[No[2]].sendStatus = 2;

			} else {
				state.chartList[0].list.forEach(function(value, index) {
					value.selected = false;
				})
				state.chartList[1].list.forEach(function(value, index) {
					value.selected = false;
				})
				state.chartList[No[0]].list[No[2]].selected = true;
				
				/* 选中默认已经阅读消息，未读消息数量设置为0 */
				state.chartList[No[0]].list[No[2]].messageaccount = 0;
				
				state.chartList[No[0]].list[No[2]].sendStatus = 2;
			}
		},
		addchartList(state, addchartList) {
			if (state.chartList.length <= 0) {
				return;
			}
			let NO = state.indexs.split('-');
			let weizhi = 0;
			state.chartList[0].list.forEach(function(value, index) {
				if (value.userId == addchartList.userId) {

					weizhi = 1;
					value.sendStatus = addchartList.sendStatus;
					value.sendTime = addchartList.sendTime;
					value.content = addchartList.content;
					value.chatStatus = addchartList.chatStatus;
					value.contentType = addchartList.contentType;
					
					/* 当后端推过的 sendStatus 为1时表示消息已读(打开正是当但该客户的会话) 不设置消息数量 反之消息数量累加*/
					if(value.sendStatus == 1){
						value.messageaccount+=1;
					}
					
					if (addchartList.timer == 0) {
						value.time = '00 分 00 秒';
						value.timer = 0;
					} else {
						value.timer = addchartList.timer;
						let handletime = parseInt(value.timer / 60);
						let handletimes = parseInt(value.timer % 60);
						let Minutes = handletime < 10 ? '0' + handletime : handletime;
						let seconds = handletimes < 10 ? '0' + handletimes : handletimes;
						value.time = Minutes + ' 分 ' + seconds + ' 秒 ';

					}
				}
			})
			state.chartList[1].list.forEach(function(value, index) {
				if (value.userId == addchartList.userId) {
					let chatId = value.chatId;
					weizhi = 1
					if (NO[0] == 0) {
						state.indexs = NO[0] + '-' + NO[1] + '-' + (Number(NO[2]) + 1);
					} else if (NO[0] == 1) {
						if (NO[2] == index) {
							state.indexs = '0-' + chatId + '-0';
						} else {
							if (NO[2] != 0) {
								state.indexs = NO[0] + '-' + NO[1] + '-' + (Number(NO[2]) - 1);
							}
						}
					}
					value.sendStatus = addchartList.sendStatus;
					value.sendTime = addchartList.sendTime;
					value.content = addchartList.content;
					value.chatStatus = addchartList.chatStatus;
					value.contentType = addchartList.contentType;
					
					/* 当后端推过的 sendStatus 为1时表示消息已读(打开正是当但该客户的会话) 不设置消息数量 反之消息数量累加*/
					if(value.sendStatus == 1){
						value.messageaccount+=1;
					}
					
					if (addchartList.timer == 0) {
						value.time = '00 分 00 秒';
						value.timer = 0;
					} else {
						value.timer = addchartList.timer;
						let handletime = parseInt(value.timer / 60);
						let handletimes = parseInt(value.timer % 60);
						let Minutes = handletime < 10 ? '0' + handletime : handletime;
						let seconds = handletimes < 10 ? '0' + handletimes : handletimes;
						value.time = Minutes + ' 分 ' + seconds + ' 秒 ';

					}
					state.chartList[0].list.unshift(value);
					state.chartList[1].list.splice(index, 1);
				}
			})
			if (weizhi == 0) {
				if (NO[0] == 0) {
					state.indexs = NO[0] + '-' + NO[1] + '-' + (Number(NO[2]) + 1);
				}
				if (addchartList.chatStatus >= 3) {
					addchartList.selected = false;
					if (addchartList.timer == 0) {
						addchartList.time = '00 分 00 秒';
						addchartList.timer = 0;
					} else {
						let handletime = parseInt(addchartList.timer / 60);
						let handletimes = parseInt(addchartList.timer % 60);
						let Minutes = handletime < 10 ? '0' + handletime : handletime;
						let seconds = handletimes < 10 ? '0' + handletimes : handletimes;
						addchartList.time = Minutes + ' 分 ' + seconds + ' 秒 ';
					}
					
					/*当前情况是新进来的会话 消息未读默认前端先设置为 1 具体数量需后端 推送*/
					addchartList.messageaccount =1;
					
					state.chartList[1].list.unshift(addchartList);
				} else {/* 做法合理 */
					if (addchartList.senderType == 2) {
						server.getusermsg(addchartList.userId).then(res => {
							if (res.status == 10000) {
								addchartList.senderImg = res.data.userImg;
								addchartList.senderName = res.data.userName;
								addchartList.selected = false;
								state.chartList[0].list.unshift(addchartList);
							} else {
								addchartList.selected = false;
								state.chartList[0].list.unshift(addchartList);
							}
						});
					} else {
						addchartList.selected = false;
						state.chartList[0].list.unshift(addchartList);
					}
				}

			}
		},
		addendserver(state) {
			if (state.chartList.length <= 0) {
				return;
			}
			let NO = state.indexs.split('-');
			let chatId = state.chartList[NO[0]].list[NO[2]].chatId;
			state.indexs = '1-' + chatId + '-0';
			state.chartList[NO[0]].list[NO[2]].chatStatus = 3;
			/* 关闭计时 */
			state.chartList[NO[0]].list[NO[2]].sendStatus = 2;
			state.chartList[NO[0]].list[NO[2]].time = '00 分 00 秒';
			state.chartList[NO[0]].list[NO[2]].timer = 0;
			state.chartList[1].list.unshift(state.chartList[NO[0]].list[NO[2]]);
			state.chartList[0].list.splice(NO[2], 1);
		},
		updatalistchart(state, obj) {
			let NO = state.indexs.split('-');
			state.chartList[NO[0]].list[NO[2]].content = obj.content;
			state.chartList[NO[0]].list[NO[2]].contentType = obj.contentType;
			state.chartList[NO[0]].list[NO[2]].sendTime = obj.sendTime != undefined ? obj.sendTime : state.chartList[NO[0]].list[
				NO[2]].sendTime;
			/* 关闭计时 */
			state.chartList[NO[0]].list[NO[2]].sendStatus = 2;
			state.chartList[NO[0]].list[NO[2]].time = '00 分 00 秒';
			state.chartList[NO[0]].list[NO[2]].timer = 0;
		},
		updataliststatus(state, obj) {
			if (state.chartList.length <= 0) {
				return;
			}
			let NO = state.indexs.split('-');
			if (obj.chatStatus >= 3) {
				state.chartList[0].list.forEach(function(value, index) {
					if (value.userId == obj.userId) {
						let chatId = value.chatId;
						if (NO[0] == 0) {
							if (NO[2] == index) {
								state.indexs = '1-' + chatId + '-0';
							} else {
								if (NO[2] != 0) {
									state.indexs = NO[0] + '-' + NO[1] + '-' + (Number(NO[2]) - 1);
								}
							}
						} else if (NO[0] == 1) {
							state.indexs = NO[0] + '-' + NO[1] + '-' + (Number(NO[2]) + 1);
						}
						value.chatStatus = obj.chatStatus;
						value.time = '00 分 00 秒';
						value.timer = 0;
						state.chartList[1].list.unshift(value);
						state.chartList[0].list.splice(index, 1);
					}
				})
			} else if (obj.chatStatus < 3) {
				state.chartList[1].list.forEach(function(value, index) {
					if (value.userId == obj.userId) {
						let chatId = value.chatId;
						if (NO[0] == 0) {
							state.indexs = NO[0] + '-' + NO[1] + '-' + (Number(NO[2]) + 1);
						} else if (NO[0] == 1) {
							if (NO[2] == index) {
								state.indexs = '0-' + chatId + '-0';
							} else {
								if (NO[2] != 0) {
									state.indexs = NO[0] + '-' + NO[1] + '-' + (Number(NO[2]) - 1);
								}
							}
						}
						value.chatStatus = obj.chatStatus;
						if (value.timer != 0) {
							let handletime = parseInt(value.timer / 60);
							let handletimes = parseInt(value.timer % 60);
							let Minutes = handletime < 10 ? '0' + handletime : handletime;
							let seconds = handletimes < 10 ? '0' + handletimes : handletimes;
							value.time = Minutes + ' 分 ' + seconds + ' 秒 ';
						} else {
							value.time = '00 分 00 秒';
							value.timer = 0;
						}
						state.chartList[0].list.unshift(value);
						state.chartList[1].list.splice(index, 1);
					}
				})
			}
		},
		startcounting(state) {
			clearInterval(state.timer);
			state.timer = setInterval(() => {
				state.chartList[0].list.forEach(function(value, index) {
					if (value.timer != 0) {
						value.timer++;
						let handletime = parseInt(value.timer / 60);
						let handletimes = parseInt(value.timer % 60);
						let Minutes = handletime < 10 ? '0' + handletime : handletime;
						let seconds = handletimes < 10 ? '0' + handletimes : handletimes;
						value.time = Minutes + ' 分 ' + seconds + ' 秒 ';
					}
				})
			},1000)
		},
		resetstate(state){
			state.timer != null ? clearInterval(state.timer) : null;
			state.chartList=[];
			state.indexs='a-b-c';
			state.timer=null;
		}
	},
	actions: {
		chartList({
			commit
		}, chartList) {
			return new Promise(() => {
				commit('chartList', chartList)
			})

		},
		changechartList({
			commit
		}, str) {
			return new Promise(() => {
				commit('changechartList', str)
			})

		},
		addchartList({
			commit
		}, addchartList) {
			return new Promise(() => {
				commit('addchartList', addchartList)
			})
		},
		addendserver({
			commit
		}) {
			return new Promise(() => {
				commit('addendserver')
			})
		},
		updatalistchart({
			commit
		}, obj) {
			return new Promise(() => {
				commit('updatalistchart', obj)
			})
		},
		updataliststatus({
			commit
		}, obj) {
			return new Promise(() => {
				commit('updataliststatus', obj)
			})
		},
		startcounting({
			commit
		}) {
			return new Promise(() => {
					commit('startcounting')

			})
		},
		resetstate({
			commit
		}) {
			return new Promise(() => {
					commit('resetstate')
		
			})
		},
	},

});
