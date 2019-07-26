export default {
	'notification.title': '标题',
	'notification.receiveTime': '接收时间',
	'notification.type': '类型',
	'notification.allread': '标记已读',
	'notification.unreadmessage': '仅看未读消息',
	'notification.notificationCenter': '消息中心',
	'notification.delete.confirm.prefix': '您确定要删除选中的',
	'notification.delete.confirm.suffix': '条消息吗？',
	'notification.read.confirm.prefix': '您确定要标记选中的',
	'notification.read.confirm.suffix': '条消息为已读吗？',

	// 消息类型
	'notif-model-system': '系统公告',
	'notif-model-device': '设备通知',
	'notif-model-service': '服务通知',
	'notif-model-operation': '活动通知',
	'notif-model-task': '任务跟踪提醒',
	'notif-model-device-on/offline': '设备上线或下线通知',
	'notif-model-import-product-finish': '导入商品完成通知',
	'notif-model-import-product-failure': '导入商品失败通知',
	'notif-model-motion-detect': '设备预警通知',

	// 消息名称
	'notif-ap-offline-title': '检测到基站离线',
	'notif-import-product-finish-title': '商品导入完成',
	'notif-import-product-failure-title': '商品导入失败',
	'notif-motion-detect-title': '网络摄像机侦测到异常',

	// 消息描述模版
	'notif-ap-offline-desc': '基站“%s”已离线，请检查设备状态',
	'notif-import-product-finish-desc': '商品导入完成，商品总数%s, 成功导入总数%s',
	'notif-import-product-failure-desc': '商品导入失败，请重试',
	'notif-motion-detect-desc': '网络摄像机侦测到异常%s，请即刻查看',
	'notif-motion-detect-desc-1': '图像',
	'notif-motion-detect-desc-2': '声音',
	'notif-motion-detect-desc-3': '图像和声音',

	// 消息内容模板
	'notif-ap-offline-content': '基站“%s”于%s离线，请检查设备状态',
	'notif-import-product-finish-content': '商品导入完成，商品总数%s, 成功导入总数%s',
	'notif-import-product-failure-content': '商品导入失败，原因：%s',
	'notif-motion-detect-content': '网络摄像机（%s）侦测到异常%s，请即刻查看',
	'notif-motion-detect-content-1': '图像',
	'notif-motion-detect-content-2': '声音',
	'notif-motion-detect-content-3': '图像和声音',

	// 消息按钮
	'notif-ap-offline-btn1': '查看状态',
	'notif-import-product-failure-btn1': '查看',
	'notif-motion-detect-btn1': '查看监控',
	'notif-ap-offline-btn2': '查看状态',
	'notif-import-product-failure-btn2': '查看状态',
	'notif-motion-detect-btn2': '关闭',

	// ipc-device-model
	'notif-model-device-ipc-ota': '版本升级提醒',
	'notif-model-device-ipc-motion-detect-video': '动态侦测（画面侦测）通知',
	'notif-model-device-ipc-motion-detect-audio': '动态侦测（声音侦测）通知',
	'notif-model-device-ipc-motion-detect-video-audio': '动态侦测（画面与声音侦测）通知',
	'notif-model-device-ipc-on/offline': '网络摄像机上下线通知',
	'notif-model-device-ipc-tf-card-detect': '存储卡提醒',

	// ipc-device-title
	'notif-device-ipc-ota-title': '检查到新版固件',
	'notif-device-ipc-motion-detect-video-title': '网络摄像机侦测到异常',
	'notif-device-ipc-motion-detect-audio-title': '网络摄像机侦测到异常',
	'notif-device-ipc-motion-detect-video-audio-title': '网络摄像机侦测到异常',
	'notif-device-ipc-on/offline-title': '检测到网络摄像机离线',
	// todo
	'notif-device-ipc-tf-card-detect-title': '网络摄像机侦测到异常',

	// ipc-device-desc
	'notif-device-ipc-ota-desc': '网络摄像机有新版固件，请更新',
	'notif-device-ipc-motion-detect-video-desc': '网络摄像机侦测到异常画面，请即刻查看',
	'notif-device-ipc-motion-detect-audio-desc': '网络摄像机侦测到异常声音，请即刻查看',
	'notif-device-ipc-motion-detect-video-audio-desc': '网络摄像机侦测到异常画面与声音，请即刻查看',
	'notif-device-ipc-on/offline-desc': '网络摄像机已离线，请检查设备状态',
	'notif-device-ipc-tf-card-detect-desc': '网络摄像机的存储卡%s',

	// ipc-device-content
	'notif-device-ipc-ota-content': '网络摄像机（%s）已发布新版固件%s，请更新',
	'notif-device-ipc-motion-detect-video-content': '网络摄像机（%s）侦测到异常画面，请即刻查看',
	'notif-device-ipc-motion-detect-audio-content': '网络摄像机（%s）侦测到异常声音，请即刻查看',
	'notif-device-ipc-motion-detect-video-audio-content':
		'网络摄像机（%s）侦测到异常画面与声音，请即刻查看',
	'notif-device-ipc-on/offline-content': '网络摄像机（%s）于%s离线，请检查设备状态',
	'notif-device-ipc-tf-card-detect-content': '网络摄像机（%s）的存储卡%s',

	// esl-device-model
	'notif-model-system-esl-erp': 'ERP对接提醒',
	'notif-model-system-esl-ota': '版本升级提醒',
	'notif-model-system-esl-ap-on/offline': '基站上下线通知',

	// esl-device-title
	'notif-system-esl-erp-title': 'ERP对接完成',
	'notif-device-esl-ota-title': '检测到新版固件',
	'notif-device-esl-ap-on/offline-title': '检测到基站离线',

	// esl-device-desc
	'notif-system-esl-erp-desc':
		'【商户-门店】已完成与<(康铭泰克速店农贸版)>的对接，成功获取<1234>条商品信息',
};
