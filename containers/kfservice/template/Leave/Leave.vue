<template>
	<div class="Leave">
		<chartList v-show="windowsize>=1000"></chartList>
		<imChat v-show="someObj != null" ref="imChatfun"></imChat>
		<div v-show="someObj == null" :class="{nochart:true,nochartsize:windowsize<=1000}">
			<div class="nochartcontent">
				<img src="../../assets/nochart.png" alt="">
				<span>暂无消息</span>
			</div>
		</div>
		<transition name="slide-workorderdetail">
			<workorderdetail v-if="workorderdetail" ref="workorderdetail"></workorderdetail>
		</transition>
	</div>
</template>
<script>
	import Leave from './Leave.js'
export default {
	...Leave
}
</script>
<style lang="less" scoped="">
	@import './Leave.less';
</style>
