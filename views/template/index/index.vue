<template>
  <div class="index" v-loading="allloading || websokitloading"  element-loading-background="rgba(50, 50, 50, 0.1)"  element-loading-text="加载中">
    <!-- 头部栏 -->
    <hearder></hearder> 
	<!-- 菜单栏 -->
    <silder v-if="windowsize>=1200"></silder>
    <!-- 当前页面的内容 -->
    <div :class="{content:true,sizecontent:windowsize<=1200}">
      <router-view></router-view>
    </div>
	<!--呼叫系统小弹窗 -->
	<div class="callLitteWindow" v-if="callwindow.ifshow == 1" v-on:dblclick="gocallenter" :style="position" v-on:mousedown.stop="callLitteWindowdown" v-on:mouseup.stop="callLitteWindowup" v-on:mouseleave.stop="callLitteWindowleave" v-on:mousemove.stop="movefun">
		<span class="phoneNumber"  v-on:mousedown.stop="">{{callwindow.phone}}</span>
		<span class="callDuration"  v-on:mousedown.stop="">你有新的来电 {{callwindow.time}}s</span>
	</div>
  </div>
</template>
<script>
import index from './index.js'
export default {
  ...index
}
</script>
<style lang="less" scoped="">
@import "index.less";
</style>
