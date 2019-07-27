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
	'notif-ap-offline-desc': '基站“##ap_name##”已离线，请检查设备状态',
	'notif-import-product-finish-desc':
		'商品导入完成，商品总数##total_num##, 成功导入总数##current_num##',
	'notif-import-product-failure-desc': '商品导入失败，请重试',
	'notif-motion-detect-desc': '网络摄像机侦测到异常##source##，请即刻查看',
	'notif-motion-detect-desc-1': '图像',
	'notif-motion-detect-desc-2': '声音',
	'notif-motion-detect-desc-3': '图像和声音',

	// 消息内容模板
	'notif-ap-offline-content': '基站“##ap_name##”于##disconnect_time##离线，请检查设备状态',
	'notif-import-product-finish-content':
		'商品导入完成，商品总数##total_num##, 成功导入总数##current_num##',
	'notif-import-product-failure-content': '商品导入失败，原因：##reason##',
	'notif-motion-detect-content': '网络摄像机（##device_name##）侦测到异常##source##，请即刻查看',
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
	'notif-device-ipc-tf-card-detect-title': '网络摄像机的存储卡##status##',
	'notif-device-ipc-tf-card-detect-tf-non-exist-title': '网络摄像机的存储卡未插入或被拔出',
	'notif-device-ipc-tf-card-detect-tf-exist-title': '网络摄像机检测到存储卡插入',
	'notif-device-ipc-tf-card-detect-tf-capable-title': '网络摄像机检测到可用的存储卡',
	'notif-device-ipc-tf-card-detect-tf-non-capable-title': '网络摄像机检测到存储卡异常',
	'notif-device-ipc-tf-card-detect-title-1': '图像',
	'notif-device-ipc-tf-card-detect-title-2': '声音',
	'notif-device-ipc-tf-card-detect-title-3': '图像和声音',

	// ipc-device-desc
	'notif-device-ipc-ota-desc': '网络摄像机有新版固件，请更新',
	'notif-device-ipc-motion-detect-video-desc':
		'[##company_name##-##shop_name##]网络摄像机##device_name##侦测到异常画面，请即刻查看',
	'notif-device-ipc-motion-detect-audio-desc':
		'[##comapny_name## - ##shop_name##]网络摄像机##device_name##侦测到异常声音，请即刻查看',
	'notif-device-ipc-motion-detect-video-audio-desc':
		'[##comapny_name## - ##shop_name##]网络摄像机 ##device_name## 侦测到异常画面与声音，请即刻查看',
	'notif-device-ipc-on/offline-desc': '网络摄像机已离线，请检查设备状态',
	'notif-device-ipc-tf-card-detect-desc': '网络摄像机的存储卡##status##',
	'notif-device-ipc-tf-card-detect-tf-non-exist-desc':
		'[##company_name##-##shop_name##]网络摄像机##device_name##的存储卡未插入或被拔出，请检查',
	'notif-device-ipc-tf-card-detect-tf-exist-desc':
		'[##company_name##-##shop_name##]网络摄像机##device_name##检测到有新存储卡插入，请查看',
	'notif-device-ipc-tf-card-detect-tf-capable-desc':
		'[##company_name##-##shop_name##]网络摄像机##device_name##检测到可用的存储卡，请查看',
	'notif-device-ipc-tf-card-detect-tf-non-capable-desc':
		'[##company_name##-##shop_name##]网络摄像机##device_name##检测到存储卡异常，请查看',

	// 'notif-device-ipc-tf-card-detect-btn1': '查看状态',

	'notif-device-ipc-tf-card-detect-tf-exist-btn1': '格式化',
	'notif-device-ipc-tf-card-detect-tf-non-exist-btn1': '查看状态',
	'notif-device-ipc-tf-card-detect-tf-capable-btn1': '查看状态',
	'notif-device-ipc-tf-card-detect-tf-non-capable-btn1': '查看状态',

	// ipc-device-content
	'notif-device-ipc-ota-content':
		'网络摄像机（##device_name##）已发布新版固件##bin_version##，请更新',
	'notif-device-ipc-motion-detect-video-content':
		'网络摄像机（##device_name##）侦测到异常画面，请即刻查看',
	'notif-device-ipc-motion-detect-audio-content':
		'网络摄像机（##device_name##）侦测到异常声音，请即刻查看',
	'notif-device-ipc-motion-detect-video-audio-content':
		'网络摄像机（##device_name##）侦测到异常画面与声音，请即刻查看',
	'notif-device-ipc-on/offline-content':
		'网络摄像机（##device_name## 于##disconnect_time##离线，请检查设备状态',
	'notif-device-ipc-tf-card-detect-content': '网络摄像机（##device_name##）的存储卡##status##',
	'notif-device-ipc-tf-card-detect-content-0': '无sd卡',
	'notif-device-ipc-tf-card-detect-content-1': '插入sd卡，需初始化',
	'notif-device-ipc-tf-card-detect-content-2': '插入sd卡，已初始化',
	'notif-device-ipc-tf-card-detect-content-3': 'sd卡无法识别',
	'notif-device-ipc-tf-card-detect-tf-exist-content':
		'网络摄像机##device_name##检测到有新存储卡插入，建议格式化，用于本地存储监控视频',
	'notif-device-ipc-tf-card-detect-tf-non-exist-content':
		'网络摄像机##device_name##的存储卡未插入或被拔出，请检查',
	'notif-device-ipc-tf-card-detect-tf-capable-content':
		'网络摄像机##device_name##检测到可用的存储卡，可用于本地存储监控视频',
	'notif-device-ipc-tf-card-detect-tf-non-capable-content':
		'网络摄像机##device_name##检测到插入的存储卡可能已损坏，请更换存储卡',

	// esl-device-model
	'notif-model-device-esl-erp': 'ERP对接提醒',
	'notif-model-device-esl-ota': '版本升级提醒',
	'notif-model-device-esl-ap-on/offline': '基站上下线通知',

	// esl-device-title
	'notif-system-esl-erp-title': 'ERP对接完成',
	'notif-device-esl-ota-title': '检测到新版固件',
	'notif-device-esl-ap-on/offline-title': '检测到基站离线',

	// esl-device-desc
	'notif-system-esl-erp-desc':
		'[##company_name##-##shop_name##]已完成与 (##saas_name##) 的对接，成功获取 ##total_count## 条商品信息',
	'notif-device-esl-ota-des':
		'[##company_name##-##shop_name##]##device_name##已发布新版固件##bin_version##，请更新',
	'notif-device-esl-ap-on/offline-desc':
		'[##company_name##-##shop_name##]基站##device_name##已离线，请检查设备状态',

	// esl-device-content
	'notif-device-esl-ota-content': '##device_name##已发布新版固件##bin_version##，请更新',
	'notif-device-esl-ap-on/offline-content':
		'基站##device_name##于##disconnect_time##离线，请检查设备状态',
	'notif-system-task-erp-finish-content':
		'已完成与##saas_name##的对接，成功获取##total_count##条商品信息',
	'notif-system-task-erp-failure-content': '未能完成与##saas_name##的对接，请重试',
};
