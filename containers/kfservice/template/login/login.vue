<template>
	<div class="login">
		<!-- 定不logo -->
		<div class="topLogo">
			<img src="../../assets/loginLogo.png" alt="">
		</div>
		<!-- form表单 -->
		<form class="form" v-loading="loading!=''" :element-loading-text="loading" element-loading-background="rgba(255, 255, 255, 0.3)" >
			<div class="title"><span>登录</span></div>
			<input placeholder="请输入账号" v-model="form.name" class="name"></input>
			<input placeholder="请输入密码" v-model="form.password" type="password" class="password" autocomplete></input>
			<div class="roleOfScreening" v-on:mousemove="mousemovefun()" v-on:mouseleave="mouseleavefun()">
				<div class="showselectedvalue" placeholder="请选择业务类型">
					<el-tag v-for="(items,indexs) in businesstype" :key="'el'+indexs" closable type="success" class="Hasbeenselected"
					 size="mini" v-if="items.checked" @close="selectedfun(indexs)">{{items.bussinessName}}
					</el-tag>
				</div>
					<div class="selectbox" v-on:mousemove.stop="" v-if="ifselectbox">
						<div class="select" v-for="(items,indexs) in businesstype" :key="'select'+indexs" v-on:click="selectedfun(indexs)">
							<div :class="{checkbox:true,checkboxactive:items.checked}"></div>
							<div class="text"><span>{{items.bussinessName}}</span></div>
						</div>
					</div>
			</div>
			<el-button type="primary" @click="onSubmit" class="onSubmit">登录</el-button>
		</form>
		<!-- 底部loggo -->
		<div class="bottomLogo">
			<img src="../../assets/bottomLogo.png" alt="">
		</div>
	</div>
</template>
<script>
	import login from "./login.js";
	export default {
		...login,
	}
</script>

<style lang="less" scoped="">
	@import './login.less';
</style>
