export default [
  {
    path: '/user',
    component: '../layouts/SunmiLayout',
    id:'user',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login/LoginUI', id: 'userLogin' },
      { path: '/user/storeRelate', component: './User/StoreRelate/StoreRelateUI', id:'userStore' },
      { path: '/user/merchantCreate', component: './User/StoreRelate/StoreRelateUI', id: 'userMerchant' },
      { path: '/user/*', component: '404' },
    ],
  },
  {
    path: '/studio',
    component: '../layouts/BlankLayout',
    id: 'studio',
    routes: [
      { path: '/studio', component: './Studio' },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    id: 'root',
    Routes: ['/src/components/AuthorithCheck'],
    routes: [
      // TODO 万有集市 临时菜单 START

      {
        path:'/dashBoard',
        name:'dashBoard',
        icon: 'blank',
        component:'./DashBoard',
        id: 'dashBoard'
      },
      // todo 新增 应用服务
      // {
      // 	path: '/application',
      // 	name: 'application',
      // 	icon: 'blank',
      // 	routes:[
      // 		{
      // 			path: '/cashVerify',
      // 			icon: 'blank',
      // 			name: 'cashVerify',
      // 			routes: [
      // 				{
      // 					path: '/cashVerify/posList',
      // 					name: 'bindPOSDevice',
      // 					// hideInMenu: true,
      // 					component: './IPC/POSManagement/POSList.js'
      // 				},
      // 				{
      // 					path: '/cashVerify/bindPOSDevice',
      // 					name: 'bindPOSDevice',
      // 					hideInMenu: true,
      // 					component: './IPC/POSManagement/BindPOS.js'
      // 				},
      // 				{
      // 					path: '/cashVerify/videos',
      // 					name: 'videos',
      // 					hideInMenu: true,
      // 					component: './IPC/TradeVideos/TradeVideos.js',
      // 				},
      // 				{
      // 					path: '/cashVerify',
      // 					redirect: '/cashVerify/posList'
      // 				}
      // 			]
      // 		},
      // 	]
      // },

      

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
            path: '/esl/commRecord',
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
            routes: [
              {
                path: '/esl/deviceUpgrade',
                name: 'overview',
                id: 'deviceUpgradeOverview',
                hideInMenu: true,
                component: './DeviceManagement/ESL/DeviceUpgrade',
              },
              {
                path: '/esl/deviceUpgrade/deviceESL',
                name: 'deviceESL',
                id: 'deviceESL',
                hideInMenu: true,
                component: './DeviceManagement/ESL/DeviceESL',
              },
              {
                path: '/esl/deviceUpgrade/deviceAP',
                name: 'deviceAP',
                id: 'deviceAP',
                hideInMenu: true,
                component: './DeviceManagement/ESL/DeviceAP',
              },
            ],
          },
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
        id: 'product',
        icon: 'blank',
        routes: [
          {
            path: '/product/list',
            name: 'list',
            id: 'productList',
            hideInMenu: true,
            component: './BasicData/ProductManagement',
          },
          {
            path: '/product/list/productCreate',
            name: 'list',
            id: 'productCreate',
            hideInMenu: true,
            component: './BasicData/ProductManagement/ProductCU',
          },
          {
            path: '/product/list/productUpdate',
            name: 'list',
            id: 'productUpdate',
            hideInMenu: true,
            component: './BasicData/ProductManagement/ProductCU',
          },
          {
            path: '/product/list/productInfo',
            name: 'list',
            id: 'productInfo',
            hideInMenu: true,
            component: './BasicData/ProductManagement/ProductInfo',
          },
          {
            path: '/product/list/erpImport',
            name: 'list',
            id: 'erpImport',
            hideInMenu: true,
            component: './BasicData/ProductManagement/ERPImport',
          },
          { path: '/product', redirect: '/product/list' },
        ],
      },
      {
        path: '/company',
        name: 'company',
        id: 'company',
        icon: 'blank',
        routes: [
          { path: '/company/merchantManagement', redirect: '/company/merchantManagement/view' },
          {
            path: '/company/merchantManagement/view',
            name: 'merchantManagement',
            id: 'merchantView',
            component: './MerchantManagement/MerchantView',
          },
          {
            path: '/company/merchantManagement/modify',
            name: 'merchantManagement',
            id: 'merchantModify',
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
            id: 'storeList',
            component: './StoreManagement',
          },
          {
            path: '/company/storeManagement/createStore',
            component: './StoreManagement/CreateStore.js',
            name: 'storeManagement',
            id: 'storeCreate',
            hideInMenu: true,
          },
          {
            path: '/company/storeManagement/storeInformation',
            component: './StoreManagement/StoreInformation.js',
            name: 'storeManagement',
            id: 'storeInfo',
            hideInMenu: true,
          },
          {
            path: '/company/storeManagement/alterStore',
            component: './StoreManagement/CreateStore.js',
            name: 'storeManagement',
            id: 'storeUpdate',
            hideInMenu: true,
          },
          { path: '/company', redirect: '/company/merchantManagement' },
        ],
      },
      {
        path: '/template',
        name: 'template',
        id: 'template',
        icon: 'blank',
        routes: [
          { path: '/template', redirect: '/template/list' },
          {
            path: '/template/list',
            name: 'list',
            id: 'templateList',
            component: './Template',
          },
        ],
      },
      {
        path: '/roleManagement',
        name: 'roleManagement',
        id: 'roleManagement',
        icon: 'blank',
        routes: [
          { path: '/roleManagement', redirect: '/roleManagement/roleList' },
          {
            path: '/roleManagement/roleList',
            name: 'roleList',
            id: 'roleList',
            component: './RoleManagement/RoleList',
          },
          {
            path: '/roleManagement/create',
            name: 'create',
            id: 'roleCreate',
            component: './RoleManagement/RoleCreateModify',
            hideInMenu: true,
          },
          {
            path: '/roleManagement/modify',
            name: 'modify',
            id: 'roleModify',
            component: './RoleManagement/RoleCreateModify',
            hideInMenu: true,
          },
          {
            path: '/roleManagement/view',
            name: 'view',
            id: 'roleInfo',
            component: './RoleManagement/RoleView',
            hideInMenu: true,
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
        id: 'deviceManagement',
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
      
      // 不在 menu 中显示的路由
      {
        path: '/account',
        id: 'account',
        hideInMenu: true,
        routes: [
          {
            path: '/account',
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
          {
            path: '/notification',
            redirect: '/notification/center',
          },
        ],
      },

      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu:true,
        routes: [
          {
            path: '/exception/403',
            name: 'not-permission',
            id: 'noPermission',
            component: './Exception/403',
          },
        ]
      },
      
      // 不在 menu 中显示的路由 end

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

      { path: '/', redirect: '/dashBoard' },
    ],
  },
]