<template>
	<div class="serviceRecord">
		<div class="listBox">
			<div class="header">
				<div class="headerLeftTitle">
					<span class="Tile">服务记录</span>
				</div>
				<div class="selectInput">
					<input type="text" v-model="selectInput" placeholder="搜索客户名/手机号/备注名">
					<i class="el-icon-search"></i>
					<i class="el-icon-circle-close"  v-on:click="clearIntput" v-show="selectInput!=''"></i>
					<div class="selectbotton" v-on:click="inputchange"><span>搜索</span></div>
				</div>
			</div>
			<div class="table">
				<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" height="661" size="small">
					<el-table-column prop="id"  show-overflow-tooltip width="192">
						<template slot-scope="scope" slot="header"><span class="hearder">服务编号</span></template>
						<template slot-scope="scope" ><span class="tabletext">{{tableData[scope.$index].id}}</span></template>
					</el-table-column>
					<el-table-column prop="customerName"  show-overflow-tooltip  width="120">
						<template slot-scope="scope" slot="header"><span class="hearder">客户姓名</span></template>
						<template slot-scope="scope" ><span  class="tabletext">{{tableData[scope.$index].customerName}}</span></template>
					</el-table-column>
					<el-table-column prop="finishTime"  show-overflow-tooltip width="192">
						<template slot-scope="scope" slot="header"><span class="hearder">服务时间</span></template>
						<template slot-scope="scope" ><span  class="tabletext">{{tableData[scope.$index].finishTime}}</span></template>
					</el-table-column>
					<el-table-column prop="phone"  show-overflow-tooltip width="192">
						<template slot-scope="scope" slot="header"><span class="hearder">手机号码</span></template>
						<template slot-scope="scope" ><span  class="tabletext">{{tableData[scope.$index].phone}}</span></template>
					</el-table-column>
					<el-table-column prop="lengthOfService"  show-overflow-tooltip width="144">
						<template slot-scope="scope" slot="header"><span class="hearder">服务时长</span></template>
						<template slot-scope="scope" ><span  class="tabletext">{{tableData[scope.$index].lengthOfService}}</span></template>
					</el-table-column>
					<el-table-column prop="serviceScore">
						<template slot-scope="scope" slot="header"><span class="hearder">评分</span></template>
						<template slot-scope="scope" ><span  class="tabletext">{{tableData[scope.$index].id}}</span></template>
						<template slot-scope="scope">
							<el-rate disabled v-model="tableData[scope.$index].serviceScore"></el-rate>
						</template>
					</el-table-column>
					<el-table-column fixed="right" width="150">
						<template slot-scope="scope" slot="header"><span class="hearder">操作</span></template>
						<template slot-scope="scope">
							<el-button @click.native.prevent="showchartDetailchange(tableData[scope.$index].id)" type="text" size="small">
								聊天记录
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="page">
				<span>共 {{total}} 条</span>
				&emsp;
				<el-pagination background layout="prev, pager, next" :total="total" :page-size='pagesize' :current-page="pageindex" @current-change="change" :background="false">
				</el-pagination>
			</div>
		</div>
		<transition name="slide-chartDetail">
			<chartDetail v-if="showchartDetail" ref="chartDetail"></chartDetail>
		</transition>
	</div>
</template>
<script>
	import serviceRecord from './serviceRecord.js'
	export default {
		...serviceRecord
	}
</script>
<style lang="less" scoped="">
	@import './serviceRecord.less';
	.el-pagination{
		.btn-prev{
			border:1px solid red;
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
