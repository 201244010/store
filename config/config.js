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
      path: '/login',
      component: '../layouts/UserLayout',
      routes: [{ path: '/login', component: './Login/Login' }],
      breadcrumb: null,
    },
    {
      path: '/register',
      component: '../layouts/UserLayout',
      routes: [{ path: '/register', component: './Register/Register' }],
      breadcrumb: null,
    },
    {
      path: '/storeRelate',
      component: '../layouts/UserLayout',
      routes: [{ path: '/storeRelate', component: './StoreRelate/StoreRelate' }],
      breadcrumb: null,
    },
    {
      path: '/mailActive',
      component: '../layouts/UserLayout',
      routes: [{ path: '/mailActive', component: './MailActive/MailActive' }],
      breadcrumb: null,
    },
    {
      path: '/resetPassword',
      component: '../layouts/UserLayout',
      routes: [
        { path: '/resetPassword', component: './ResetPassword/ResetPassword' },
        { path: '/resetPassword/reset', component: './ResetPassword/PasswordReset' },
      ],
      breadcrumb: null,
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
            {
              path: '/deviceManagement/esl',
              name: 'esl',
              routes: [
                {
                  path: '/deviceManagement/esl/baseStation',
                  name: 'baseStation',
                  component: './DeviceManagement/ESL/BaseStation',
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
            {
              path: '/basicData/productManagement',
              name: 'productManagement',
              routes: [
                {
                  path: '/basicData/productManagement/list',
                  name: 'list',
                  component: './BasicData/ProductManagement',
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
