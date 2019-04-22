// ref: https://umijs.org/config/
import { primaryColor } from '../src/defaultSettings';

export default {
    plugins: [
        [
            'umi-plugin-react',
            {
                antd: true,
                dva: {
                    hmr: true,
                },
                targets: {
                    ie: 11,
                },
                locale: {
                    enable: true, // default false
                    default: 'zh-CN', // default zh-CN
                    baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
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
    targets: {
        ie: 11,
    },

    /**
     * 路由相关配置
     */
    routes: [
        {
            path: '/user',
            component: '../layouts/UserLayout',
            routes: [
                { path: '/user/login', component: './User/Login/Login' },
                { path: '/user/register', component: './User/Register/Register' },
                { path: '/user/storeRelate', component: './User/StoreRelate/StoreRelate' },
                { path: '/user/mailActive', component: './User/MailActive/MailActive' },
                { path: '/user/resetPassword', component: './User/ResetPassword/ResetPassword' },
                { path: '/user/resetPassword/reset', component: './User/ResetPassword/PasswordReset' },
            ],
        },
        {
            path: '/merchant',
            component: '../layouts/MerchantLayout',
            routes: [
                { path: '/merchant/create', component: './MerchantManagement/MerchantCreate' },
            ],
        },
        {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
                { path: '/', redirect: '/dashBoard' },
                // dashboard
                {
                    path: '/dashBoard',
                    name: 'dashBoard',
                    icon: 'blank',
                    component: './DashBoard',
                },
                {
                    path: '/deviceManagement',
                    name: 'deviceManagement',
                    icon: 'blank',
                    routes: [
                        { path: '/deviceManagement', redirect: '/deviceManagement/esl' },
                        {
                            path: '/deviceManagement/esl',
                            name: 'esl',
                            routes: [
                                { path: '/deviceManagement/esl', redirect: '/deviceManagement/esl/baseStation' },
                                {
                                    path: '/deviceManagement/esl/baseStation',
                                    name: 'baseStation',
                                    component: './DeviceManagement/ESL/BaseStation',
                                },
                                {
                                    path: '/deviceManagement/esl/electricLabel',
                                    name: 'electricLabel',
                                    component: './DeviceManagement/ESL/ElectricLabel',
                                },
                            ],
                        },
                    ],
                },
                {
                    path: '/basicData',
                    name: 'basicData',
                    icon: 'blank',
                    routes: [
                        { path: '/basicData', redirect: '/basicData/productManagement' },
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
                    path: '/account/center',
                    component: './Account/',
                    name: 'account',
                    hideInMenu: true,
                },
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
