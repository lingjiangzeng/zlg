<template>
				<div class="chartDetail"  v-loading="chartDetailloading" element-loading-background="rgba(255, 255, 255, 0.3)"  element-loading-text="加载中">
					<div class="time_nav">
						<div class="time">
							<span>{{serviceTime.split(' ')[0].split('-')[0]}}年{{serviceTime.split(' ')[0].split('-')[1]}}月{{serviceTime.split(' ')[0].split('-')[2]}}日</span>
							<span>{{serviceTime.split(' ')[1].split(':')[0]}}:{{serviceTime.split(' ')[1].split(':')[1]}}</span>
							</div>
						<div class="nav" v-on:click="colseshowchartDetail"><i class="el-icon-close"></i></div>
	
					</div>
					<div class="usermsg">
						<div class="headerimg_name">
							<div class="headerimg"><img :src="chartlistdata.customerHeadImg" alt=""></div>
							<div class="name_carNo">
								<span class="name">{{chartlistdata.customerName}}</span>
								<span class="carNo">{{chartlistdata.customerLicensePlate}}</span>
							</div>
						</div>
						<div class=" handleDetail">
							<span class="times">
								<span class="title">时间</span>
								<span class="text">
									<span>{{serviceTime.split(' ')[0].split('-')[0]}}年{{serviceTime.split(' ')[0].split('-')[1]}}月{{serviceTime.split(' ')[0].split('-')[2]}}日</span>
									<span>{{serviceTime.split(' ')[1].split(':')[0]}}:{{serviceTime.split(' ')[1].split(':')[1]}}</span>
									<span>至</span>
									<span>{{finishTime.split(' ')[1].split(':')[0]}}:{{finishTime.split(' ')[1].split(':')[1]}}</span>
								</span>
							</span>
							<span class="responsible">
								<span class="title">经办人</span>
								<span class="text">{{chartlistdata.server}}&ensp;
									<span class="highlight" v-if="chartlistdata.handOverServer!=null && chartlistdata.handOverServer!=''">转交至</span>
									<span v-if="chartlistdata.handOverServer!=null && chartlistdata.handOverServer!=''">&ensp;{{chartlistdata.handOverServer}}</span></span>
							</span>
							<span class="evaluate">
								<span class="title">服务评价</span>
								<span class="text">
									<el-rate disabled v-model="chartlistdata.serviceScore"></el-rate>
								</span></span>
						</div>
					</div>
					<div class="chartList" id="chartdetailchartList" ref="chartdetailchartList">
						<div class="classify windowdeatil" v-for="(items,indexs) in chartlistdata.chatDtoList" :key="'classify'+indexs" :id="'windowdeatil'+items.chatId" ref="windowdeatil">
							<div class="divItme" v-for="(item, index) in items.chatRecordDTOList" :key="'chartList'+index">
								<div class="chatTime" v-if="item.sendTime != null"><span>{{item.sendTime}}</span></div>
								<div class="item">
									<div :class="{infowrapper:true,sender: item.senderType != 1, receiver: item.senderType == 1}">
										<div class="avatarwrapper">
											<img class="kfimg" :src="item.senderImg">
										</div>
										<div v-if="item.contentType=='1'" class="itemcontent ">
											<span class="text" v-html="analysis(item.content)"></span>
											<span class="isLeave" v-if="item.isLeave">留言</span>
										</div>
										<div v-else-if="item.contentType=='2'" class="itemcontentpicture" @click="pictrueview(item.content)">
											<div class="demo-image__preview">
												<el-image style="min-width:50px; min-height:73px;max-width:153px;max-height:283px;" :src="item.content" :preview-src-list="srcList"></el-image>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="flooer">
								<div class="timeline"></div><span>{{items.finishTime}}&emsp;会话已结束</span>
								<div class="timeline"></div>
							</div>
						</div>
					</div>
				</div>
</template>

<script>
	import chartDetail from './chartDetail.js'
	export default{
		...chartDetail
	}
</script>

<style lang="less" scoped="">
	@import './chartDetail.less';
</style>
