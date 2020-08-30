<template>
	<div class="Mobilechat">
		<div class="chartheard">
			<div class="username"><span>{{userName}}</span></div>
			<div class="endbtn" v-on:click="endcomfirm" v-show="endbtn"><span>结束</span></div>
		</div>
		<div class="chartcontent" ref="chartcontent" @touchstart="touchstartfun" @touchmove="touchmovefun" @scroll="scrollfun">
			<div class="chartList" v-for="(item,index) in chartdata" :key="'chartList'+index"  :id="'chartclassifys'+item.chatId" ref="chartclassifys"">
				<div :class="{usercontent:items.senderType==1,kefucontent:items.senderType==2}" v-for="(items,indexs) in item.chatRecordDTOList"
				 :key="'chartcontent'+indexs">
					<div class="msgtime"><span>{{items.sendTime}}</span></div>
					<div class="hearder_content">
						<div class="hearder"><img :src="items.senderImg" alt=""></div>
						<div class="msg" v-show="items.contentType==1">
							<span v-html="analysis(items.content)"></span>
							</div>
						<div class="msgpicture" v-show="items.contentType==2" v-on:click="pictrueview(items.pictrueindex)"><img :src="items.content" alt=""></div>
					</div>
				</div>
			</div>
		</div>
		<div class="chartinput" v-if="showinput">
			<div class="pictureicon">
				<van-uploader :after-read="afterRead">
					<van-icon name="photo" size="25px" />
				</van-uploader>
			</div>
			<van-field class="msginput" v-model="valuetext" placeholder="请输入内容"  :focus="true" :hold-keyboard="true"/>
			<van-button type="info" class="sendbtn" v-on:click="send()">发送</van-button>
			<van-loading size="24px" v-show="upLoadpictureLoding!=''" class="loading">{{upLoadpictureLoding}}</van-loading>
		</div>
		<div class="chartinput showlinmsg" v-else><span>{{linkmsg}}</span></div>
		<van-loading size="24px" v-if="loadingcompleted" class="loadingchart" vertical>记载中</van-loading>
	</div>
</template>

<script>
	import Mobilechat from './Mobilechat.js'
	import Vue from 'vue';
	import {
		Icon,
		Button,
		Field,
		Uploader,
		Loading,
	} from 'vant';
	Vue.use(Icon).use(Button).use(Field).use(Uploader).use(Loading);
	export default {
		...Mobilechat
	}
</script>
<style lang="less" scoped="">
	@import './Mobilechat.less';
</style>
