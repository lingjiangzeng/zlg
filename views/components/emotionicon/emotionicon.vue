<template>
	<div class="emotionicon">
		<img @click="myclick(items)" :src="items.imgurl" alt="" :title="items.label" v-for="(items,index) in icondata" :key="'img'+index">
	</div>
</template>

<script>
	import emotionicon from './emotionicon.js'
	export default{
		...emotionicon
	}
</script>

<style lang='less' scoped="">
	@import './emotionicon.less';
</style>
