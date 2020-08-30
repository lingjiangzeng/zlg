<template>
	<div class="listbox">
		<div class="selectinput"  v-on:click.stop="">
			<input type="text" v-model="selectvlaue" v-on:input="selectchange" placeholder="搜索客户名/备注名/手机号" v-on:click.stop="">
			<el-popover placement="bottom-end" width="260" trigger="manual"  v-model="visible">
				<div class="userListload" v-if="uerlistloading">
					<i class="el-icon-loading" v-if="userlistmsg==''"></i>
					<span v-if="userlistmsg!=''">{{userlistmsg}}</span>
				</div>
				<div class="userListdiv">
					<div v-for="(items,index) in uerlist"  v-on:click="handleSelect(items)" class="userlist">
						<img :src="items.senderImg">
						<span>&emsp;{{items.senderName}}</span>
					</div>
				</div>
				<i class="el-icon-check" slot="reference" v-show="selecticon" v-on:click.stop="querySearchAsync"></i>
			</el-popover>
		</div>
		<div class="chartList">
			<el-menu :default-active="indexs" class="el-menu-vertical-demo" style="width:100%" @select="choiceChart">
				<el-submenu :index="item.index" v-for="item in chartList" :key="item.index">
					<template slot="title">
						<span style="font-size:16px;font-weight:400;color:rgba(51,51,51,1);">{{item.title}}&emsp;{{item.list.length}}</span>
					</template>
					<el-menu-item :index="item.index+'-'+items.chatId+'-'+indexs" v-for="(items,indexs) in item.list" :key="item.index+'-'+items.chatId">
						<div :class="{listcontent:true,listcontentAction:items.selected}">
							<!-- 消息数量 -->
							<div class="Numberofmessages" v-if="items.messageaccount>0"><span>{{items.messageaccount>99 ? '99+' : items.messageaccount}}</span></div>
							
							<img :src="items.senderImg" alt="">
							<div class="Msg">
								<span class="name_time">
									<span class="name" :title="items.senderName">{{items.senderName}}</span>
									<span class="time">{{items.sendTime}}</span>
								</span>
								<span class="content" v-show="items.contentType==1" v-html="analysis(items.content)"></span>
								<span class="content" v-show="items.contentType==2">[图片]</span>
								<span class="timer" v-if="items.timer>0">{{items.time}}</span>
							</div>
						</div>
					</el-menu-item>
				</el-submenu>
			</el-menu>
		</div>
	</div>
</template>
<script>
	import chartList from './chartList.js'
	export default {
		...chartList
	}
</script>

<style lang="less" scoped="">
	@import "./chartList.less";

	.el-menu-vertical-demo {
		border: none;
		.el-submenu {
			.el-menu {
				.el-menu-item {
					padding: 0px !important;
					height: 72px;
				}
			}
			.el-submenu__title {
				height: 48px;
				padding: 0px 12px 0px 12px !important;
				display: flex;
				justify-content: space-between;
				align-items: center;

				span {
					font-size: 16px;
					font-weight: 400;
					color: rgba(51, 51, 51, 1);
					padding: 0px !important;
					width: 100%;
				}
			}
		}
	}

	.el-icon-check {
		position: absolute;
		font-size: 30px;
		top: 12.5px;
		right: 30px;
		color: rgba(51, 51, 51);
	}
	.userListload{
		width:100%;
		height:60px;
		display:flex;
		flex-direction:row;
		justify-content:center;
		align-items:center;
		i{
			font-size:20px;
		}
	}
	/* 查询的用画列表样式 */
	.userListdiv{
		width:100%;
		display:flex;
		flex-direction:column;
		justify-content:flex-start;
		align-items:flex-start;
		cursor:pointer;
		.userlist{
			height:35px;
			width:100%;
			display:flex;
			flex-direction:row;
			justify-content:flex-start;
			align-items:center;
			img{
				margin-left:5px;
				width:25px;
				height:25px;
			}
		}
		.userlist:hover{
			 background: #DEDEDE;
		}
	}
</style>
