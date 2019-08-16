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
import dashboard from './en-US/dashBoard';

import VideoPlayer from './en-US/videoPlayer';

// ESL
import baseStation from './en-US/ESL-device';

// BasicData
import productManagement from './en-US/BasicData-product';

import merchantManagement from './en-US/merchant';

export default {
	'navBar.lang': 'language',
	'navBar.area': 'area',
	'layout.user.link.help': 'help',
	'layout.user.link.privacy': 'privacy',
	'layout.user.link.terms': 'policy',
	'app.home.introduce': 'introduce',
	'layout.user.footer': '2019 Shanghai SUNMI Technology Co',
	'app.exception.description.404': 'The visited page does not exist.',
	'app.exception.back': 'Back To Home',
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
	...dashboard,
};
