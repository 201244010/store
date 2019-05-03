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

// ESL
import baseStation from './en-US/ESL/device';

// BasicData
import productManagement from './en-US/BasicData/product';

import merchantManagement from './en-US/Merchant/merchant';

export default {
    'navBar.lang': '语言',
    'navBar.area': '地区',
    'layout.user.link.help': '帮助',
    'layout.user.link.privacy': '隐私',
    'layout.user.link.terms': '条款',
    'app.home.introduce': '介绍',
    'layout.user.footer': '2019 上海商米科技有限公司',
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
};
