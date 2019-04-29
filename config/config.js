// ref: https://umijs.org/config/
import { primaryColor } from "../src/defaultSettings";

export default {
    hash: true,
    plugins: [
        [
            "umi-plugin-react",
            {
                antd: true,
                dva: {
                    hmr: true
                },
                targets: {
                    ie: 11
                },
                locale: {
                    enable: true, // default false
                    default: "zh-CN", // default zh-CN
                    baseNavigator: true // default true, when it is true, will use `navigator.language` overwrite default
                },
                dynamicImport: {
                    loadingComponent: "./components/PageLoading/index"
                }
            }
        ],
        [
            "umi-plugin-pro-block",
            {
                moveMock: false,
                moveService: false,
                modifyRequest: true,
                autoAddMenu: true
            }
        ]
    ],
    targets: {
        ie: 11
    },

    /**
     * 路由相关配置
     */
    routes: [
        {
            path: "/user",
            component: "../layouts/UserLayout",
            routes: [
                { path: "/user/login", component: "./User/Login/Login" },
                { path: "/user/register", component: "./User/Register/Register" },
                { path: "/user/storeRelate", component: "./User/StoreRelate/StoreRelate" },
                { path: "/user/mailActive", component: "./User/MailActive/MailActive" },
                { path: "/user/resetPassword", component: "./User/ResetPassword/ResetPassword" },
                { path: "/user/resetPassword/reset", component: "./User/ResetPassword/PasswordReset" }
            ]
        },
        {
            path: "/merchant",
            component: "../layouts/MerchantLayout",
            routes: [
                { path: "/merchant/create", component: "./MerchantManagement/MerchantCreate" }
            ]
        },
        {
            path: "/",
            component: "../layouts/BasicLayout",
            routes: [
                // { path: '/', redirect: '/deviceManagement' },
                // TODO 万有集市 临时菜单 START
                { path: "/", redirect: "/esl" },
                {
                    path: "/esl",
                    name: "esl",
                    icon: "blank",
                    routes: [
                        { path: "/esl", redirect: "/esl/electricLabel" },
                        {
                            path: "/esl/electricLabel",
                            name: "electricLabel",
                            component: "./DeviceManagement/ESL/ElectricLabel"
                        },
                        {
                            path: "/esl/baseStation",
                            name: "baseStation",
                            component: "./DeviceManagement/ESL/BaseStation"
                        }
                    ]
                },
                {
                    path: "/product",
                    name: "product",
                    icon: "blank",
                    routes: [
                        { path: "/product", redirect: "/product/list" },
                        {
                            path: "/product/list",
                            name: "list",
                            hideInMenu: true,
                            component: "./BasicData/ProductManagement"
                        },
                        {
                            path: "/product/list/productCreate",
                            name: "list",
                            hideInMenu: true,
                            component: "./BasicData/ProductManagement/ProductCU"
                        },
                        {
                            path: "/product/list/productUpdate",
                            name: "list",
                            hideInMenu: true,
                            component: "./BasicData/ProductManagement/ProductCU"
                        },
                        {
                            path: "/product/list/productInfo",
                            name: "list",
                            hideInMenu: true,
                            component: "./BasicData/ProductManagement/ProductInfo"
                        },
                        {
                            path: "/product/list/erpImport",
                            name: "list",
                            hideInMenu: true,
                            component: "./BasicData/ProductManagement/ERPImport"
                        }
                    ]
                },
                {
                    path: "/company",
                    name: "company",
                    icon: "blank",
                    routes: [
                        { path: "/company", redirect: "/company/merchantManagement" },
                        { path: "/company/merchantManagement", redirect: "/company/merchantManagement/view" },
                        {
                            path: "/company/merchantManagement/view",
                            name: "merchantManagement",
                            component: "./MerchantManagement/MerchantView"
                        },
                        {
                            path: "/company/merchantManagement/modify",
                            name: "merchantManagement",
                            hideInMenu: true,
                            component: "./MerchantManagement/MerchantModify"
                        },
                        {
                            path: "/company/storeManagement",
                            redirect: "/company/storeManagement/list"
                        },
                        {
                            path: "/company/storeManagement/list",
                            name: "storeManagement",
                            component: "./StoreManagement"
                        },
                        {
                            path: "/company/storeManagement/createStore",
                            component: "./StoreManagement/CreateStore.js",
                            name: "storeManagement",
                            hideInMenu: true
                        },
                        {
                            path: "/company/storeManagement/storeInformation",
                            component: "./StoreManagement/StoreInformation.js",
                            name: "storeManagement",
                            hideInMenu: true
                        },
                        {
                            path: "/company/storeManagement/alterStore",
                            component: "./StoreManagement/AlterStore.js",
                            name: "storeManagement",
                            hideInMenu: true
                        }
                    ]
                },
                {
                    path: "/template",
                    name: "template",
                    icon: "blank",
                    routes: [
                        { path: "/template", redirect: "/template/list" },
                        {
                            path: "/template/list",
                            name: "list",
                            component: "./Template"
                        }
                    ]
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
                    path: "/deviceManagement",
                    name: "deviceManagement",
                    icon: "blank",
                    // TODO 万有集市临时用菜单隐藏
                    hideInMenu: true,
                    routes: [
                        { path: "/deviceManagement", redirect: "/deviceManagement/esl" },
                        {
                            path: "/deviceManagement/esl",
                            name: "esl",
                            routes: [
                                { path: "/deviceManagement/esl", redirect: "/deviceManagement/esl/electricLabel" },
                                {
                                    path: "/deviceManagement/esl/electricLabel",
                                    name: "electricLabel",
                                    component: "./DeviceManagement/ESL/ElectricLabel"
                                },
                                {
                                    path: "/deviceManagement/esl/baseStation",
                                    name: "baseStation",
                                    component: "./DeviceManagement/ESL/BaseStation"
                                }
                            ]
                        }
                    ]
                },
                {
                    path: "/basicData",
                    name: "basicData",
                    icon: "blank",
                    hideInMenu: true,
                    routes: [
                        { path: "/basicData", redirect: "/basicData/productManagement" },
                        {
                            path: "/basicData/productManagement",
                            name: "productManagement",
                            routes: [
                                { path: "/basicData/productManagement", redirect: "/basicData/productManagement/list" },
                                {
                                    path: "/basicData/productManagement/list",
                                    name: "list",
                                    component: "./BasicData/ProductManagement"
                                },
                                {
                                    path: "/basicData/productManagement/list/productCreate",
                                    name: "list",
                                    hideInMenu: true,
                                    component: "./BasicData/ProductManagement/ProductCU"
                                },
                                {
                                    path: "/basicData/productManagement/list/productUpdate",
                                    name: "list",
                                    hideInMenu: true,
                                    component: "./BasicData/ProductManagement/ProductCU"
                                },
                                {
                                    path: "/basicData/productManagement/list/productInfo",
                                    name: "list",
                                    hideInMenu: true,
                                    component: "./BasicData/ProductManagement/ProductInfo"
                                },
                                {
                                    path: "/basicData/productManagement/list/erpImport",
                                    name: "list",
                                    hideInMenu: true,
                                    component: "./BasicData/ProductManagement/ERPImport"
                                }
                            ]
                        },
                        {
                            path: "/basicData/merchantManagement/view",
                            name: "merchantManagement",
                            component: "./MerchantManagement/MerchantView"
                        },
                        {
                            path: "/basicData/merchantManagement/modify",
                            name: "merchantManagement",
                            hideInMenu: true,
                            component: "./MerchantManagement/MerchantModify"
                        },
                        {
                            path: "/basicData/storeManagement",
                            name: "storeManagement",
                            routes: [
                                { path: "/basicData/storeManagement", redirect: "/basicData/storeManagement/list" },
                                {
                                    path: "/basicData/storeManagement/list",
                                    component: "./StoreManagement/index.js",
                                    name: "list"
                                },
                                {
                                    path: "/basicData/storeManagement/createStore",
                                    component: "./StoreManagement/CreateStore.js",
                                    name: "createStore",
                                    hideInMenu: true
                                },
                                {
                                    path: "/basicData/storeManagement/storeInformation",
                                    component: "./StoreManagement/StoreInformation.js",
                                    hideInMenu: true
                                },
                                {
                                    path: "/basicData/storeManagement/alterStore",
                                    component: "./StoreManagement/AlterStore.js",
                                    hideInMenu: true
                                }
                            ]
                        }
                    ]
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
                    path: "/account/center",
                    component: "./Account/",
                    name: "account",
                    hideInMenu: true
                }
            ]
        }
    ],
    disableRedirectHoist: true,

    /**
     * webpack 相关配置
     */
    define: {
        APP_TYPE: process.env.APP_TYPE || "",
        "process.env.UMI_ENV": process.env.UMI_ENV
    },
    // Theme for antd
    // https://ant.design/docs/react/customize-theme-cn
    theme: {
        "primary-color": primaryColor
    },
    externals: {
        "@antv/data-set": "DataSet"
    },
    ignoreMomentLocale: true,
    lessLoaderOptions: {
        javascriptEnabled: true
    }
};
