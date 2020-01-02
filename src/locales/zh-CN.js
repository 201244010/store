import globalHeader from './zh-CN/globalHeader';
import common from './zh-CN/common';
import menu from './zh-CN/menu';
import settings from './zh-CN/settings';
import message from './zh-CN/message';
import account from './zh-CN/account';
import loginRegister from './zh-CN/loginRegister';
import storeRelate from './zh-CN/storeRelate';
import mailActive from './zh-CN/mailActive';
import resetPassword from './zh-CN/resetPassword';
import userCenter from './zh-CN/userCenter';
import storeManagement from './zh-CN/storeManagement';
import notification from './zh-CN/notification';
import studio from './zh-CN/studio';
import iot from './zh-CN/iot';
import dashboard from './zh-CN/dashBoard';
import network from './zh-CN/network';

import VideoPlayer from './zh-CN/videoPlayer';

// ESL
import baseStation from './zh-CN/ESL-device';

// BasicData
import productManagement from './zh-CN/BasicData-product';
import companyInfo from './zh-CN/companyInfo';

import merchantManagement from './zh-CN/merchant';

import roleManagement from './zh-CN/role';
import employee from './zh-CN/employee';
import trade from './zh-CN/trade';
import flow from './zh-CN/flow';
import tradeShow from './zh-CN/tradeShow';
import serviceManagement from './zh-CN/serviceManagement';
import orderManagement from './zh-CN/orderManagement';
import passengerAnalyze from './zh-CN/passengerAnalyze';

import orgnization from './zh-CN/organization';
import orgDetail from './zh-CN/orgDetail';

export default {
	'navBar.lang': '语言',
	'navBar.area': '地区',
	'selectLang.chinaMainland': '中文简体',
	'selectLang.tw': '中文繁体',
	'selectLang.otherArea': '英文',
	'layout.user.link.help': '帮助',
	'layout.user.link.privacy': '隐私',
	'layout.user.link.terms': '条款',
	'app.home.introduce': '介绍',
	'layout.user.footer': '2019 上海商米科技有限公司 版权所有 沪ICP备16006543',
	'app.exception.description.404': '您所访问的页面不存在',
	'app.exception.description.403': '您没有权限进行此操作',
	'app.exception.back': '返回首页',
	'app.network.disconnect': '您的网络似乎出现了问题，请检查网络连接',
	...globalHeader,
	...common,
	...menu,
	...settings,
	...message,
	...account,
	...loginRegister,
	...storeRelate,
	...mailActive,
	...resetPassword,
	...userCenter,
	...baseStation,
	...productManagement,
	...merchantManagement,
	...storeManagement,
	...notification,
	...VideoPlayer,
	...studio,
	...roleManagement,
	...dashboard,
	...employee,
	...network,
	...trade,
	...flow,
	...tradeShow,
	...iot,
	...passengerAnalyze,
	...serviceManagement,
	...orderManagement,
	...companyInfo,
	...orgnization,
	...orgDetail,
};
