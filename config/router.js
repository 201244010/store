const router = [
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
      {
        path:'/dashBoard',
        name:'dashBoard',
        icon: 'blank',
        component:'./DashBoard'
      },

      {
      	path: '/application',
      	name: 'application',
      	icon: 'blank',
      	routes:[
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
      	]
      },

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
        path: '/esl',
        name: 'esl',
        icon: 'blank',
        routes: [
          {
            path: '/esl/electricLabel',
            name: 'electricLabel',
            component: './DeviceManagement/ESL/ElectricLabel',
          },
          {
            path: '/esl/template',
            name: 'template',
            component: './Template',
          },
          {
            path: '/esl/commRecord',
            hideInMenu: true,
            name: 'commRecord',
            component: './DeviceManagement/ESL/CommRecord',
          },
          {
            path: '/esl/baseStation',
            name: 'baseStation',
            component: './DeviceManagement/ESL/BaseStation',
          },
          {
            path: '/esl/deviceUpgrade',
            name: 'deviceUpgrade',
            routes: [
              {
                path: '/esl/deviceUpgrade',
                name: 'overview',
                hideInMenu: true,
                component: './DeviceManagement/ESL/DeviceUpgrade',
              },
              {
                path: '/esl/deviceUpgrade/deviceESL',
                name: 'deviceESL',
                hideInMenu: true,
                component: './DeviceManagement/ESL/DeviceESL',
              },
              {
                path: '/esl/deviceUpgrade/deviceAP',
                name: 'deviceAP',
                hideInMenu: true,
                component: './DeviceManagement/ESL/DeviceAP',
              },
            ],
          },
          { path: '/esl', redirect: '/esl/electricLabel' },
        ],
      },

      {
        path: '/basicData',
        name: 'basicData',
        icon: 'blank',
        hideInMenu: true,
        routes: [
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
          {
            path: '/roleManagement',
            name: 'roleManagement',
            icon: 'blank',
            routes: [
              { path: '/roleManagement', redirect: '/roleManagement/roleList' },
              {
                path: '/roleManagement/roleList',
                name: 'roleList',
                component: './RoleManagement/RoleList',
              },
              {
                path: '/roleManagement/create',
                name: 'create',
                component: './RoleManagement/RoleCreateModify',
                hideInMenu: true,
              },
              {
                path: '/roleManagement/modify',
                name: 'modify',
                component: './RoleManagement/RoleCreateModify',
                hideInMenu: true,
              },
              {
                path: '/roleManagement/view',
                name: 'view',
                component: './RoleManagement/RoleView',
                hideInMenu: true,
              },
            ],
          },
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
        ],
      },
      
      // 不在 menu 中显示的路由
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

      {
        path: '/notification',
        hideInMenu: true,
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
      
      // 不在 menu 中显示的路由 end

      // {
      // 	path: '/live',
      // 	component: './IPC/Live/Live.js',
      // },

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

export default router;
