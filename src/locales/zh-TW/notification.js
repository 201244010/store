﻿export default {
	'notification.title': '標題',
	'notification.receiveTime': '接收時間',
	'notification.type': '類型',
	'notification.allread': '標記已讀',
	'notification.unreadmessage': '僅看未讀消息',
	'notification.notificationCenter': '消息中心',
	'notification.delete.confirm.prefix': '您確定要刪除選中的',
	'notification.delete.confirm.suffix': '條消息嗎？',
	'notification.read.confirm.prefix': '您確定要標記選中的',
	'notification.read.confirm.suffix': '條消息為已讀嗎？',

	// 消息類型
	'notif-model-system': '系統公告',
	'notif-model-device': '設備通知',
	'notif-model-service': '服務通知',
	'notif-model-operation': '活動通知',
	'notif-model-task': '任務跟蹤提醒',
	'notif-model-device-on/offline': '設備上線或下線通知',
	'notif-model-import-product-finish': '導入商品完成通知',
	'notif-model-import-product-failure': '導入商品失敗通知',
	'notif-model-motion-detect': '設備預警通知',
	'notif-model-ipc':'網路攝像機',
	'notif-model-esl':'電子價簽',
	'notif-model-system-task-erp':'ERP對接提醒',

	// 消息名稱
	'notif-ap-offline-title': '檢測到基站離線',
	'notif-import-product-finish-title': '商品導入完成',
	'notif-import-product-failure-title': '商品導入失敗',
	'notif-motion-detect-title': '網路攝像機偵測到異常',

	// 消息描述模版
	'notif-ap-offline-desc': '基站“##ap_name##”已離線，請檢查設備狀態',
	'notif-import-product-finish-desc':
		'商品導入完成，商品總數##total_num##, 成功導入總數##current_num##',
	'notif-import-product-failure-desc': '商品導入失敗，請重試',
	'notif-motion-detect-desc': '網路攝像機偵測到異常##source##，請即刻查看',
	'notif-motion-detect-desc-1': '圖像',
	'notif-motion-detect-desc-2': '聲音',
	'notif-motion-detect-desc-3': '圖像和聲音',

	// 消息內容範本
	'notif-ap-offline-content': '基站“##ap_name##”於##disconnect_time##離線，請檢查設備狀態',
	'notif-import-product-finish-content':
		'商品導入完成，商品總數##total_num##, 成功導入總數##current_num##',
	'notif-import-product-failure-content': '商品導入失敗，原因：##reason##',
	'notif-motion-detect-content': '網路攝像機(##device_name##)偵測到異常##source##，請即刻查看',
	'notif-motion-detect-content-1': '圖像',
	'notif-motion-detect-content-2': '聲音',
	'notif-motion-detect-content-3': '圖像和聲音',

	// 消息按鈕
	'notif-ap-offline-btn1': '查看狀態',
	'notif-device-esl-ap-offline-btn1': '查看狀態',
	'notif-import-product-failure-btn1': '查看',
	'notif-motion-detect-btn1': '查看監控',
	'notif-ap-offline-btn2': '查看狀態',
	'notif-import-product-failure-btn2': '查看狀態',
	'notif-motion-detect-btn2': '關閉',
	'notif-device-ipc-on/offline-btn1': '查看狀態',
	'notif-system-task-erp-btn1': '查看',
	'notif-device-ipc-motion-detect-video-btn1': '查看監控',
	'notif-device-ipc-motion-detect-audio-btn1': '查看監控',
	'notif-device-ipc-ota-btn1':'立即更新',

	// ipc-device-model
	'notif-model-device-ipc-ota': '版本升級提醒',
	'notif-model-device-ipc-motion-detect-video': '動態偵測（畫面偵測）通知',
	'notif-model-device-ipc-motion-detect-audio': '動態偵測（聲音偵測）通知',
	'notif-model-device-ipc-motion-detect-video-audio': '動態偵測（畫面與聲音偵測）通知',
	'notif-model-device-ipc-on/offline': '網路攝像機上下線通知',
	'notif-model-device-ipc-tf-card-detect': '存儲卡提醒',

	// ipc-device-title
	'notif-device-ipc-ota-title': '檢查到新版固件',
	'notif-device-ipc-motion-detect-video-title': '網路攝像機偵測到異常',
	'notif-device-ipc-motion-detect-audio-title': '網路攝像機偵測到異常',
	'notif-device-ipc-motion-detect-video-audio-title': '網路攝像機偵測到異常',
	'notif-device-ipc-on/offline-title': '檢測到網路攝像機離線',
	'notif-device-ipc-tf-card-detect-title': '網路攝像機的存儲卡##status##',
	'notif-device-ipc-tf-card-detect-tf-non-exist-title': '網路攝像機的存儲卡未插入或被拔出',
	'notif-device-ipc-tf-card-detect-tf-exist-title': '網路攝像機檢測到存儲卡插入',
	'notif-device-ipc-tf-card-detect-tf-capable-title': '網路攝像機檢測到可用的存儲卡',
	'notif-device-ipc-tf-card-detect-tf-non-capable-title': '網路攝像機檢測到存儲卡異常',
	'notif-device-ipc-tf-card-detect-title-1': '圖像',
	'notif-device-ipc-tf-card-detect-title-2': '聲音',
	'notif-device-ipc-tf-card-detect-title-3': '圖像和聲音',

	// ipc-device-desc
	'notif-device-ipc-ota-desc': '【##company_name##-##shop_name##】網路攝像機(##device_name##)有新版固件，請更新',
	'notif-device-ipc-motion-detect-video-desc':
		'【##company_name##-##shop_name##】網路攝像機(##device_name##)偵測到異常畫面，請即刻查看',
	'notif-device-ipc-motion-detect-audio-desc':
		'【##company_name##-##shop_name##】網路攝像機(##device_name##)偵測到異常聲音，請即刻查看',
	'notif-device-ipc-motion-detect-video-audio-desc':
		'【##company_name##-##shop_name##】網路攝像機(##device_name##)偵測到異常畫面與聲音，請即刻查看',
	'notif-device-ipc-on/offline-desc':
		'【##company_name##-##shop_name##】網路攝像機(##device_name##)已離線，請檢查設備狀態',
	'notif-device-ipc-tf-card-detect-desc': '網路攝像機的存儲卡##status##',
	'notif-device-ipc-tf-card-detect-tf-non-exist-desc':
		'【##company_name##-##shop_name##】網路攝像機(##device_name##)的存儲卡未插入或被拔出，請檢查',
	'notif-device-ipc-tf-card-detect-tf-exist-desc':
		'【##company_name##-##shop_name##】網路攝像機(##device_name##)檢測到有新存儲卡插入，請查看',
	'notif-device-ipc-tf-card-detect-tf-capable-desc':
		'【##company_name##-##shop_name##】網路攝像機(##device_name##)檢測到可用的存儲卡，請查看',
	'notif-device-ipc-tf-card-detect-tf-non-capable-desc':
		'【##company_name##-##shop_name##】網路攝像機(##device_name##)檢測到存儲卡異常，請查看',

	// 'notif-device-ipc-tf-card-detect-btn1': '查看狀態',

	'notif-device-ipc-tf-card-detect-tf-exist-btn1': '格式化',
	'notif-device-ipc-tf-card-detect-tf-non-exist-btn1': '查看狀態',
	'notif-device-ipc-tf-card-detect-tf-capable-btn1': '查看狀態',
	'notif-device-ipc-tf-card-detect-tf-non-capable-btn1': '查看狀態',

	// ipc-device-content
	'notif-device-ipc-ota-content':
		'網路攝像機(##device_name##)已發佈新版固件##bin_version##，請更新',
	'notif-device-ipc-motion-detect-video-content':
		'網路攝像機(##device_name##)偵測到異常畫面，請即刻查看',
	'notif-device-ipc-motion-detect-audio-content':
		'網路攝像機(##device_name##)偵測到異常聲音，請即刻查看',
	'notif-device-ipc-motion-detect-video-audio-content':
		'網路攝像機(##device_name##)偵測到異常畫面與聲音，請即刻查看',
	'notif-device-ipc-on/offline-content':
		'網路攝像機(##device_name##)於##disconnect_time##離線，請檢查設備狀態',
	'notif-device-ipc-tf-card-detect-content': '網路攝像機(##device_name##)的存儲卡##status##',
	'notif-device-ipc-tf-card-detect-content-0': '無sd卡',
	'notif-device-ipc-tf-card-detect-content-1': '插入sd卡，需初始化',
	'notif-device-ipc-tf-card-detect-content-2': '插入sd卡，已初始化',
	'notif-device-ipc-tf-card-detect-content-3': 'sd卡無法識別',
	'notif-device-ipc-tf-card-detect-tf-exist-content':
		'網路攝像機(##device_name##)檢測到有新存儲卡插入，建議格式化，用於本地存儲監控視頻',
	'notif-device-ipc-tf-card-detect-tf-non-exist-content':
		'網路攝像機(##device_name##)的存儲卡未插入或被拔出，請檢查',
	'notif-device-ipc-tf-card-detect-tf-capable-content':
		'網路攝像機(##device_name##)檢測到可用的存儲卡，可用於本地存儲監控視頻',
	'notif-device-ipc-tf-card-detect-tf-non-capable-content':
		'網路攝像機(##device_name##)檢測到插入的存儲卡可能已損壞，請更換存儲卡',

	// esl-device-model
	'notif-model-device-esl-erp': 'ERP對接提醒',
	'notif-model-device-esl-ota': '版本升級提醒',
	'notif-model-device-esl-ap-on/offline': '基站上下線通知',

	// esl-device-title
	'notif-system-esl-erp-title': 'ERP對接完成',
	'notif-system-task-erp-finish-title':'ERP對接完成',
	'notif-system-task-erp-failure-title':'ERP對接失敗',
	'notif-device-esl-ota-title': '檢測到新版固件',
	'notif-device-esl-ap-on/offline-title': '檢測到基站離線',

	// esl-device-desc
	'notif-system-task-erp-finish-desc':
		'【##company_name##-##shop_name##】已完成與 (##saas_name##) 的對接，成功獲取 ##total_count## 條商品資訊',
	'notif-system-task-erp-failure-desc':
		'【##company_name##-##shop_name##】未能完成與<(##saas_name##)>的對接，請重試',
	'notif-device-esl-ota-desc':
		'【##company_name##-##shop_name##】##device_name##已發佈新版固件##bin_version##，請更新',
	'notif-device-esl-ap-on/offline-desc':
		'【##company_name##-##shop_name##】基站##device_name##已離線，請檢查設備狀態',

	// esl-device-content
	'notif-device-esl-ota-content': '##device_name##已發佈新版固件##bin_version##，請更新',
	'notif-device-esl-ap-on/offline-content':
		'基站##device_name##於##disconnect_time##離線，請檢查設備狀態',
	'notif-system-task-erp-finish-content':
		'已於##timestamp##完成與（##saas_name##）的對接，成功獲取##total_count##條商品資訊',
	'notif-system-task-erp-failure-content': '未能完成與##saas_name##的對接，請重試',

	// modal
	'notif-modal-content':'您當前處於【##currentCompanyName##-##currentShopName##】，請將門店切換至【##targetCompanyName##-##targetShopName##】後查看',
	'notif-modal-title-info':'提示',
	'notif-modal-known-text':'知道了'
};
