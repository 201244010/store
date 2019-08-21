// ref: https://umijs.org/config/
import { primaryColor } from '../src/defaultSettings';
// import routers from '../src/config/router';
import routers from '../src/config/uat-router';
// import routers from './router';

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
			from: 'static',
			to: 'static',
		},
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
		},
		{
			from: 'src/assets/favicon.ico',
			to:'favicon.ico'
		}
	],
	targets: { ie: 9 },
	treeShaking: true,
	/**
	 * 路由相关配置
	 */
	routes: routers,
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
	// externals: {
	// 	'@antv/data-set': 'DataSet',
	// },
	ignoreMomentLocale: true,
	lessLoaderOptions: {
		javascriptEnabled: true,
	},
};
