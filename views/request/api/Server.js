/**
 * test模块接口列表
 */

import base from './base'; // 导入接口域名列表
import axios from 'request/http'; // 导入http中创建的axios实例

const server = {
    // 请求聊天记录
    getMsgHis(userId) {
        return axios.post(`${base.test}chat/queryUserChatRecordByChatId`, {
            userId: userId,
            kefuId: JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
        });
    },
	/* 移动端获取聊天记录 */
	mbbliegetMsgHis(userId) {
	    return axios.post(`${base.test}chat/queryUserChatRecordByChatId`, {
	        userId: userId,
	        kefuId: sessionStorage.getItem("adminId"),
	    });
	},
    /* 获取列表数据 */
    servicerecord(page,selectValue,rows) {
        return axios.post(`${base.test}chat/serviceRecordForKfId`, {
            page: page,
            sEcho: '',
            rows:rows,
            adminId: JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
            selectValue: selectValue
        });
    },
    /* 获取用户数据*/
    changuserinfo(userId) {
        return axios.post(`${base.test}chat/queryUserInfoForCharRecord`, {
            userId: userId,
            kefuId: JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
        });
    },
    /*用户登入*/
    login(name, password, businessIds) {
        return axios.post(`${base.test}KFLogin`, {
            loginName: name,
            password: password,
            businessIds:businessIds,
            submitBtn: '',
        });
    },
    /* 获取聊天列表*/
    getchartlsit(isLeave) {
        return axios.post(`${base.test}chat/queryUserChatList`, {
            adminId: JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
			isLeave:isLeave,
        });
    },
    /*更改在线状态*/
    changeonlinestatus(value) {
        return axios.post(`${base.test}admin/updateOnlineStatus`, {
            adminId: 1,
            onlineStatus: 0,//0下线、1在线、2休息或离开
        });
    },
    /* 请求结束服务接口*/
    endoftheservice(userId) {
        return axios.post(`${base.test}chat/finishUserChat`, {
            userId: userId,
            remark: ''
        });
    },
    /* 客服转交列表*/
    getkufulist() {
        return axios.post(`${base.test}chat/deliverToOtherKfList`, {
            adminId: JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
        });
    },
    /* 聊天消息图片上传接口*/
    uploadImgForWX(file, chatId) {
        return axios.post(`${base.test}file/uploadImgForWX`, {
            file: file,
            chatId: chatId
        });
    },
    /* 记录详情接口*/
    serviceRecordDetail(chatId) {
        return axios.post(`${base.test}chat/serviceRecordDetail`, {
            chatId: chatId
        });
    },
    /* 确认转交接口*/
    deliverToOtherServer(userId, deliverKefuId) {
        return axios.post(`${base.test}chat/deliverToOtherServer`, {
            userId: userId,
            kefuId: JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
            deliverKefuId: deliverKefuId
        });
    },

    /* 移动端获取open */
    pgetOpenId(param) {
        return axios.post(`${base.test}weichatApi/WxPay/getAccessToken`, {
            code: param.code
        });
    },

    /* 移动端获取open */
    pLogin(param) {
        return axios.post(`${base.test}weichatApi/WX/loginChat`, {
            openId: localStorage.getItem('wxopenId')
        });
    },
    /*监听页面切换清除缓存接口*/
    deleteKFWindowlocationRedis() {
        return axios.post(`${base.test}chat/deleteKFWindowlocationRedis`, {
            kefuId: JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
        });
    },
	/* 获取业务数据数据 */
    getAllBusiness() {
        return axios.post(`${base.test}getAllBusiness`);
    },
	/* 当websokit 消息推送获取用户数据 */
	getusermsg(userId) {
	    return axios.post(`${base.test}chat/getUserInforByUserId`,{
			userId:userId,
		});
	},
	/* 修改用户备注名 */
	remarkname(userId,remark) {
	    return axios.post(`${base.test}user/updateUserRemark`,{
			userId:userId,
			remark:remark
		});
	},
	/* 使用客服名 或者 备注名搜索 */
	queryUserInforByRemark(selectValue) {
	    return axios.post(`${base.test}user/queryUserInforByRemark`,{
			selectValue:selectValue,
			kefuId: JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
		});
	},
	/* 更改业务类型 */
	updateAdminBusinessInfo(businessIds) {
	    return axios.post(`${base.test}chat/updateAdminBusinessInfo`,{
			businessIds:businessIds,
			adminId: JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
		});
	},
	/* 图片上传 */
	uploadpictures(base64,userId,type) {
	    return axios.post(`${base.test}file/uploadImgForWX`,{
			userId: userId,
			kefuId:JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
			type:type,
			base64:base64,
			
		});
	},
	moblieuploadpictures(base64,userId,type) {
	    return axios.post(`${base.test}file/uploadImgForWX`,{
			userId: userId,
			kefuId:sessionStorage.getItem("adminId"),
			type:type,
			base64:base64,
			
		});
	},
	/* 获取工单分类及部门人员 */
	getWOTypeAndDeptInfo() {
	    return axios.post(`${base.test}workorder/getWOTypeAndDeptInfo`,{
			adminId:JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
			
		});
	},
	/* 提交工单form 数据 */
	addWorkOrder(type,priority,title,content,userId,handlerId,chatId) {
	    return axios.post(`${base.test}workorder/addWorkOrder`,{
			type:type,
			priority:priority,
			title:title,
			content:content,
			userId:userId == null ? '':userId,
			handlerId:handlerId,
			createrId:JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
			chatId:chatId == null ? '':chatId,
		});
	},
	/* 工单工单列表 */
	billlist(type,status,selectValue,createTime,woType,page,rows) {
	    return axios.post(`${base.test}workorder/list`,{
			adminId:JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
			type:type,
			status:status,
			selectValue:selectValue,
			createTime:createTime != '' ? createTime[0] : '',
			endTime:createTime != '' ? createTime[1] : '',
			woType:woType,
			page:page,
			rows:rows,
		});
	},
	/* 获取客服对应对应的客户工单 */
	getAdminWOList(userId) {
	    return axios.post(`${base.test}workorder/getAdminWOList`,{
			adminId:JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
			userId:userId,
		});
	},
	/* 获取工单详情 */
	getWorkOrderDetail(code,userId,type) {
	    return axios.post(`${base.test}workorder/getWorkOrderDetail`,{
			code:code,
			userId:userId,
			adminId:JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
			type:type,
			
		});
	},
	/* 接受工单 */
	acceptWorkOrder(code) {
	    return axios.post(`${base.test}workorder/acceptWorkOrder`,{
			code:code,
			adminId:JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
		});
	},
	/* 转交工单 */
	deliverWorkOrder(code,deliverId,remark) {
	    return axios.post(`${base.test}workorder/deliverWorkOrder`,{
			deliverId:deliverId,
			code:code,
			remark:remark,
		});
	},
	/* 退回工单 */
	returnWorkOrder(code,remark) {
	    return axios.post(`${base.test}workorder/returnWorkOrder`,{
			code:code,
			adminId:JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
			remark:remark,
		});
	},
	/* 完成工单 */
	finishWorkOrder(code,remark) {
	    return axios.post(`${base.test}workorder/finishWorkOrder`,{
			code:code,
			adminId:JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
			remark:remark,
		});
	},
	/* 关闭工单 */
	closeWorkOrder(code) {
	    return axios.post(`${base.test}workorder/closeWorkOrder`,{
			code:code,
			adminId:JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
		});
	},
	/* 重新发起工单获取回显信息 */
	reLaunchWorkOrder(code) {
	    return axios.post(`${base.test}workorder/reLaunchWorkOrder`,{
			code:code,
		});
	},
	/*客服通话列表 */
	callList(isToday,selectValue,page,rows) {
	    return axios.post(`${base.test}callService/callList`,{
			seatId:JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
			isToday:isToday,
			selectValue:selectValue,
			page:page,
			rows:rows,
		});
	},
	/*呼叫中心详情 */
	callCenterdetail(chCallin,isShowService) {
	    return axios.post(`${base.test}callService/getCallDetail`,{
			chCallin:chCallin,
			adminId:JSON.parse(sessionStorage.getItem("vuex")).serverModule.userInfo.id,
			isShowService:isShowService
		});
	},
}
/*  */
export default server