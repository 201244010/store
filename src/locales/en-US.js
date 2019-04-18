import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import settings from './en-US/settings';
import common from '@/locales/en-US/common';
import message from '@/locales/en-US/message';
import account from '@/locales/en-US/account';
import loginRegister from '@/locales/en-US/loginRegister';
import storeRelate from '@/locales/en-US/storeRelate';
import mailActive from '@/locales/en-US/mailActive';
import resetPassword from '@/locales/en-US/resetPassword';
import userCenter from '@/locales/en-US/userCenter';

export default {
    'navBar.lang': 'Languages',
    'layout.user.link.help': 'Help',
    'layout.user.link.privacy': 'Privacy',
    'layout.user.link.terms': 'Terms',
    'app.home.introduce': 'introduce',
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
};
