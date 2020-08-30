<template>
	<div class="chart">
		<!-- 会话列表 -->
		<chartList v-show="windowsize>=1000"></chartList>
		<!-- 聊天窗 -->
		<imChat v-show="someObj !=null" ref="imChatfun"></imChat>
		<!-- 未打开聊天窗空状态 -->
		<div v-show="someObj ==null" :class="{nochart:true,nochartsize:windowsize<=1000}">
			<div class="nochartcontent">
				<img src="../../assets/nochart.png" alt="">
				<span>暂无消息</span>
			</div>
		</div>
		<!--工单详情页-->
		<transition name="slide-workorderdetail">
			<workorderdetail v-if="workorderdetail" ref="workorderdetail"></workorderdetail>
		</transition>
	</div>
</template>
<script>
	import chart from './chart.js'
export default {
	...chart
}
</script>
<style lang="less" scoped="">
	@import './chart.less';
</style>
