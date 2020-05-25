<template>
	<div class="silder">
		<div class="headerLogo"><img src="../../assets/logo.png" alt=""></div>
		<el-menu :default-active="paths" class="el-menu-vertical-demo" text-color="#FFFFFF" background-color="#02152A" active-text-color="rgba(255,255,255,1)"  @select="choiceMeun" :unique-opened="true" >
			<el-submenu :index="item.index" v-for="item in meunListData" :key="item.index" v-if="item.display">
				<template slot="title">
					<div class="first">
					<img :src="item.icon" alt="" style="height:14px;width:14px;margin-right:6px;"><span style="font-size:14px;font-weight:400;color:rgba(255,255,255,1);">{{item.title}}</span>
					</div>
				</template>
				<el-menu-item :index="item.index" v-for="item in item.secondlyLevel" :key="item.index" :class="{addhovers:true,addhoversactive:item.active}" v-if="item.display">{{item.title}}&emsp;&emsp;&emsp;&emsp;&emsp;</el-menu-item>
			</el-submenu>
		</el-menu>
	</div>
</template>
<script>
	import silder from "./silder.js";
	export default {
		...silder,
	}
</script>
<style lang="less" scoped="">
	@import "./silder.less";
	 .el-menu-vertical-demo{
	 	height:calc(100% - 64px);
	 	width:100%;
	 	color:#FFFFFF;
	 	.el-submenu{
	 		.el-submenu__title{

	 		}
	 	}
	 }
	 .first{
		 position:absolute;
		 left:0px;
		 top:0px;
		 width:168px;
		 background-color:rgba(2, 21, 42,1);
		 z-index:10;
		 img{
			 margin-left:24px;
		 }
	 }
</style>

