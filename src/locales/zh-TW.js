import globalHeader from './zh-TW/globalHeader';
import common from './zh-TW/common';
import menu from './zh-TW/menu';
import settings from './zh-TW/settings';
import message from './zh-TW/message';
import account from './zh-TW/account';
import loginRegister from './zh-TW/loginRegister';
import storeRelate from './zh-TW/storeRelate';
import mailActive from './zh-TW/mailActive';
import resetPassword from './zh-TW/resetPassword';
import userCenter from './zh-TW/userCenter';
import storeManagement from './zh-TW/storeManagement';
import notification from './zh-TW/notification';
import studio from './zh-TW/studio';
import iot from './zh-TW/iot';
import dashboard from './zh-TW/dashBoard';
import network from './zh-TW/network';

import VideoPlayer from './zh-TW/videoPlayer';

// ESL
import baseStation from './zh-TW/ESL-device';

// BasicData
import productManagement from './zh-TW/BasicData-product';
import companyInfo from './zh-TW/companyInfo';

import merchantManagement from './zh-TW/merchant';

import roleManagement from './zh-TW/role';
import employee from './zh-TW/employee';
import trade from './zh-TW/trade';
import tradeShow from './zh-TW/tradeShow';
import serviceManagement from './zh-TW/serviceManagement';
import orderManagement from './zh-TW/orderManagement';
import passengerAnalyze from './zh-TW/passengerAnalyze';

import orgnization from './zh-TW/organization';
import orgDetail from './zh-TW/orgDetail';

export default {
	'navBar.lang': '語言',
	'navBar.area': '地區',
	'selectLang.chinaMainland': '中文簡體',
	'selectLang.tw': '中文繁體',
	'selectLang.otherArea': '英文',
	'layout.user.link.help': '幫助',
	'layout.user.link.privacy': '隱私',
	'layout.user.link.terms': '條款',
	'app.home.introduce': '介紹',
	'layout.user.footer': '2019 上海商米科技有限公司 版權所有 滬ICP備16006543',
	'app.exception.description.404': '您所訪問的頁面不存在',
  	'app.exception.description.403': '您沒有權限進行此操作',
	'app.exception.back': '返回首頁',
  	'app.network.disconnect': '您的網絡似乎出現了問題，請檢查網絡連接',
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
	...tradeShow,
	...iot,
	...passengerAnalyze,
	...serviceManagement,
	...orderManagement,
	...orgDetail,
	...orgnization,
	...companyInfo,
};
