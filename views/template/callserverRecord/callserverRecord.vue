<template>
	<div class="callserverRecord">
		<div class="pagaheader">
			<span class="label">呼叫中心/呼叫记录</span>
			<span class="title">呼叫记录</span>
		</div>
		<div class="tablelist">
			<div class="searchbox">
					<!-- 输入搜索 -->
					<div class="selectInput">
						<input type="text" v-model="selectInput" placeholder="搜索客户姓名/手机号">
						<i class="el-icon-search"></i>
						<i class="el-icon-circle-close" v-on:click="clearIntput" v-show="selectInput!=''"></i>
						<div class="selectbotton" v-on:click="inputchange"><span>搜索</span></div>
					</div>
			</div>
			<!-- 列表数据 -->
			<div class="table">
			<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" size="small" height="661">
				<el-table-column prop="chCallin" show-overflow-tooltip width="250">
					<template slot-scope="scope" slot="header"><span class="hearder">编号</span></template>
					<template slot-scope="scope" ><span  class="tabletext">{{tableData[scope.$index].chCallin}}</span></template>
				</el-table-column>
				<el-table-column prop="customerName"  show-overflow-tooltip width="120">
					<template slot-scope="scope" slot="header"><span class="hearder">客户姓名</span></template>
					<template slot-scope="scope" ><span  class="tabletext">{{tableData[scope.$index].customerName}}</span></template>
				</el-table-column>
				<el-table-column prop="beginTime"  show-overflow-tooltip width="192">
					<template slot-scope="scope" slot="header"><span class="hearder">服务时间</span></template>
					<template slot-scope="scope" ><span  class="tabletext">{{tableData[scope.$index].beginTime}}</span></template>
				</el-table-column>
				<el-table-column prop="phone" show-overflow-tooltip width="192">
					<template slot-scope="scope" slot="header"><span class="hearder">手机号码</span></template>
					<template slot-scope="scope" ><span  class="tabletext">{{tableData[scope.$index].phone}}</span></template>
				</el-table-column>
				<el-table-column prop="serviceLen"  show-overflow-tooltip width="192">
					<template slot-scope="scope" slot="header"><span class="hearder">服务时长</span></template>
					<template slot-scope="scope" ><span  class="tabletext">{{tableData[scope.$index].serviceLen}}</span></template>
				</el-table-column>
				<el-table-column prop="isConnect"  show-overflow-tooltip width="">
					<template slot-scope="scope" slot="header"><span class="hearder">是否接通</span></template>
					<template slot-scope="scope" >
						<span  class="tabletext"v-if="tableData[scope.$index].isConnect == 1">是</span>
						<span  class="tabletext"v-if="tableData[scope.$index].isConnect == 0">否</span>
						</template>
				</el-table-column>
				<el-table-column fixed="right" width="120">
					<template slot-scope="scope" slot="header"><span class="hearder">操作</span></template>
					<template slot-scope="scope">
						<el-button @click.native.prevent="showcalldetail(tableData[scope.$index].chCallin)"
						 type="text" size="small">
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
		<!-- 呼叫系统详情< -->
		<transition name="slide-calldetail">
			<calldetail v-if="calldetail" ref="calldetail"></calldetail>
		</transition>
	</div>
</template>

<script>
	import callserverRecord from  './callserverRecord.js'
	export default{
		...callserverRecord
	}
</script>

<style lang="less" scoped="">
	@import './callserverRecord.less';
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
