<template>
	<div :class="{imChatwrapper:true,imChatwrappersize:windowsize<=1100}">
		<!-- 聊天窗口头部栏  转交结束服务操作 -->
		<div class="chartbox">
		<header class="imChat-header">
			<div class="name"><span>{{Listdata.senderName}}</span></div>
			<div class="other-server">
				<span class="change-line" @click="changeServer" v-show="Listdata.chatStatus==1 ||Listdata.chatStatus==2"><img src="../../assets/deliverto.png"
					 alt="">转交</span>
				<span class="server" @click="EndServe()" v-show="Listdata.chatStatus==1 ||Listdata.chatStatus==2"><img src="../../assets/closechart.png"
					 alt="">结束服务</span>
			</div>
		</header>
		<!-- 聊天输入和显示框 -->
		<main class="imChat-main">
			<common-chat ref="commonchat"></common-chat>
		</main>
		<!-- 客户基本资料和工单 -->
		<div class="userinfo">
			<div class="showuserinfo">
				<!--基本资料和工单tab 选项 -->
				<div class="title">
					<!-- <div><span>客户资料</span></div> -->
					<div @click="showbillfun(false)" :class="{titleactvie:!showbill}" class="tab"><span>客户资料</span></div>
					<div @click="showbillfun(true)" :class="{titleactvie:showbill}" class="tab"><span>工单</span></div>
				</div>
				<!-- 客户基本资料 -->
				<div class="user" v-show="!showbill">
					<!-- 基本信息 -->
					<div class="userinfodata">
						<div class="titles"><span>顾客名片</span></div>
						<div class="content">
							<div class="label">
								<span class="list"><span class="mintitle">客户名</span><span class="msg">{{userMsg.userNickName!=undefined?userMsg.userNickName:''}}</span></span>
								<span class="list"><span class="mintitle">备注名</span><span class="msg" style="max-width:50%;" :title="userMsg.remark!=undefined?userMsg.remark:''">{{userMsg.remark!=undefined?userMsg.remark:''}}</span><span
									 class="msgs" v-on:click="revisedname">修改</span></span>
								<span class="list"><span class="mintitle">手机号</span><span class="msg">{{userMsg.userPhone!=undefined?userMsg.userPhone:''}}</span></span>
								<span class="list"><span class="mintitle">车牌号</span><span class="msg">{{userMsg.carPlateNo!=undefined?userMsg.carPlateNo:''}}</span></span>
								<span class="list"><span class="mintitle">服务记录</span><span class="msgs" v-on:click="showserverList">{{userMsg.serviceList!=undefined?userMsg.serviceList.length:''}}次</span></span>
							</div>
						</div>
					</div>
					<!-- 已购买的服务列表 -->
					<div class="userinfodata">
						<div class="titles">
							<span>已购服务</span>
						</div>
						<div class="content hiddenoverflow">
							<div class="label">
								<span class="list" v-for="(item,index) in userMsg.purchasedList!=undefined?userMsg.purchasedList:0" :key="'label'+index">
									<span class="mintitle">服务{{index+1}}</span>
										<span class="msg" :title="item.purchasedServiceName">{{item.purchasedServiceName}}</span>
								</span>
							</div>
						</div>
					</div>
				</div>
				<!-- 工单信息 -->
				<div class="bill" v-if="showbill" v-loading="billdataloading"  element-loading-background="rgba(255, 255, 255, 0.3)"  element-loading-text="加载中">
					<!-- 工单展示列表 -->
					<div class="billlistbox" v-if="ifbuildbill">
						<div class="billlist">
							<div class="listcontent" v-for="(items,indexs) in billlistdata" :key="'listcontent'+indexs" v-on:click="gotonbilldeatil(items.code,items.userId)">
								<div class="status">
									<span v-if="items.status==0">#未完成</span>
									<span v-if="items.status==1">#已完成</span>
									<span v-if="items.status==2">#已关闭</span>
								</div>
								<div class="content_rid">
									<div class="content" :title="items.content">
											<span>{{items.content}}</span>
									</div>
									<i class="el-icon-arrow-right"></i>
								</div>
								<div class="time_handler">
									<span class="time">{{items.createTime}}</span>
									<span class="handler">处理人:{{items.hanlder==null?'':items.hanlder}}</span>
								</div>
							</div>

						</div>
						<!-- 进入工单创建页面 -->
						<div class="buildbtn" v-on:click="fifbuildbillfun">
							<span>创建</span>
						</div>

					</div>
					<!-- 工单表单 -->
					<transition name="slide-fromBox">
						<div class="fromBox" v-if="!ifbuildbill">
							<div class="intputBox">
								<span class="frominputTitle">工单分类</span>
								<el-select v-model="woTypesvalue" placeholder="请选择工单分类" class="billType">
									<el-option v-for="item in woTypes" :key="item.dictKey" :label="item.dictValue" :value="item.id"> </el-option>
								</el-select>
							</div>
							<div class="intputBox">
								<span class="frominputTitle">标题</span>
								<el-input v-model="titleValue" placeholder="" class="billfrominputTitle"></el-input>
							</div>
							<div class="intputBox">
								<span class="frominputTitle">描述</span>
								<el-input type="textarea" :rows="4" placeholder="" v-model="billtextarea" class="billdescription"></el-input>
							</div>
							<div class="intputBox">
								<span class="frominputTitle">处理人</span>
								<el-select v-model="deptStaffInfovalue" placeholder="请选择部门" class="billhandler" v-on:change="deptStaffInfovaluefun">
									<el-option v-for="item in deptStaffInfo" :key="item.deptCode" :label="item.deptName" :value="item.deptCode">
									</el-option>
								</el-select>
								<el-select v-model="deptStaffDtosvlaue" placeholder="请选择部门处理人" class="billhandler">
									<el-option v-for="item in deptStaffDtos" :key="item.adminId" :label="item.name" :value="item.adminId">
									</el-option>
								</el-select>
							</div>
							<div class="intputBox">
								<span class="frominputTitle">优先级</span>
								<div class="billpriority">
									<el-radio v-model="radio" label="1" class="priority">低(3天内)</el-radio>
									<el-radio v-model="radio" label="2" class="priority">中(当天)</el-radio>
									<el-radio v-model="radio" label="3" class="priority">高(一个小时内)</el-radio>
									<el-radio v-model="radio" label="4" class="priority">最高(15分钟内)</el-radio>
								</div>
							</div>
							<div class="affirmbuildbtn" v-on:click="submitformdata">
								<span>确认</span>
							</div>
							<div class="cancelbuildbtn" v-on:click="fifbuildbillfun">
								<span>取消</span>
							</div>
						</div>
					</transition>
				</div>
			</div>
			<!-- 服务记录 -->
			<transition name="slide-serverList">
				<div class="serverList" v-if="serverListStyle">
					<div class="title"><span>服务记录</span><i class="el-icon-close" v-on:click="showserverList"></i></div>
					<div class="listBox">
						<div class="list" v-for="(item,index) in userMsg.serviceList" :key="'list'+index" v-on:click="showchartDetailchange(item)">
							<div class="time_grade">
								<span class="time">{{item.finishTime}}</span>
								<el-rate v-model="item.serviceScore" disabled></el-rate>
							</div>
							<div class="triangle"><i class="el-icon-arrow-right"></i></div>
						</div>
					</div>
				</div>
			</transition>
		</div>
		<!-- 转交会话弹窗 -->
		<el-dialog title="转交给" :visible.sync="passto" width="386px" :append-to-body="true" :modal-append-to-body="true" top="16vh">
			<div class="passToBox" v-loading="passTolistloading">
				<div class="passTolist">
					<div v-bind:class="{passedOnToPeople:true,passedOnToPeopleactive:item.checked}" v-for="(item,index) in passtodata"
					 :key="'passedOnToPeople'+index" v-on:click="choicePeople(index)">
						<div class="left"><img :src="item.kefuImg" alt=""><span>{{item.kefuName}}</span></div>
						<div v-bind:class="{checked:true,checkedactive:item.checked}"><i class="el-icon-check"></i></div>
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="changeServer">取 消</el-button>
					<el-button type="primary" v-on:click="switchpeople" class="busbut">确 定</el-button>
				</span>
			</div>
		</el-dialog>
		<!-- 聊天详情弹窗显示 -->
		<transition name="slide-chartDetail">
			<chartDetail v-if="showchartDetail" ref="chartDetail"></chartDetail>
		</transition>
		</div>
	</div>
</template>
<script>
	import imChat from './imChat.js';
	export default {
		...imChat
	};
</script>
<style lang="less" scoped="">
	@import "./imChat.less";
	/* 转交内容样式 */
	.passToBox {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-end;

		.passTolist {
			width: 100%;
			height: 450px;
			overflow-y: auto;

			.passedOnToPeople {
				width: 100%;
				height: 72px;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin-left: 12px;
					img {
						width: 48px;
						height: 48px;
						border-radius: 4px;
					}

					span {
						margin-left: 12px;
						font-size: 16px;
						color: rgba(51, 51, 51, 1);
					}
				}

				.checked {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 24px;
					height: 24px;
					border: 1px solid rgba(204, 204, 204, 1);
					border-radius: 50%;
					margin-right: 12px;

					i {
						font-size: 14px;
						color: rgba(255, 255, 255, 1);
					}
				}

				.checkedactive {
					background: rgba(0, 126, 255, 1);
					border: none;
				}
			}

			.passedOnToPeopleactive {
				background: rgba(192, 192, 193, 1) !important;
			}

			.passedOnToPeople:hover {
				background: rgba(222, 222, 222, 1);
			}
		}

		.passTolist:hover::-webkit-scrollbar-thumb {
			background-color: rgba(168, 168, 168, 1);
		}

		.passTolist::-webkit-scrollbar {
			width: 2px;
			background-color: rgba(255, 255, 255, 1);
		}

		.passTolist::-webkit-scrollbar-thumb {
			border-radius: 3px;
			background-color: rgba(255, 255, 255, 1);
		}
	}
</style>
