<template>
	<div class="calldetail" v-loading='loading'>
		<div class="header">
			<div class="back" v-on:click="back()"><i class="el-icon-back"></i><span>返回</span></div>
			<span class="serialnumber">编号 {{callInfo.chCallin}}</span>
		</div>
		<div class="detailcontent">
			<div class="rightcontentox">
				<div class="callDetail">
					<div class="title"><span>通话信息</span></div>
					<div class="msg">
						<div class="msgcontent">
							<span class="title">呼入号码:</span>
							<span class="text">{{callInfo.phone}}</span>
						</div>
						<div class="msgcontent">
							<span class="title">开始时间:</span>
							<span class="text">{{callInfo.beginTime}}</span>
						</div>
						<div class="msgcontent">
							<span class="title">结束时间:</span>
							<span class="text">{{callInfo.endTime}}</span>
						</div>
						<div class="msgcontent">
							<span class="title">服务时长:</span>
							<span class="text">{{callInfo.serviceLen}}</span>
						</div>
						<div class="msgcontent">
							<span class="title">接待客服:</span>
							<span class="text">{{callInfo.seatName}}</span>
						</div>
						<div class="msgcontent audioify">
							<span class="title">服务录音:</span>
							<audio controls="controls" :src="callInfo.soundUrl" ref='audio'></audio>
						</div>
					</div>
				</div>
				<div class="callDetail">
					<div class="title"><span>客户信息</span></div>
					<div class="msg">
						<div class="msgcontent">
							<span class="title">头像:</span>
							<img :src="UserInfo.headPortrait"></img>
						</div>
						<div class="msgcontent">
							<span class="title">姓名:</span>
							<span class="text">{{UserInfo.userName}}</span>
						</div>
						<div class="msgcontent">
							<span class="title">备注:</span>
							<span class="text">{{UserInfo.remarkName}}</span>
						</div>
						<div class="msgcontent">
							<span class="title">手机:</span>
							<span class="text">{{UserInfo.telephone}}</span>
						</div>
						<div class="msgcontent">
							<span class="title">车牌号:</span>
							<span class="text">{{UserInfo.carPlateNo}}</span>
						</div>
						<div class="msgcontent">
							<span class="title">微信号:</span>
							<span class="text">{{UserInfo.nickName}}</span>
						</div>
					</div>
				</div>
				<div class="billorder">
					<div class="title">
						<span class="text">工单</span>
						<div class="buildbtn" @click="relaunched"><span>创建工单</span></div>
					</div>
					<!-- 列表数据 -->
					<div class="table" v-if="customerWOInfo.length>0">
					<el-table ref="multipleTable" :data="customerWOInfo" tooltip-effect="dark" size="small" height="370">
						<el-table-column prop="code" show-overflow-tooltip width="100">
							<template slot-scope="scope" slot="header"><span class="hearder">工单编号</span></template>
							<template slot-scope="scope" ><span  class="tabletext">{{customerWOInfo[scope.$index].code}}</span></template>
						</el-table-column>
						<el-table-column prop="priority" show-overflow-tooltip width="150">
							<template slot-scope="scope" slot="header"><span class="hearder">优先级</span></template>
							<template slot-scope="scope">
								<el-tag type="success" v-if="customerWOInfo[scope.$index].priority==1" >低(3天内)</el-tag>
								<el-tag v-if="customerWOInfo[scope.$index].priority==2" >中(当天)</el-tag>
								<el-tag type="danger" v-if="customerWOInfo[scope.$index].priority==3" >高(1个小时内)</el-tag>
								<el-tag type="danger" v-if="customerWOInfo[scope.$index].priority==4" >最高(15分钟内)</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="status" show-overflow-tooltip width="100">
							<template slot-scope="scope" slot="header"><span class="hearder">状态</span></template>
							<template slot-scope="scope">
								<span v-if="customerWOInfo[scope.$index].status==0" class="tabletext">待接受</span>
								<span v-if="customerWOInfo[scope.$index].status==1" class="tabletext">已接受</span>
								<span v-if="customerWOInfo[scope.$index].status==2" class="tabletext">已退回</span>
								<span v-if="customerWOInfo[scope.$index].status==3" class="tabletext">已完成</span>
								<span v-if="customerWOInfo[scope.$index].status==4" class="tabletext">已关闭</span>
							</template>
						</el-table-column>
						<el-table-column prop="creater"  show-overflow-tooltip width="100">
							<template slot-scope="scope" slot="header"><span class="hearder">创建人</span></template>
							<template slot-scope="scope" ><span  class="tabletext">{{customerWOInfo[scope.$index].creater}}</span></template>
						</el-table-column>
						<el-table-column prop="handler"  show-overflow-tooltip width="100">
							<template slot-scope="scope" slot="header"><span class="hearder">处理人</span></template>
							<template slot-scope="scope" ><span  class="tabletext">{{customerWOInfo[scope.$index].handler}}</span></template>
						</el-table-column>
						<el-table-column prop="createTime" show-overflow-tooltip width="200">
							<template slot-scope="scope" slot="header"><span class="hearder">创建时间</span></template>
							<template slot-scope="scope" ><span  class="tabletext">{{customerWOInfo[scope.$index].createTime}}</span></template>
						</el-table-column>
						<el-table-column prop="type"  show-overflow-tooltip width="200">
							<template slot-scope="scope" slot="header"><span class="hearder">工单分类</span></template>
							<template slot-scope="scope" ><span  class="tabletext">{{customerWOInfo[scope.$index].type}}</span></template>
						</el-table-column>
						<el-table-column prop="title"  show-overflow-tooltip>
							<template slot-scope="scope" slot="header"><span class="hearder">标题</span></template>
							<template slot-scope="scope" ><span  class="tabletext">{{customerWOInfo[scope.$index].title}}</span></template>
						</el-table-column>
						<el-table-column fixed="right" width="100">
							<template slot-scope="scope" slot="header"><span class="hearder">操作</span></template>
							<template slot-scope="scope">
								<el-button @click.native.prevent="showbillDetail(customerWOInfo[scope.$index].code,customerWOInfo[scope.$index].userId)"
								 type="text" size="small">
									详情
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					</div>
					<div v-else class="empty">
						<img src="../../assets/empty.png">
						<span>暂无工单</span>
					</div>
				</div>
			</div>
			<!-- 工单详情< -->
			<transition name="slide-workorderdetail">
				<workorderdetail v-if="workorderdetail" ref="workorderdetail"></workorderdetail>
			</transition>
			<!-- 呼叫中心 创建工单-->
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
		</div>
	</div>
</template>

<script>
	import calldetail from './calldetail.js'
	export default {
		...calldetail
	}
</script>

<style lang="less" scoped="">
	@import './calldetail.less';
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
				margin-bottom: 10px;
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
	.hearder{
		font-size:14px;
		font-weight:500;
		color:rgba(50,60,66,1);
	}
	.tabletext{
		font-size:14px;
		font-weight:400;
		color:rgba(90,105,120,1);
	}
</style>
