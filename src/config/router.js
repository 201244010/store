const router = [
	{
		path: '/userProtocol',
		// component: '../layouts/SunmiLayout',
		id: 'userProtocol',
		routes: [
			{
				path: '/userProtocol/serviceProtocol',
				component: './IPC/CloudStorage/protocol.js',
				id: 'serviceProtocol',
			},
		],
	},
	{
		path: '/user',
		component: '../layouts/SunmiLayout',
		id: 'user',
		routes: [
			{ path: '/user', redirect: '/user/login' },
			{ path: '/user/login', component: './User/Login/LoginUI', id: 'userLogin' },
			{
				path: '/user/storeRelate',
				component: './User/StoreRelate/StoreRelateUI',
				id: 'userStore',
			},
			{
				path: '/user/merchantCreate',
				component: './User/StoreRelate/StoreRelateUI',
				id: 'userMerchant',
			},
		],
	},

	{
		path: '/studio',
		component: '../layouts/BlankLayout',
		id: 'studio',
		routes: [{ path: '/studio', component: './Studio' }],
	},

	{
		path: '/studioAlone',
		component: '../layouts/BlankLayout',
		id: 'StudioAlone',
		routes: [{ path: '/studioAlone', component: './StudioAlone' }],
	},

	{
		path: '/show',
		component: '../layouts/BlankLayout',
		id: 'show',
		routes: [{ path: '/show', redirect: '/showcase/login' }],
	},

	{
		path: '/flow',
		component: '../layouts/BlankLayout',
		id: 'flow',
		routes: [{ path: '/flow', redirect: '/showcase/login' }],
	},

	{
		path: '/',
		component: '../layouts/BasicLayout',
		id: 'root',
		Routes: ['/src/components/AuthorithCheck'],
		routes: [
			{ path: '/', redirect: '/index' },
			{
				path: '/index',
				hideInMenu: true,
				component: './Index',
			},
			{
				path: '/dashboard',
				name: 'dashboard',
				icon: 'blank',

				routes: [
					{
						path: '/dashboard',
						id: 'dashboard',
						hideInMenu: true,
						component: './DataBoard',
					},
				],
			},

			// 客流
			{
				path: '/dataAnalyze',
				icon: 'blank',
				name: 'dataAnalyze',
				routes: [
					{ path: '/dataAnalyze', redirect: '/dataAnalyze/passenger' },
					{
						path: '/dataAnalyze/passenger',
						name: 'passenger',
						id: 'passengerAnalyze',
						component: './PassengerAnalyze',
					},
				],
			},

			// 监控
			{
				path: '/storeMonitor',
				icon: 'blank',
				name: 'storeMonitor',
				routes: [
					{ path: '/storeMonitor', redirect: '/storeMonitor/motionMessage' },
					{
						path: '/storeMonitor/motionMessage',
						name: 'motionMessage',
						id: 'motionMessage',
						component: './IPC/MotionList/index.js',
					},
					{
						path: '/storeMonitor/liveReplay',
						id: 'liveReplay',
						name: 'liveReplay',
						routes: [
							{
								path: '/storeMonitor/liveReplay',
								name: 'liveDeviceList',
								hideInMenu: true,
								id: 'liveDeviceList',
								component: './IPC/IPCList/index.js',
							},
							{
								path: '/storeMonitor/liveReplay/live',
								name: 'liveReplayLive',
								id: 'liveReplayLive',
								hideInMenu: true,
								component: './IPC/Live/Live.js',
							},
							{
								path: '/storeMonitor/liveReplay/ipcManagement',
								name: 'liveReplayManagement',
								id: 'liveReplayManagement',
								hideInMenu: true,
								component: './IPC/IPCManagement/IPCManagement.js',
							},
						],
					},
					{
						path: '/storeMonitor/cloudStorage',
						name: 'cloudStorage',
						id: 'cloudStorage',
						component: './IPC/CloudStorage/cloudStorage.js',
					},
					{
						path: '/storeMonitor/cloudStorage/subscriptionSuccess',
						name: 'subscriptionSuccess',
						id: 'subscriptionSuccess',
						hideInMenu: true,
						component: './IPC/CloudStorage/subscriptionSuccess.js',
					},
					{
						path: '/storeMonitor/cloudStorage/orderSubmission',
						name: 'orderSubmission',
						hideInMenu: true,
						routes: [
							{
								path: '/storeMonitor/cloudStorage/orderSubmission/qrpay',
								name: 'qrpay',
								id: 'qrpay',
								hideInMenu: true,
								component: './IPC/CloudStorage/OrderSubmission/QRCodePayment.js',
							},
							{
								path: '/storeMonitor/cloudStorage/orderSubmission/paymentPage',
								name: 'paymentPage',
								id: 'paymentPage',
								hideInMenu: true,
								component: './IPC/CloudStorage/OrderSubmission/paymentPage.js',
							},
							{
								path: '/storeMonitor/cloudStorage/orderSubmission',
								id: 'orderSubmission',
								hideInMenu: true,
								component: './IPC/CloudStorage/OrderSubmission/orderSubmission.js',
							},
						],
					},
				],
			},

			// 商品
			{
				path: '/productManagement',
				icon: 'blank',
				name: 'productManagement',
				routes: [
					{
						path: '/productManagement',
						redirect: '/productManagement/list',
					},
					{
						path: '/productManagement/list',
						name: 'list',
						id: 'productList',
						component: './BasicData/ProductManagement',
					},
					{
						path: '/productManagement/list/productCreate',
						name: 'list',
						id: 'productCreate',
						hideInMenu: true,
						component: './BasicData/ProductManagement/ProductCU',
					},
					{
						path: '/productManagement/list/productUpdate',
						name: 'list',
						id: 'productUpdate',
						hideInMenu: true,
						component: './BasicData/ProductManagement/ProductCU',
					},
					{
						path: '/productManagement/list/productInfo',
						name: 'list',
						id: 'productInfo',
						hideInMenu: true,
						component: './BasicData/ProductManagement/ProductInfo',
					},
					{
						path: '/productManagement/list/erpImport',
						name: 'list',
						id: 'erpImport',
						hideInMenu: true,
						component: './BasicData/ProductManagement/ERPImport',
					},
					{
						path: '/productManagement/list/excelUpload',
						name: 'list',
						id: 'excelUpload',
						hideInMenu: true,
						component: './BasicData/ProductManagement/ExcelUpload',
					},
				],
			},

			// 交易
			{
				path: '/transManagement',
				icon: 'blank',
				name: 'transManagement',
				routes: [
					{
						path: '/transManagement',
						redirect: '/transManagement/cashVerify',
					},
					{
						path: '/transManagement/cashVerify',
						name: 'posList',
						id: 'posList',
						component: './IPC/POSManagement/POSList.js',
					},
					{
						path: '/transManagement/orderDetail',
						id: 'orderDetail',
						name: 'orderDetail',
						component: './DashBoard/OrderDetail',
					},
					{
						path: '/transManagement/cashVerify/bindPOSDevice',
						name: 'bindPOSDevice',
						id: 'bindPOSDevice',
						hideInMenu: true,
						component: './IPC/POSManagement/BindPOS.js',
					},
					{
						path: '/transManagement/cashVerify/videos',
						name: 'videos',
						id: 'videos',
						hideInMenu: true,
						component: './IPC/TradeVideos/index.js',
					},
				],
			},

			// 服务
			{
				path: '/serviceManagement',
				name: 'serviceManagement',
				icon: 'blank',
				routes: [
					{
						path: '/serviceManagement',
						redirect: '/serviceManagement/list',
					},
					{
						path: '/serviceManagement/list',
						id: 'serviceList',
						name: 'serviceList',
						component: './ServiceManagement/ServiceList',
					},
					{
						path: '/serviceManagement/orderManagement',
						id: 'orderManagement',
						name: 'orderManagement',
						component: './OrderManagement/OrderList'
					},
					{
						path: '/serviceManagement/orderManagement/orderDetail',
						id: 'serviceOrderDetail',
						component: './OrderManagement/OrderDetail',
						hideInMenu: true
					},
				],
			},

			// 设备
			{
				path: '/deviceManagement',
				name: 'deviceManagement',
				icon: 'blank',
				routes: [
					{
						path: '/deviceManagement',
						redirect: '/deviceManagement/ipcList',
					},
					// 智能摄像机
					{
						path: '/deviceManagement/ipcList',
						icon: 'blank',
						id: 'ipcList',
						name: 'ipcList',
						routes: [
							{
								path: '/deviceManagement/ipcList',
								redirect: '/deviceManagement/ipcList/deviceList',
							},
							{
								path: '/deviceManagement/ipcList/deviceList',
								name: 'deviceList',
								id: 'deviceList',
								component: './IPC/IPCList/index.js',
							},
							{
								path: '/deviceManagement/ipcList/deviceList/live',
								name: 'live',
								id: 'live',
								hideInMenu: true,
								component: './IPC/Live/Live.js',
							},
							{
								path: '/deviceManagement/ipcList/deviceList/ipcManagement',
								name: 'ipcManagement',
								id: 'ipcManagement',
								hideInMenu: true,
								component: './IPC/IPCManagement/IPCManagement.js',
							},
						],
					},
					// 电子价签
					{
						path: '/deviceManagement/esl',
						name: 'esl',
						id: 'esl',
						icon: 'blank',
						routes: [
							{ path: '/deviceManagement/esl', redirect: '/deviceManagement/esl/electricLabel' },
							{
								path: '/deviceManagement/esl/electricLabel',
								name: 'electricLabel',
								id: 'electricLabel',
								component: './DeviceManagement/ESL/ElectricLabel',
							},
							{
								path: '/deviceManagement/esl/template',
								name: 'template',
								id: 'template',
								component: './Template',
							},
							{
								path: '/deviceManagement/esl/commRecord',
								hideInMenu: true,
								name: 'commRecord',
								id: 'commRecord',
								component: './DeviceManagement/ESL/CommRecord',
							},
							{
								path: '/deviceManagement/esl/baseStation',
								name: 'baseStation',
								id: 'baseStation',
								component: './DeviceManagement/ESL/BaseStation',
							},
							{
								path: '/deviceManagement/esl/deviceUpgrade',
								name: 'deviceUpgrade',
								id: 'deviceUpgrade',
								routes: [
									{
										path: '/deviceManagement/esl/deviceUpgrade',
										name: 'overview',
										id: 'deviceUpgradeOverview',
										hideInMenu: true,
										component: './DeviceManagement/ESL/DeviceUpgrade',
									},
									{
										path: '/deviceManagement/esl/deviceUpgrade/deviceESL',
										name: 'deviceESL',
										id: 'deviceESL',
										hideInMenu: true,
										component: './DeviceManagement/ESL/DeviceESL',
									},
									{
										path: '/deviceManagement/esl/deviceUpgrade/deviceAP',
										name: 'deviceAP',
										id: 'deviceAP',
										hideInMenu: true,
										component: './DeviceManagement/ESL/DeviceAP',
									},
								],
							},
							{
								path: '/deviceManagement/esl/systemConfig',
								name: 'systemConfig',
								id: 'systemConfig',
								component: './DeviceManagement/ESL/SystemConfig',
								hideInMenu: true,
							},
							{
								path: '/deviceManagement/esl/advSystemConfig',
								name: 'advancedSystemConfig',
								id: 'advancedSystemConfig',
								component: './DeviceManagement/ESL/SystemConfig/Advanced',
								hideInMenu: true,
							},
						],
					},
					// 网络设备
					{
						path: '/deviceManagement/network',
						name: 'network',
						id: 'network',
						icon: 'blank',
						routes: [
							{ path: '/deviceManagement/network', redirect: '/deviceManagement/network/list' },
							{
								path: '/deviceManagement/network/list',
								name: 'networkList',
								id: 'networkList',
								component: './DeviceManagement/Network/NetworkOverview',
							},
							{
								path: '/deviceManagement/network/list/detail',
								name: 'detail',
								id: 'networkDetail',
								hideInMenu: true,
								component: './DeviceManagement/Network/NetworkOverview/NetworkDetail',
							},
							{
								path: '/deviceManagement/network/configManagement',
								name: 'configManagement',
								id: 'configManagement',
								// hideInMenu: true,
								component: './DeviceManagement/Network/NetworkConfig',
							},
							{
								path: '/deviceManagement/network/list/clientList',
								name: 'clientList',
								id: 'clientList',
								hideInMenu: true,
								component: './DeviceManagement/Network/NetworkOverview/ClientList',
							},
						],
					},
					{
						path: '/deviceManagement/iotAccess',
						name: 'iotAccess',
						id: 'iotAccess',
						icon: 'blank',
						routes: [
							{
								path: '/deviceManagement/iotAccess/posAccess',
								name: 'posAccess',
								id: 'posAccess',
								routes: [
									{
										path: '/deviceManagement/iotAccess/posAccess',
										name: 'posAccessOverview',
										id: 'posAccessOverview',
										hideInMenu: true,
										component: './IotAccess/PosAccess',
									},
									{
										path: '/deviceManagement/iotAccess/posAccess/detail',
										name: 'detail',
										id: 'posAccessDetail',
										hideInMenu: true,
										component: './IotAccess/PosAccessDetail',
									},
								]
							},
						],
					},
				],
			},

			// 基础管理
			{
				path: '/basicData',
				name: 'basicData',
				icon: 'blank',
				id: 'basicData',
				routes: [
					{
						path: '/basicData',
						redirect: '/basicData/merchantManagement',
					},
					{
						path: '/basicData/merchantManagement',
						name: 'merchantManagement',
						routes: [
							{
								path: '/basicData/merchantManagement',
								name: 'view',
								id: 'merchantView',
								hideInMenu: true,
								component: './MerchantManagement/MerchantView',
							},
							{
								path: '/basicData/merchantManagement/modify',
								name: 'modify',
								id: 'merchantModify',
								hideInMenu: true,
								component: './MerchantManagement/MerchantModify',
							},
						],
					},
					{
						path: '/basicData/organizationManagement',
						name: 'organizationManagement',
						routes: [
							{
								path: '/basicData/organizationManagement/newOrganization',
								name: 'newOrganization',
								id: 'newOrganization',
								component: './Organization/CompanyInfo',
								hideInMenu: true,
							},
							{
								path: '/basicData/organizationManagement/editOrganization',
								name: 'editOrganization',
								id: 'editOrganization',
								component: './Organization/CompanyInfo',
								hideInMenu: true,
							},
							{
								path: '/basicData/organizationManagement/detail',
								name: 'orgDetail',
								hideInMenu: true,
								routes: [
									{
										path: '/basicData/organizationManagement/detail/edit',
										name: 'editDetail',
										id: 'editDetail',
										component: './Organization/CompanyInfo',
										hideInMenu: true,
									},
									{
										path:
											'/basicData/organizationManagement/detail/newSubOrganization',
										name: 'newSubOrganization',
										id: 'newSubOrganization',
										component: './Organization/CompanyInfo',
										hideInMenu: true,
									},
									{
										path: '/basicData/organizationManagement/detail',
										id: 'detail',
										component: './Organization/OrgDetail',
									},
								],
							},
							{
								path: '/basicData/organizationManagement',
								id: 'organizationList',
								component: './Organization/OrganizationList',
							},
						],
					},
					{
						path: '/basicData/employeeManagement',
						name: 'employeeManagement',
						id: 'employeeManagement',
						routes: [
							{
								path: '/basicData/employeeManagement',
								name: 'employeeList',
								id: 'employeeList',
								component: './BasicData/Employee',
								hideInMenu: true,
							},
							{
								path: '/basicData/employeeManagement/info',
								name: 'employeeInfo',
								id: 'employeeInfo',
								component: './BasicData/Employee/EmployeeInfo',
								hideInMenu: true,
							},
							{
								path: '/basicData/employeeManagement/create',
								name: 'employeeCreate',
								id: 'employeeCreate',
								component: './BasicData/Employee/EmployeeCU',
								hideInMenu: true,
							},
							{
								path: '/basicData/employeeManagement/update',
								name: 'employeeUpdate',
								id: 'employeeUpdate',
								component: './BasicData/Employee/EmployeeCU',
								hideInMenu: true,
							},
							{
								path: '/basicData/employeeManagement/employeeTable',
								name: 'employeeTable',
								id: 'employeeTable',
								component: './BasicData/Employee/EmployeeTable',
								hideInMenu: true,
							},
						],
					},
					{
						path: '/basicData/roleManagement',
						name: 'roleManagement',
						id: 'roleManagement',
						routes: [
							{
								path: '/basicData/roleManagement',
								name: 'roleList',
								id: 'roleList',
								component: './RoleManagement/RoleList',
								hideInMenu: true,
							},
							{
								path: '/basicData/roleManagement/create',
								name: 'create',
								id: 'roleCreate',
								component: './RoleManagement/RoleCreateModify',
								hideInMenu: true,
							},
							{
								path: '/basicData/roleManagement/modify',
								name: 'modify',
								id: 'roleModify',
								component: './RoleManagement/RoleCreateModify',
								hideInMenu: true,
							},
							{
								path: '/basicData/roleManagement/view',
								name: 'view',
								id: 'roleInfo',
								component: './RoleManagement/RoleView',
								hideInMenu: true,
							},
						],
					},
					{
						path: '/basicData/faceidLibrary',
						name: 'faceidLibrary',
						id: 'faceidLibrary',
						// component: './index.js',
						routes: [
							{
								path: '/basicData/faceidLibrary',
								id: 'faceidLibraryList',
								component: './IPC/FaceidLibrary/LibraryList.js',
								hideInMenu: true,
							},
							{
								path: '/basicData/faceidLibrary/photoManagement',
								name: 'photoManagement',
								id: 'photoList',
								component: './IPC/PhotoManagement/PhotoManagement.js',
								hideInMenu: true,
							},
						],
					},
					{
						path: '/basicData/faceLog',
						name: 'faceLog',
						id: 'faceLog',
						component: './IPC/FaceLog/index.js',
						hideInMenu: true,
						routes: [
							{
								path: '/basicData/faceLog/entryDetail',
								name: 'entryDetail',
								id: 'entryDetail',
								hideInMenu: true,
								component: './IPC/EntryDetail/index.js',
							},
						],
					},

				],
			},

			// 不在 menu 中显示的路由
			{
				path: '/account',
				hideInMenu: true,
				routes: [
					{
						path: '/account',
						id: 'account',
						component: './Account/',
					},
					{ component: '404' },
				],
			},

			{
				path: '/notification',
				id: 'notification',
				hideInMenu: true,
				routes: [
					{
						path: '/notification',
						redirect: '/notification/center',
					},
					{
						path: '/notification/center',
						name: 'notification',
						id: 'notificationList',
						component: './NotificationCenter/NotificationCenter',
					},
					{
						path: '/notification/info',
						name: 'notification',
						id: 'notificationInfo',
						component: './NotificationCenter/NotificationInfo',
					},
				],
			},

			{
				name: 'exception',
				icon: 'warning',
				path: '/exception',
				hideInMenu: true,
				routes: [
					{
						path: '/exception/403',
						name: 'not-permission',
						id: 'noPermission',
						component: './Exception/403',
					},
					{
						path: '/exception/404',
						name: 'no-rescourse',
						id: 'noRescourse',
						component: './Exception/404',
					},
				],
			},
		],
	},
];

// export default router;
module.exports = router;
