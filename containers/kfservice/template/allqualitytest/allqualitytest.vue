<template>
	<div class="allqualitytest" v-loading="allqualitytestloading">
		<!-- 选项卡 -->
		<div class="statusTab">
			<div :class="{tab:true,active:item.actived}" v-for="(item,index) in statusTba" :key="'tab'+index" v-on:click="statusTbafun(index)"><span>{{item.label}}</span></div>
		</div>
		<!-- 质检列表和筛选条件 -->
		<div class="tablist">
			<!-- 输入搜索、时间筛选、处理人筛选、创建人筛选 -->
			<div class="tabListHeader">
				<!-- 输入搜索 -->
				<div class="selectInput">
					<input type="text" v-model="selectInput" placeholder="请输入服务编号/接待客服">
					<i class="el-icon-search"></i>
					<i class="el-icon-circle-close" v-on:click="clearIntput" v-show="selectInput!=''"></i>
					<div class="selectbotton" v-on:click="inputchange"><span>搜索</span></div>
				</div>
				<!-- 筛选 -->
				<div class="selectbox">
					<!-- 时间筛选 -->
					<el-date-picker v-model="datavalue" type="daterange" range-separator="至" align="right"  value-format="yyyy-MM-dd"  :clearable='true' unlink-panels
					 start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"  @change="datechange" class="select1">
					</el-date-picker>
					<!-- 创建人筛选 -->
					<el-select v-model="value" placeholder="会话评分" class="select">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
			</div>
			<!-- 质检列表 -->
			<div class="table">
			<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" size="small" height="720">
				<el-table-column prop="id" label="服务编号" show-overflow-tooltip>
					<template slot-scope="scope" slot="header"><span class="hearder">服务编号</span></template>
					<template slot-scope="scope" ><span class="tabletext">{{tableData[scope.$index].id}}</span></template>
				</el-table-column>
				<el-table-column prop="founder" label="接待客服" show-overflow-tooltip>
					<template slot-scope="scope" slot="header"><span class="hearder">接待客服</span></template>
					<template slot-scope="scope" ><span  class="tabletext">{{tableData[scope.$index].founder}}</span></template>
				</el-table-column>
				<el-table-column prop="creationtime" label="服务时间">
					<template slot-scope="scope" slot="header"><span class="hearder">服务时间</span></template>
					<template slot-scope="scope" ><span  class="tabletext">{{tableData[scope.$index].creationtime}}</span></template>
				</el-table-column>
				<el-table-column prop="servicetime" label="服务时长" show-overflow-tooltip>
					<template slot-scope="scope" slot="header"><span class="hearder">服务时长</span></template>
					<template slot-scope="scope" ><span  class="tabletext">{{tableData[scope.$index].servicetime}}</span></template>
				</el-table-column>
				<el-table-column prop="user" label="客户" show-overflow-tooltip>
					<template slot-scope="scope" slot="header"><span class="hearder">客户</span></template>
					<template slot-scope="scope" ><span  class="tabletext">{{tableData[scope.$index].user}}</span></template>
				</el-table-column>
				<el-table-column prop="grade" label="会话评分" show-overflow-tooltip>
					<template slot-scope="scope" slot="header"><span class="hearder">会话评分</span></template>
					<template slot-scope="scope" ><span  class="tabletext">{{tableData[scope.$index].grade}}</span></template>
				</el-table-column>

				<el-table-column fixed="right" label="操作">
					<template slot-scope="scope" slot="header"><span class="hearder">操作</span></template>
					<template slot-scope="scope">
						<el-button @click.native.prevent="showallqualitytestDetail(tableData[scope.$index].id)" type="text" size="small">
							详情
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			</div>
			<!-- 翻页 -->
			<div class="page">
				<span>共 {{total}} 条</span>&emsp;
				<el-pagination background layout="prev, pager, next" :total="total" :page-size='pagesize' :current-page="pageindex"
				 @current-change="change" :background="false">
				</el-pagination>
			</div>
		</div>
		<!-- 质检详情页面动画和蒙层 -->
		<!-- 蒙层 -->
		<transition name="slide-modal">
			<div class="modal" v-if="showdetail" v-on:click="closeshowdetail()">
			</div>
		</transition>
		<!-- 质检详情 -->
		<transition name="slide-allqualitytestDetail">
			<div class="allqualitytestDetail" v-if="showdetail" v-on:click.stop="" v-loading="detailloading!=''"
			 :element-loading-text="detailloading">
			 <!-- 会话记录-->
				<div class="chartDetail">
					<!-- 会话记录标题 -->
					<div class="time_nav">
						<div class="time"><span>会话记录</span></div>
					</div>
					<!-- 会话记录头部信息 -->
					<div class="usermsg">
						<div class="headerimg_name">
							<div class="headerimg"><img :src="chartlistdata.customerHeadImg" alt=""></div>
							<div class="name_carNo">
								<span class="name">{{chartlistdata.customerName}}</span>
								<span class="carNo">{{chartlistdata.customerLicensePlate}}</span>
							</div>
						</div>
						<div class=" handleDetail">
							<span class="times">
								<span class="title">时间</span>
								<span class="text">{{chartlistdata.serviceTime}}</span></span>
							<span class="responsible">
								<span class="title">经办人</span>
								<span class="text">{{chartlistdata.server}}&ensp;
									<span class="highlight" v-if="chartlistdata.handOverServer!=null && chartlistdata.handOverServer!=''">转交至</span>
									<span v-if="chartlistdata.handOverServer!=null && chartlistdata.handOverServer!=''">&ensp;{{chartlistdata.handOverServer}}</span></span>
							</span>
							<span class="evaluate">
								<span class="title">服务评价</span>
								<span class="text">
									<el-rate disabled v-model="chartlistdata.serviceScore"></el-rate>
								</span></span>
						</div>
					</div>
					<!-- 聊天记录 -->
					<div class="chartList" ref="imChat_chartList">
						<div class="classify windowdeatil" v-for="(items,indexs) in chartlistdata.chatDtoList" :key="'classify'+indexs">
							<div class="divItme" v-for="(item, index) in items.chatRecordDTOList" :key="'chartList'+index">
								<div class="chatTime"><span>{{item.sendTime}}</span></div>
								<div class="item">
									<div :class="{infowrapper:true,sender: item.senderType != 1, receiver: item.senderType == 1}">
										<div class="avatarwrapper">
											<img class="kfimg" :src="item.senderImg">
										</div>
										<div v-if="item.contentType=='1'" class="itemcontent ">
											<span class="text" v-html="analysis(item.content)"></span>
											<span class="isLeave" v-if="item.isLeave">留言</span>
										</div>
										<div v-else-if="item.contentType=='2'" class="itemcontentpicture">
											<img class="img" :src="item.content">
										</div>
									</div>
								</div>
							</div>
							<div class="flooer">
								<div class="timeline"></div><span>{{items.finishTime}}&emsp;会话已结束</span>
								<div class="timeline"></div>
							</div>
						</div>
					</div>
				</div>
				<!-- 质检详情页评分框 -->
				<div class="overallscore">
						<div class="navclose">
						<div class="closeicon" v-on:click="closeshowdetail()"><i class="el-icon-close"></i></div>
						</div>
					<!-- 评分内容框 -->
					<div class="score">
						<!-- 进度条评分内容 -->
						<div class="garde">
							<div class="title"><span class="ti">总体评分</span><span class="rank">&ensp;优秀</span></div>
							<div class="progress">
								<el-progress :percentage="percentage" :format="format" :show-text="true"></el-progress>
							</div>
						</div>
						<!-- 评分规则条例展示 -->
						<div class="scoringrules">
							<div class="rules" v-for="(items,index) in scoringruleslist" :key="'rules'+index">
								<div class="rulesicon">
									<img :src="items.icon" alt="">
								</div>
								<div class="title_detail">
									<div class="title"><span>{{items.title}}</span></div>
									<div class="detail"><span>{{items.detail}}</span></div>
								</div>
								<div class="scoring">
									<span class="kou">扣</span>
									<span class="number">{{items.number}}</span>
								</div>
							</div>
						</div>
						<!-- 评语输入 -->
						<div class="remark">
							<span>详情</span>
							<el-input type="textarea" :autosize="{ minRows:5, maxRows:80}" placeholder="请输入内容" v-model="textarea2">
							</el-input>
						</div>
						<!-- 保存按钮 -->
						<div class="savebtn"><span>保存</span></div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
	import allqualitytest from './allqualitytest.js'
	export default {
		...allqualitytest
	}
</script>

<style lang="less" scoped="">
	@import './allqualitytest.less';
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
