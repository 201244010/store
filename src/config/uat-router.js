const router = [
	{
		path: '/userProtocol',
		// component: '../layouts/SunmiLayout',
		id: 'userProtocol',
		routes: [
			{ path: '/userProtocol/serviceProtocol', component: './IPC/CloudStorage/protocol.js', id: 'serviceProtocol' }
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
				component: './Index'
			},
			{
				path: '/dashBoard',
				name: 'dashBoard',
				icon: 'blank',

				routes: [
					{
						path: '/dashBoard',
						id: 'dashBoard',
						hideInMenu: true,
						component: './DashBoard',
					},
					{
						path: '/dashboard/detail',
						id: 'orderDetail',
						name: 'orderDetail',
						hideInMenu: true,
						component: './DashBoard/OrderDetail',
					},
				],
			},

			{
				path: '/application',
				name: 'application',
				icon: 'blank',
				routes: [
					{ path: '/application', redirect: '/application/cashVerify' },
					{
						path: '/application/cashVerify',
						name: 'cashVerify',
						id: 'cashVerify',
						routes: [
							{
								path: '/application/cashVerify/posList',
								name: 'bindPOSDevice',
								id: 'posList',
								hideInMenu: true,
								component: './IPC/POSManagement/POSList.js',
							},
							{
								path: '/application/cashVerify/bindPOSDevice',
								name: 'bindPOSDevice',
								id: 'bindPOSDevice',
								hideInMenu: true,
								component: './IPC/POSManagement/BindPOS.js',
							},
							{
								path: '/application/cashVerify/videos',
								name: 'videos',
								id: 'videos',
								hideInMenu: true,
								component: './IPC/TradeVideos/index.js',
							},
							{
								path: '/application/cashVerify',
								redirect: '/application/cashVerify/posList',
							},
						],
					},
					{
						path:'/application/cloudStorage',
						name:'cloudStorageService',
						routes:[
							{
								path:'/application/cloudStorage/subscriptionSuccess',
								name:'subscriptionSuccess',
								id:'subscriptionSuccess',
								hideInMenu: true,
								component: './IPC/CloudStorage/subscriptionSuccess.js'
							},
							{
								path:'/application/cloudStorage/orderSubmission',
								name:'orderSubmission',
								hideInMenu: true,
								routes: [
									{
										path: '/application/cloudStorage/orderSubmission/qrpay',
										name:'qrpay',
										id: 'qrpay',
										hideInMenu: true,
										component: './IPC/CloudStorage/OrderSubmission/QRCodePayment.js',
									},
									{
										path:'/application/cloudStorage/orderSubmission/paymentPage',
										name:'paymentPage',
										id:'paymentPage',
										hideInMenu: true,
										component: './IPC/CloudStorage/OrderSubmission/paymentPage.js'
									},
									{
										path: '/application/cloudStorage/orderSubmission',
										id: 'orderSubmission',
										hideInMenu: true,
										component: './IPC/CloudStorage/OrderSubmission/orderSubmission.js'
									}
								]
							},
							{
								path: '/application/cloudStorage',
								id: 'cloudStorage',
								component: './IPC/CloudStorage/cloudStorage.js',
							}
						]
					},
					{
						path: '/application/serviceManagement',
						id: 'serviceManagement',
						component: './ServiceManagement/ServiceList',
						name: 'serviceManagement',
					},
					{
						path: '/application/orderManagement',
						id: 'orderManagement',
						name: 'orderManagement',
						routes:[
							{
								path: '/application/orderManagement',
								id: 'orderManagement',
								component: './OrderManagement/OrderList'
							},
							{
								path: '/application/orderManagement/orderDetail',
								id: 'serviceOrderDetail',
								component: './OrderManagement/OrderDetail',
								hideInMenu: true
							}
						]
					}
				],
			},

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
					{
						path: '/dataAnalyze/businessDaily',
						name: 'businessDaily',
						id: 'businessDaily',
						component: './DataBoard/BusinessDaily',
					},
				],
			},

			{
				path: '/devices',
				icon: 'blank',
				name: 'devices',
				id: 'devices',
				routes: [
					{
						path: '/devices/ipcList',
						name: 'ipcList',
						routes: [
							{
								path: '/devices/ipcList/live',
								name: 'live',
								id: 'live',
								hideInMenu: true,
								component: './IPC/Live/Live.js',
							},
							{
								path: '/devices/ipcList/ipcManagement',
								name: 'ipcManagement',
								id: 'ipcManagement',
								hideInMenu: true,
								component: './IPC/IPCManagement/IPCManagement.js',
							},
							{
								path: '/devices/ipcList',
								// name: 'ipcList',
								id: 'deviceList',
								component: './IPC/IPCList/index.js',
							},
						],
					},
					{
						path: '/devices/motionMessage',
						name: 'motionMessage',
						id: 'motionMessage',
						component: './IPC/MotionList/index.js',
					},
					{
						path: '/devices',
						redirect: '/devices/ipcList',
					},
				],
			},

			{
				path: '/esl',
				name: 'esl',
				id: 'esl',
				icon: 'blank',
				routes: [
					{
						path: '/esl/electricLabel',
						name: 'electricLabel',
						id: 'electricLabel',
						component: './DeviceManagement/ESL/ElectricLabel',
					},
					{
						path: '/esl/template',
						name: 'template',
						id: 'template',
						component: './Template',
					},
					{
						path: '/esl/commRecord',
						hideInMenu: true,
						name: 'commRecord',
						id: 'commRecord',
						component: './DeviceManagement/ESL/CommRecord',
					},
					{
						path: '/esl/baseStation',
						name: 'baseStation',
						id: 'baseStation',
						component: './DeviceManagement/ESL/BaseStation',
					},
					{
						path: '/esl/deviceUpgrade',
						name: 'deviceUpgrade',
						id: 'deviceUpgrade',
						component: './DeviceManagement/ESL/DeviceUpgrade'
					},
					{
						path: '/esl/systemConfig',
						name: 'systemConfig',
						id: 'systemConfig',
						hideInMenu: true,
						component: './DeviceManagement/ESL/SystemConfig',
					},
					{
						path: '/esl/deviceUpgrade/deviceESL',
						name: 'deviceESL',
						id: 'deviceESL',
						hideInMenu: true,
						component: './DeviceManagement/ESL/DeviceESL',
					},
					{
						path: '/esl/deviceUpgrade',
						name: 'overview',
						id: 'deviceUpgradeOverview',
						hideInMenu: true,
						component: './DeviceManagement/ESL/DeviceUpgrade',
					},
					{
						path: '/esl/deviceUpgrade/deviceAP',
						name: 'deviceAP',
						id: 'deviceAP',
						hideInMenu: true,
						component: './DeviceManagement/ESL/DeviceAP',
					},
					{ path: '/esl', redirect: '/esl/electricLabel' },
				],
			},

			{
				path: '/network',
				name: 'network',
				id: 'network',
				icon: 'blank',
				routes: [
					{ path: '/network', redirect: '/network/list' },
					{
						path: '/network/list',
						name: 'list',
						id: 'networkList',
						// hideInMenu: true,
						component: './DeviceManagement/Network/NetworkOverview',
					},
					{
						path: '/network/detail',
						name: 'detail',
						id: 'networkDetail',
						hideInMenu: true,
						component: './DeviceManagement/Network/NetworkOverview/NetworkDetail',
					},
					{
						path: '/network/configManagement',
						name: 'configManagement',
						id: 'configManagement',
						// hideInMenu: true,
						component: './DeviceManagement/Network/NetworkConfig',
					},
					{
						path: '/network/clientList',
						name: 'clientList',
						id: 'clientList',
						hideInMenu: true,
						component: './DeviceManagement/Network/NetworkOverview/ClientList',
					},
				],
			},

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
										path: '/basicData/organizationManagement/detail/newSubOrganization',
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
								]
							},
							{
								path: '/basicData/organizationManagement',
								id: 'organizationList',
								component: './Organization/OrganizationList',
							}
						],
					},
					{
						path: '/basicData/merchantManagement',
						redirect: '/basicData/merchantManagement/view',
					},
					{
						path: '/basicData/merchantManagement/view',
						name: 'merchantManagement',
						id: 'merchantView',
						component: './MerchantManagement/MerchantView',
					},
					{
						path: '/basicData/merchantManagement/modify',
						name: 'merchantManagement',
						id: 'merchantModify',
						hideInMenu: true,
						component: './MerchantManagement/MerchantModify',
					},
					// {
					// 	path: '/basicData/storeManagement',
					// 	name: 'storeManagement',
					// 	routes: [
					// 		{
					// 			path: '/basicData/storeManagement',
					// 			redirect: '/basicData/storeManagement/list',
					// 		},
					// 		{
					// 			path: '/basicData/storeManagement/list',
					// 			name: 'list',
					// 			id: 'storeList',
					// 			component: './StoreManagement',
					// 			hideInMenu: true,
					// 		},
					// 		{
					// 			path: '/basicData/storeManagement/createStore',
					// 			component: './StoreManagement/CreateStore.js',
					// 			name: 'createStore',
					// 			id: 'storeCreate',
					// 			hideInMenu: true,
					// 		},
					// 		{
					// 			path: '/basicData/storeManagement/storeInformation',
					// 			component: './StoreManagement/StoreInformation.js',
					// 			name: 'storeManagement',
					// 			id: 'storeInfo',
					// 			hideInMenu: true,
					// 		},
					// 		{
					// 			path: '/basicData/storeManagement/alterStore',
					// 			component: './StoreManagement/CreateStore.js',
					// 			name: 'storeManagement',
					// 			id: 'storeUpdate',
					// 			hideInMenu: true,
					// 		},
					// 	],
					// },
					{
						path: '/basicData/employeeManagement',
						name: 'employeeManagement',
						id: 'employeeManagement',
						routes: [
							{
								path: '/basicData/employeeManagement',
								redirect: '/basicData/employeeManagement/list',
							},
							{
								path: '/basicData/employeeManagement/list',
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
						// hideInMenu: true,
						id: 'roleManagement',
						routes: [
							{
								path: '/basicData/roleManagement',
								redirect: '/basicData/roleManagement/roleList',
							},
							{
								path: '/basicData/roleManagement/roleList',
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
						path: '/basicData/productManagement',
						name: 'productManagement',
						routes: [
							{
								path: '/basicData/productManagement',
								redirect: '/basicData/productManagement/list',
							},
							{
								path: '/basicData/productManagement/list',
								name: 'list',
								id: 'productList',
								hideInMenu: true,
								component: './BasicData/ProductManagement',
							},
							{
								path: '/basicData/productManagement/list/productCreate',
								name: 'list',
								id: 'productCreate',
								hideInMenu: true,
								component: './BasicData/ProductManagement/ProductCU',
							},
							{
								path: '/basicData/productManagement/list/productUpdate',
								name: 'list',
								id: 'productUpdate',
								hideInMenu: true,
								component: './BasicData/ProductManagement/ProductCU',
							},
							{
								path: '/basicData/productManagement/list/productInfo',
								name: 'list',
								id: 'productInfo',
								hideInMenu: true,
								component: './BasicData/ProductManagement/ProductInfo',
							},
							{
								path: '/basicData/productManagement/list/erpImport',
								name: 'list',
								id: 'erpImport',
								hideInMenu: true,
								component: './BasicData/ProductManagement/ERPImport',
							},
              				{
								path: '/basicData/productManagement/list/excelUpload',
								name: 'list',
								id: 'excelUpload',
								hideInMenu: true,
								component: './BasicData/ProductManagement/ExcelUpload',
							},
							{ path: '/basicData', redirect: '/basicData/productManagement' },
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
						component: './Exception/403',
					},
				],
			},

			// 不在 menu 中显示的路由 end
			// {
			// 	path: '/live',
			// 	component: './IPC/Live/Live.js',
			// },

			{
				path: '/faceidLibrary',
				name: 'faceidLibrary',
				id: 'faceidLibrary',
				icon: 'blank',
				// component: './index.js',
				routes: [
					{ path: '/faceidLibrary', redirect: '/faceidLibrary/faceidLibraryList' },
					{
						path: '/faceidLibrary/faceidLibraryList',
						name: 'list',
						id: 'faceidLibraryList',
						routes: [
							{
								path: '/faceidLibrary/faceidLibraryList/photoManagement',
								name: 'photoManagement',
								hideInMenu: true,
								id: 'photoList',
								component: './IPC/PhotoManagement/PhotoManagement.js',
							},
							{
								path: '/faceidLibrary/faceidLibraryList',
								id: 'faceidLibraryList',
								component: './IPC/FaceidLibrary/LibraryList.js',
							}
						]
					},
					{
						path: '/faceidLibrary/faceLog',
						name: 'faceLog',
						id: 'faceLog',
						hideInMenu: true,
						// component: './IPC/FaceLog/index.js',
						routes: [
							{
								path: '/faceidLibrary/faceLog/entryDetail',
								name: 'entryDetail',
								id: 'entryDetail',
								hideInMenu: true,
								component: './IPC/EntryDetail/index.js',
							},
							{
								path: '/faceidLibrary/faceLog',
								hideInMenu: true,
								// name: 'faceLog',
								id: 'faceLog',
								component: './IPC/FaceLog/index.js',
							}
						]
					},

					// {
					// 	path: '/faceidLibrary/createLibrary',
					// 	// name: 'faceidLibrary.create',
					// 	id: 'createLibrary',
					// 	component: './IPC/FaceidLibrary/CreateLibrary.js',
					// },
				],
			},
			{
				path: '/iotAccess',
				name: 'iotAccess',
				id: 'iotAccess',
				icon: 'blank',
				routes: [
					{
						path: '/iotAccess/posAccess',
						name: 'posAccess',
						id: 'posAccess',
						routes: [
							{
								path: '/iotAccess/posAccess',
								name: 'posAccessOverview',
								id: 'posAccessOverview',
								hideInMenu: true,
								component: './IotAccess/PosAccess',
							},
							{
								path: '/iotAccess/posAccess/detail',
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
];

// export default router;
module.exports = router;
