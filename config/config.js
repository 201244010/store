// ref: https://umijs.org/config/
import { primaryColor } from '../src/defaultSettings';

export default {
	hash: true,
	plugins: [
		[
			'umi-plugin-react',
			{
				antd: true,
				dva: {
					hmr: true,
					immer: true,
				},
				locale: {
					default: 'zh-CN', // default zh-CN
					baseNavigator: false, // default true, when it is true, will use `navigator.language` overwrite default
					// TODO 暂时强制限定中文
					// baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
				},
				dynamicImport: {
					loadingComponent: './components/PageLoading/index',
				},
			},
		],
		[
			'umi-plugin-pro-block',
			{
				moveMock: false,
				moveService: false,
				modifyRequest: true,
				autoAddMenu: true,
			},
		],
	],
	copy: [
		{
			from: 'src/libs',
			to: 'libs',
		},
		{
			from: 'src/assets/swf',
			to: 'swf',
		},
		{
			from: 'src/assets/css',
			to: 'css',
		},
		{
			from: 'src/assets/favicon.ico',
			to:'static/favicon.ico'
		}
	],
	targets: { ie: 9 },
	treeShaking: true,
	/**
	 * 路由相关配置
	 */
	routes: [
		{
			path: '/user',
			component: '../layouts/SunmiLayout',
			routes: [
				{ path: '/user', redirect: '/user/login' },
				{ path: '/user/login', component: './User/Login/LoginUI' },
				{ path: '/user/storeRelate', component: './User/StoreRelate/StoreRelateUI' },
				{ path: '/user/merchantCreate', component: './User/StoreRelate/StoreRelateUI' },
				{ path: '/user/*', component: '404' },
			],
		},
		// {
		//     path: '/user',
		//     component: '../layouts/UserLayout',
		//     routes: [
		//         { path: '/user', redirect: '/user/login' },
		//         { path: '/user/login', component: './User/Login/Login' },
		//         { path: '/user/register', component: './User/Register/Register' },
		//         { path: '/user/storeRelate', component: './User/StoreRelate/StoreRelate' },
		//         { path: '/user/mailActive', component: './User/MailActive/MailActive' },
		//         { path: '/user/resetPassword', component: './User/ResetPassword/ResetPassword' },
		//         { path: '/user/resetPassword/reset', component: './User/ResetPassword/PasswordReset' },
		//     ],
		// },
		// {
		//     path: '/merchant',
		//     component: '../layouts/MerchantLayout',
		//     routes: [
		//         { path: '/merchant/create', component: './MerchantManagement/MerchantCreate' },
		//     ],
		// },
		{
			path: '/studio',
			component: '../layouts/BlankLayout',
			routes: [
				{ path: '/studio', component: './Studio' },
			],
		},
		{
			path: '/',
			component: '../layouts/BasicLayout',
			Routes: ['/src/components/AuthorithCheck'],
			routes: [
				// { path: '/', redirect: '/deviceManagement' },
				// TODO 万有集市 临时菜单 START
				{
					path: '/notification',
					routes: [
						{
							path: '/notification/center',
							name: 'notification',
							component: './NotificationCenter/NotificationCenter',
						},
						{
							path: '/notification/info',
							name: 'notification',
							component: './NotificationCenter/NotificationInfo',
						},
						{
							path: '/notification',
							redirect: '/notification/center',
						},
					],
				},
				{
					path: '/esl',
					name: 'esl',
					icon: 'blank',
					routes: [
						{
							path: '/esl/electricLabel',
							name: 'electricLabel',
							component: './DeviceManagement/ESL/ElectricLabel',
						},
						// {
						// 	path: '/esl/commRecord',
						// 	name: 'commRecord',
						// 	component: './DeviceManagement/ESL/CommRecord',
						// },
						{
							path: '/esl/baseStation',
							name: 'baseStation',
							component: './DeviceManagement/ESL/BaseStation',
						},
						// {
						// 	path: '/esl/deviceUpgrade',
						// 	name: 'deviceUpgrade',
						// 	routes: [
						// 		{
						// 			path: '/esl/deviceUpgrade',
						// 			name: 'overview',
						// 			hideInMenu: true,
						// 			component: './DeviceManagement/ESL/DeviceUpgrade',
						// 		},
						// 		{
						// 			path: '/esl/deviceUpgrade/deviceESL',
						// 			name: 'deviceESL',
						// 			hideInMenu: true,
						// 			component: './DeviceManagement/ESL/DeviceESL',
						// 		},
						// 		{
						// 			path: '/esl/deviceUpgrade/deviceAP',
						// 			name: 'deviceAP',
						// 			hideInMenu: true,
						// 			component: './DeviceManagement/ESL/DeviceAP',
						// 		},
						// 	],
						// },
						{ path: '/esl', redirect: '/esl/electricLabel' },
						// {
						// 	path: '/esl/systemConfig',
						// 	name: 'systemConfig',
						// 	component: './DeviceManagement/ESL/SystemConfig',
						// },
					],
				},
				{
					path: '/product',
					name: 'product',
					icon: 'blank',
					routes: [
						{
							path: '/product/list',
							name: 'list',
							hideInMenu: true,
							component: './BasicData/ProductManagement',
						},
						{
							path: '/product/list/productCreate',
							name: 'list',
							hideInMenu: true,
							component: './BasicData/ProductManagement/ProductCU',
						},
						{
							path: '/product/list/productUpdate',
							name: 'list',
							hideInMenu: true,
							component: './BasicData/ProductManagement/ProductCU',
						},
						{
							path: '/product/list/productInfo',
							name: 'list',
							hideInMenu: true,
							component: './BasicData/ProductManagement/ProductInfo',
						},
						{
							path: '/product/list/erpImport',
							name: 'list',
							hideInMenu: true,
							component: './BasicData/ProductManagement/ERPImport',
						},
						{ path: '/product', redirect: '/product/list' },
					],
				},
				{
					path: '/company',
					name: 'company',
					icon: 'blank',
					routes: [
						{ path: '/company/merchantManagement', redirect: '/company/merchantManagement/view' },
						{
							path: '/company/merchantManagement/view',
							name: 'merchantManagement',
							component: './MerchantManagement/MerchantView',
						},
						{
							path: '/company/merchantManagement/modify',
							name: 'merchantManagement',
							hideInMenu: true,
							component: './MerchantManagement/MerchantModify',
						},
						{
							path: '/company/storeManagement',
							redirect: '/company/storeManagement/list',
						},
						{
							path: '/company/storeManagement/list',
							name: 'storeManagement',
							component: './StoreManagement',
						},
						{
							path: '/company/storeManagement/createStore',
							component: './StoreManagement/CreateStore.js',
							name: 'storeManagement',
							hideInMenu: true,
						},
						{
							path: '/company/storeManagement/storeInformation',
							component: './StoreManagement/StoreInformation.js',
							name: 'storeManagement',
							hideInMenu: true,
						},
						{
							path: '/company/storeManagement/alterStore',
							component: './StoreManagement/CreateStore.js',
							name: 'storeManagement',
							hideInMenu: true,
						},
						{ path: '/company', redirect: '/company/merchantManagement' },
					],
				},
				{
					path: '/template',
					name: 'template',
					icon: 'blank',
					routes: [
						{ path: '/template', redirect: '/template/list' },
						{
							path: '/template/list',
							name: 'list',
							component: './Template',
						},
					],
				},
				// TODO 万有集市 临时菜单 END

				// dashboard
				// {
				//     path: '/dashBoard',
				//     name: 'dashBoard',
				//     icon: 'blank',
				//     component: './DashBoard',
				// },
				{
					path: '/deviceManagement',
					name: 'deviceManagement',
					icon: 'blank',
					// TODO 万有集市临时用菜单隐藏
					hideInMenu: true,
					routes: [
						{
							path: '/deviceManagement/esl',
							name: 'esl',
							routes: [
								{ path: '/deviceManagement/esl', redirect: '/deviceManagement/esl/electricLabel' },
								{
									path: '/deviceManagement/esl/electricLabel',
									name: 'electricLabel',
									component: './DeviceManagement/ESL/ElectricLabel',
								},
								{
									path: '/deviceManagement/esl/baseStation',
									name: 'baseStation',
									component: './DeviceManagement/ESL/BaseStation',
								},
								{ path: '/deviceManagement', redirect: '/deviceManagement/esl' },
							],
						},
					],
				},
				{
					path: '/basicData',
					name: 'basicData',
					icon: 'blank',
					hideInMenu: true,
					routes: [
						{
							path: '/basicData/productManagement',
							name: 'productManagement',
							routes: [
								{ path: '/basicData/productManagement', redirect: '/basicData/productManagement/list' },
								{
									path: '/basicData/productManagement/list',
									name: 'list',
									component: './BasicData/ProductManagement',
								},
								{
									path: '/basicData/productManagement/list/productCreate',
									name: 'list',
									hideInMenu: true,
									component: './BasicData/ProductManagement/ProductCU',
								},
								{
									path: '/basicData/productManagement/list/productUpdate',
									name: 'list',
									hideInMenu: true,
									component: './BasicData/ProductManagement/ProductCU',
								},
								{
									path: '/basicData/productManagement/list/productInfo',
									name: 'list',
									hideInMenu: true,
									component: './BasicData/ProductManagement/ProductInfo',
								},
								{
									path: '/basicData/productManagement/list/erpImport',
									name: 'list',
									hideInMenu: true,
									component: './BasicData/ProductManagement/ERPImport',
								},
								{ path: '/basicData', redirect: '/basicData/productManagement' },
							],
						},
						{
							path: '/basicData/merchantManagement/view',
							name: 'merchantManagement',
							component: './MerchantManagement/MerchantView',
						},
						{
							path: '/basicData/merchantManagement/modify',
							name: 'merchantManagement',
							hideInMenu: true,
							component: './MerchantManagement/MerchantModify',
						},
						{
							path: '/basicData/storeManagement',
							name: 'storeManagement',
							routes: [
								{
									path: '/basicData/storeManagement/list',
									component: './StoreManagement/index.js',
									name: 'list',
								},
								{
									path: '/basicData/storeManagement/createStore',
									component: './StoreManagement/CreateStore.js',
									name: 'createStore',
									hideInMenu: true,
								},
								{
									path: '/basicData/storeManagement/storeInformation',
									component: './StoreManagement/StoreInformation.js',
									hideInMenu: true,
								},
								{
									path: '/basicData/storeManagement/alterStore',
									component: './StoreManagement/AlterStore.js',
									hideInMenu: true,
								},
								{ path: '/basicData/storeManagement', redirect: '/basicData/storeManagement/list' },
							],
						},
					],
				},
				// {
				//   path: '/setting',
				//   name: 'setting',
				//   icon: '',
				//   routes: [
				//     {
				//       path: '/setting/role',
				//       name: 'role',
				//       component: './Setting/Role',
				//     },
				//   ],
				// },
				{
					path: '/account',
					name: 'account',
					hideInMenu: true,
					routes: [
						{
							path: '/account',
							component: './Account/',
						},
						{ component: '404' },
					],
				},
				// {
				// 	path: '/live',
				// 	component: './IPC/Live/Live.js',
				// },
				{
					path: '/devices',
					icon: 'blank',
					name: 'devices',
					routes: [
						{
							path: '/devices/ipcList',
							name: 'list',
							routes: [
								{
									path: '/devices/ipcList/live',
									name: 'live',
									hideInMenu: true,
									component: './IPC/Live/Live.js',
								},
								{
									path: '/devices/ipcList/ipcManagement',
									name: 'ipcManagement',
									hideInMenu: true,
									component: './IPC/IPCManagement/IPCManagement.js',
								},
								{
									path: '/devices/ipcList',
									// name: 'list',
									component: './IPC/IPCList/IPCList.js',
								}
							]
						},
						{
							path: '/devices/motionMessage',
							name: 'motionMessage',
							component: './IPC/MotionList/MotionList.js',
						},
						{
							path: '/devices',
							redirect: '/devices/ipcList'
						}
					],
				},
				{
					path: '/cashVerify',
					icon: 'blank',
					name: 'cashVerify',
					routes: [
						{
							path: '/cashVerify/posList',
							name: 'bindPOSDevice',
							// hideInMenu: true,
							component: './IPC/POSManagement/POSList.js'
						},
						{
							path: '/cashVerify/bindPOSDevice',
							name: 'bindPOSDevice',
							hideInMenu: true,
							component: './IPC/POSManagement/BindPOS.js'
						},
						{
							path: '/cashVerify/videos',
							name: 'videos',
							hideInMenu: true,
							component: './IPC/TradeVideos/TradeVideos.js',
						},
						{
							path: '/cashVerify',
							redirect: '/cashVerify/posList'
						}
					]
				},
				{
					path: '/faceidLibrary',
					name: 'faceidLibrary',
					icon: 'blank',
					// component: './index.js',
					routes: [
						{
							path: '/faceidLibrary/faceidLibraryList',
							name: 'list',
							component: './IPC/FaceidLibrary/LibraryList.js',
						},
						{
							path: '/faceidLibrary/createLibrary',
							// name: 'faceidLibrary.create',
							component: './IPC/FaceidLibrary/CreateLibrary.js',
						},
						{
							path: '/faceidLibrary',
							redirect: '/faceidLibrary/faceidLibraryList'
						}
					],
				},
				{ path: '/', redirect: '/esl' },
			],
		},
	],
	disableRedirectHoist: true,

	/**
	 * webpack 相关配置
	 */
	define: {
		APP_TYPE: process.env.APP_TYPE || '',
		'process.env.UMI_ENV': process.env.UMI_ENV,
	},
	// Theme for antd
	// https://ant.design/docs/react/customize-theme-cn
	theme: {
		'primary-color': primaryColor,
	},
	externals: {
		'@antv/data-set': 'DataSet',
	},
	ignoreMomentLocale: true,
	lessLoaderOptions: {
		javascriptEnabled: true,
	},
};
