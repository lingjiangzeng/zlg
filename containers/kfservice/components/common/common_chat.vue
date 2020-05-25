<template>
	<div class="commonchatwrapper">
			<div class="commonchatmain" id="common_chat_main" ref="common_chat_main" v-on:mousewheel="scrollfun" >
					<div class="chartinner">
						<div class="chartclassifys" v-for="(items,indexs) in chartmsgArry" :key="'classifys'+indexs" :id="'chartclassifys'+items.chatId" ref="chartclassifys">
							<div class="divItmes" v-for="(item, index) in items.chatRecordDTOList" :key="index">
								<div class="chartTimes"  v-if="item.sendTime != null"><span>{{item.sendTime}}</span></div>
								<div class="chartitem">
									<div :class="{chartsender:item.senderType != 1,chartreceiver: item.senderType == 1}">
										<div class="chartavatarwrapper">
											<img class="chartkfimg" :src="item.senderImg">
										</div>
										<div v-if="item.contentType=='1'" class="chartitemcontentmsg">
											<span class="chartcharttext" v-html="analysis(item.content)"></span>
											<!-- 只有客户才有 -->
											<span class="chartisLeave" v-if="item.isLeave">留言</span>
											<!-- 只有客服才有 -->
											<i class="el-icon-warning"  v-if=" item.senderType != 1  && item.msgsendstatus==3 "></i>
											<i class="el-icon-loading" v-if=" item.senderType != 1  && item.msgsendstatus==2 "></i>
										</div>
										<div v-else-if="item.contentType=='2'" class="chartitemcontentpicture" @click="pictrueview(item.content)">
											<div class="demo-image__preview">
												<div class="uploaderror" v-if="item.msgsendstatus!=1 && item.senderType != 1">
													<i  v-if="item.msgsendstatus==3" class="el-icon-warning"></i>
													<i class="el-icon-loading" v-if="item.msgsendstatus==2 "></i>
													<span  v-if="item.msgsendstatus==2" class="loading">发送中</span>
												</div>
												<el-image style="min-width:50px; min-height:73px;max-width:153px;max-height:283px;" :src="item.content" :preview-src-list="srcList"></el-image>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
			</div>

			<div class="commonchatfooter" >
				<div class="oprwrapper">
					<el-popover placement="top-start" width="400" trigger="click">
						<emotionicon @emotionicon="emotioniconCtr"></emotionicon>
						<img src="../../assets/icon_smeil@2x.png" alt="" slot="reference" class="emoticons" />
					</el-popover>
					<img src="../../assets/icon_file@2x.png" alt="" class="file" @click="fileUpload_click">
					<form method="post" enctype="multipart/form-data">
						<input type="file" name="uploadFile"  ref="uploadFiles" id="common_chat_opr_fileUpload" @change="filechang" style="display:none;" accept="image/*">
					</form>
				</div>
				<div class="inputwrapper">
					<div  class="inputContent " id="common_chat_input"  ref="inputContent" contenteditable="true" @keydown.stop="inputContent_keydown"
					 placeholder="请输入内容 (shift+enter换行)"  v-on:paste="pastefun" v-on:input="divinput"></div>
					 <el-button type="primary" size="small" @click="send()" class="send-btn">发送</el-button>
				</div>
			</div>
	</div>
</template>

<script>
	import common_chat from './common_chat.js';
	export default {
		...common_chat
	}
</script>
<style lang="less" scoped="">
	@import "./common_chat.less";
</style>
c-list="srcList"></el-image>