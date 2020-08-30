<template>
	<div class="workorderdetail">
		<div class='workorderdetailheader'>
			<div class="headerleft">
				<div class='backbtn' v-on:click="back()"><i class="el-icon-back"></i><span>返回</span></div>
				<div class="billNo">
					<span class="title">工单编号</span>
					<span class="No">{{WOInfo.code}}</span>
					<el-tag type="success" size="mini" v-if="WOInfo.priority==1">低(3天内)</el-tag>
					<el-tag size="mini" v-if="WOInfo.priority==2">中(当天)</el-tag>
					<el-tag type="danger" size="mini" v-if="WOInfo.priority==3">高(1个小时内)</el-tag>
					<el-tag type="danger" size="mini" v-if="WOInfo.priority==4">最高(15分钟内)</el-tag>
				</div>
			</div>
			<div class="operationbtn">
				<div class="accept" v-on:click="accept" v-if="ButtonInfo.indexOf('1') >=0"><i class="el-icon-check"></i><span>接受</span></div>
				<div class="deliverto" v-on:click="deliverto" v-if="ButtonInfo.indexOf('2') >=0"><img src="../../assets/deliverto.png"
					 alt=""><span>转交</span></div>
				<div class="backto" v-on:click="sendback" v-if="ButtonInfo.indexOf('3') >=0"><img src="../../assets/backto.png" alt=""><span>退回</span></div>
				<div class="accept" v-on:click="beensolved" v-if="ButtonInfo.indexOf('4') >=0"><i class="el-icon-check"></i><span>已解决</span></div>
				<div class="again" v-on:click="relaunched" v-if="ButtonInfo.indexOf('5') >=0"><i class="el-icon-refresh-right"></i><span>重新发起</span></div>
				<div class="close" v-on:click="closebill" v-if="ButtonInfo.indexOf('6') >=0"><img src="../../assets/closechart.png"
					 alt=""><span>关闭</span></div>
			</div>
		</div>
		<div class="contentbox">
			<div class="progressbar">
				<div class="description">
					<div class="lightTitle"><span>问题描述</span></div>
					<div class="msg">
						<span class="Title">{{WOInfo.title}}</span>
						<span class="msgcontent">{{WOInfo.content}}</span>
					</div>
				</div>
				<div class="schedule">
					<div class="Title"><span>工单流程</span></div>
					<div class="timeline">
						<el-timeline style="margin-left:2px;">
							<el-timeline-item v-for="(activity, index) in FlowInfo" :key="index" :timestamp="activity.createTime" color="#0BBD87">
								{{activity.content}}
								<el-tooltip class="item" effect="dark" :content="activity.remark" placement="top-end" v-if="activity.remark!=null">
									<span class="remark">&ensp;详情</span>
								</el-tooltip>
							</el-timeline-item>
						</el-timeline>
					</div>
				</div>
			</div>
			<div class="billmsg_kehumsg">
				<div class="billmsg">
					<div class="Title"><span>工单信息</span></div>
					<div class="msg">
						<div class="content">
							<span>创建时间: {{WOInfo.createTime}}</span>
							<span>状态:
								<span v-if="WOInfo.status==0">待接受</span>
								<span v-if="WOInfo.status==1">已接受</span>
								<span v-if="WOInfo.status==2">已退回</span>
								<span v-if="WOInfo.status==3">已完成</span>
								<span v-if="WOInfo.status==4">已关闭</span>
							</span>
						</div>
						<div class="content">
							<span>创建人: {{WOInfo.creater}}</span>
							<span>工单分类: {{WOInfo.type}}</span>
						</div>
						<div class="content">
							<span>处理人: {{WOInfo.handler}}</span>
							<span v-if="WOInfo.chatId != null && WOInfo.userId != null">聊天记录:<span class="check" v-on:click="showchartDetailchange">
									查看</span></span>
						</div>
					</div>
				</div>
				<div class="kehumsg">
					<div class="Title"><span>客户信息</span></div>
					<div class="msg">
						<div class="content">
							<span>姓名: {{UserInfo.userName}}</span>
							<span>微信号: {{UserInfo.nickName}}</span>
						</div>
						<div class="content">
							<span>手机号: {{UserInfo.telephone}}</span>
							<span>备注名: {{UserInfo.remarkName}}</span>
						</div>
						<div class="content">
							<span>车牌号: {{UserInfo.carPlateNo}}</span>
						</div>

					</div>
				</div>
			</div>
		</div>
		<!-- 退回和已经完成确认弹窗 -->
		<el-dialog :title="operationtype" :visible.sync="dialogVisible" width="442px" top="15%" :before-close="handleClose"
		 :modal-append-to-body="true" :append-to-body="true">
			<el-input type="textarea" :rows="5" placeholder="请输入备注" v-model="remark">
			</el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="confirm">确 定</el-button>
			</span>
		</el-dialog>
		<!--转交弹窗 -->
		<el-dialog title="填写转交信息" :visible.sync="PassedVisible" width="442px" top="16%" :before-close="PassedClose"
		 :modal-append-to-body="true" :append-to-body="true">
			<div class="delivetoify">
				<div class="title"><span>转交人</span></div>
				<el-select v-model="deptStaffInfovalue" placeholder="请选择部门" v-on:change="deptStaffInfovaluefun" style="margin-top:20px;">
					<el-option v-for="item in deptStaffInfo" :key="item.deptCode" :label="item.deptName" :value="item.deptCode">
					</el-option>
				</el-select>
				<el-select v-model="deptStaffDtosvlaue" placeholder="请选择部门处理人" style="margin-top:20px;">
					<el-option v-for="item in deptStaffDtos" :key="item.adminId" :label="item.name" :value="item.adminId">
					</el-option>
				</el-select>
				<div class="title" style="margin-top:40px;"><span>备注</span></div>
				<el-input type="textarea" :rows="5" placeholder="请输入备注" v-model="billtextarea" style="margin-top:20px;"></el-input>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="PassedClose">取 消</el-button>
				<el-button type="primary" @click="Passedconfirm">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 重新发起 -->
		<el-dialog title="填写信息" :visible.sync="relaunchedVisible" width="442px" :before-close="relaunchedClose"
		 :modal-append-to-body="true" :append-to-body="true">
			<div class="fromBox">
				<div class="intputBox">
					<span class="frominputTitle">工单分类</span>
					<el-select v-model="woTypesvalue" placeholder="请选择工单分类" class="billType">
						<el-option v-for="item in woTypes" :key="item.dictKey" :label="item.dictValue" :value="item.id"> </el-option>
					</el-select>
				</div>
				<div class="intputBox" style="margin-top:20px;">
					<span class="frominputTitle">标题</span>
					<el-input v-model="titleValue" placeholder="" class="billfrominputTitle"></el-input>
				</div>
				<div class="intputBox" style="margin-top:20px;">
					<span class="frominputTitle">描述</span>
					<el-input type="textarea" :rows="4" placeholder="" v-model="billtextarea" class="billdescription"></el-input>
				</div>
				<div class="intputBox" style="margin-top:20px;">
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
				<div class="intputBox" style="margin-top:20px;">
					<span class="frominputTitle">优先级</span>
					<div class="billpriority">
						<el-radio-group v-model="radio">
							<el-radio :label="1" class="priority">低(3天内)</el-radio>
							<el-radio :label="2" class="priority">中(当天)</el-radio>
							<el-radio :label="3" class="priority">高(1个小时内)</el-radio>
							<el-radio :label="4" class="priority">最高(15分钟内)</el-radio>
						</el-radio-group>

					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="relaunchedClose">取 消</el-button>
				<el-button type="primary" @click="relaunchedconfirm">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 聊天详情< -->
		<transition name="slide-chartDetail">
			<chartDetail v-if="showchartDetail" ref="chartDetail"></chartDetail>
		</transition>
	</div>
</template>

<script>
	import workorderdetail from './workorderdetail.js'
	export default {
		...workorderdetail
	}
</script>

<style lang="less" scoped="">
	@import './workorderdetail.less';

	.fromBox {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		background: rgba(255, 255, 255, 1);

		.intputBox {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;

			.frominputTitle {
				margin-left: 25px;
				font-size: 14px;
				
				color: rgba(90, 105, 120, 1);
			}

			.billType {
				margin-top: 10px;
				margin-left: 25px;
				width: 168px;
				height: 40px;
			}

			.billfrominputTitle {
				margin-top: 10px;
				margin-left: 25px;
				width: 294px;
				height: 40px;
			}

			.billdescription {
				margin-top: 10px;
				margin-left: 25px;
				width: 294px;
			}

			.billhandler {
				margin-top: 10px;
				margin-left: 25px;
				width: 294px;
			}

			.billpriority {
				margin-top: 10px;
				margin-left: 25px;
				width: 294px;

				.priority {
					margin: 10px 10px 0px 0px;
				}
			}
		}

		.affirmbuildbtn {
			margin-top: 50px;
			width: 294px;
			height: 40px;
			background: rgba(0, 126, 255, 1);
			border-radius: 4px;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;

			span {
				font-size: 14px;
				
				color: rgba(255, 255, 255, 1);
			}
		}
	}

	.delivetoify {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;

		.title {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: flex-start;
			font-size: 14px;
			
			color: rgba(90, 105, 120, 1);
		}
	}
</style>
