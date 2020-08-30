<template>
	<div class="hearder">
		<div  class="call" v-if="callwindow.ifshow == 2"><img src="../../assets/call.png">&ensp;<span class="time">{{callwindow.timestr}}</span></div>
		<!-- 登录状态 -->
		<div class="sliderHeaderUserStatus">
			<img src="../../assets/headericon.png" alt="" v-if="usermsg.onlinestatus==1">
			<img src="../../assets/icon_out.png" alt="" v-if="usermsg.onlinestatus==2">
			<el-popover placement="bottom" trigger="manual"  v-model="onlinevisible">
				<div :class="{onlinestyle:true,onlinestyleactive:item.active}" v-for="(item,index) in stutasselect" :key="item.value" @click="changestats(item.value,item.label,index)" v-bind:style="{borderTop:item.borderTop}">
					<span>{{item.label}}</span>
				</div>
				<el-button type="text" slot="reference" @click.stop="onlinevisiblefun" >
					<span v-if="usermsg.onlinestatus==1" style="font-size:14px;font-weight:400;color:rgba(0,0,0,1);opacity:0.85;">在线</span>
					<span v-if="usermsg.onlinestatus==2" style="font-size:14px;font-weight:400;color:rgba(0,0,0,1);opacity:0.85;">离开</span>
					<i class="el-icon-caret-bottom" v-if="!onlinevisible" style="color:rgba(204,204,204,1);"></i>
					<i class="el-icon-caret-top" v-if="onlinevisible" style="color:rgba(204,204,204,1);"></i>
				</el-button>
			</el-popover>
			<!-- 业务选择 -->
			<div type="text" @click="busVisible=true" class="bussbtn">
				 <span v-if="busNnmber<=0" class="busstext">未选择服务</span><span v-if="busNnmber>0" class="busstext">已选择{{busNnmber}}服务</span>
				 <i class="el-icon-caret-bottom" v-if="!busVisible" style="color:rgba(0,126,255,1);"></i>
				 <i class="el-icon-caret-top" v-if="busVisible" style="color:rgba(0,126,255,1);"></i>
			 </div>
			<el-dialog title="更改业务类型" :visible.sync="busVisible" width="336px" :before-close="handleClose" :append-to-body="true"
			 :modal-append-to-body="true" top="20vh">
				<div class="busselect">
					<div class="select" v-for="(items,indexs) in busselect" :key="'select'+indexs" v-on:click="selectedfun(indexs)">
						<div :class="{checkbox:true,checkboxactive:items.checked}"></div>
						<div class="text"><span>{{items.bussinessName}}</span></div>
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="handleClose" class="busbut">取 消</el-button>
					<el-button type="primary" v-on:click="submitbus" class="busbut">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 头像和用户名 -->
			<img :src="usermsg.imgUrl" alt="" class="hearderimg">
			<span class="username">{{usermsg.userName}}</span>
		</div>
	</div>
</template>
<script>
	import hearder from "./hearder.js";
	export default {
		...hearder,
	}
</script>

<style lang="less" scoped="">
	/*自写标签样式 */
	@import "./hearder.less";
	/* 业务选择样式 */
	.busselect {
		height: 375px;
		width: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		.select {
			margin-left: 17px;
			margin-bottom: 17px;
			width: auto;
			height: 15px;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			cursor: pointer;
			.checkbox {
				height: 12px;
				width: 12px;
				border: 1px solid rgba(204, 204, 204, 1);
			}
			.checkboxactive {
				background: rgba(0, 111, 225, 1);
				border: 1px solid rgba(0, 111, 225, 1);
			}
			.text {
				margin-left: 6px;
			}
		}
	}
	.busselect::-webkit-scrollbar {
		display: none;
	}
	.busbut {
		color:rgba(255,255,255,1);
		background: rgba(0, 126, 255, 1) !important;
	}
	
	.busbut:hover {
		background: #3599ff !important;
	}
	
	.busbut:active {
		background: #0054ff !important;
	}
	.busstext{
		font-size:14px;
		
		font-weight:400;
		color:rgba(0,126,255,1);
		opacity:0.85;
	}
	/* 在线状态选择 */
	.onlinestyle{
		height:30px;
		display:flex;
		flex-direction:row;
		justify-content:center;
		align-items:center;
		cursor:pointer;
		font-size:14px;
		
		font-weight:400;
		color:rgba(0,0,0,1);
		opacity:0.85;
	}
	.onlinestyle:hover{
		color:rgba(0,126,255,1);
	}
	.onlinestyleactive{
		color:rgba(0,126,255,1);
	}
</style>
