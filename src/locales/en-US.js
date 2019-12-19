import globalHeader from './en-US/globalHeader';
import common from './en-US/common';
import menu from './en-US/menu';
import settings from './en-US/settings';
import message from './en-US/message';
import account from './en-US/account';
import loginRegister from './en-US/loginRegister';
import storeRelate from './en-US/storeRelate';
import mailActive from './en-US/mailActive';
import resetPassword from './en-US/resetPassword';
import userCenter from './en-US/userCenter';
import storeManagement from './en-US/storeManagement';
import notification from './en-US/notification';
import studio from './en-US/studio';
import iot from './en-US/iot';
import dashboard from './en-US/dashBoard';
import network from './en-US/network';

import VideoPlayer from './en-US/videoPlayer';

// ESL
import baseStation from './en-US/ESL-device';

// BasicData
import productManagement from './en-US/BasicData-product';

import merchantManagement from './en-US/merchant';

import roleManagement from './en-US/role';
import employee from './en-US/employee';
import trade from './en-US/trade';
import flow from './en-US/flow';
import tradeShow from './en-US/tradeShow';
import serviceManagement from './en-US/serviceManagement';
import orderManagement from './en-US/orderManagement';
import passengerAnalyze from './en-US/passengerAnalyze';

export default {
	'navBar.lang': 'Language',
	'navBar.area': 'Area',
	'selectLang.chinaMainland': 'China Mainland',
	'selectLang.tw': 'Taiwan/HongKong/Macao',
	'selectLang.otherArea': 'Other Area',
	'layout.user.link.help': 'Help',
	'layout.user.link.privacy': 'Privacy',
	'layout.user.link.terms': 'Terms',
	'app.home.introduce': 'Introduction',
	'layout.user.footer': '2019 Shanghai SUNMI Technology Co., Ltd. All rights reserved. 沪ICP备16006543',
	'app.exception.description.404': 'The page you requested doesn‘t existed',
	'app.exception.description.403': 'You don‘t have permission to do this',
	'app.exception.back': 'Return Home',
	'app.network.disconnect': 'Oops！Please check your network',
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
};
