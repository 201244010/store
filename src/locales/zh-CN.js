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

// ESL
import baseStation from './zh-CN/ESL/device';

// BasicData
import productManagement from './zh-CN/BasicData/product';

import merchantManagement from './zh-CN/Merchant/merchant';

export default {
    'navBar.lang': '语言',
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
};
