import React from 'react';
import { FormattedMessage, formatMessage, getLocale } from 'umi/locale';
import { connect } from 'dva';
import DocumentTitle from 'react-document-title';
import SelectLang from '@/components/SelectLang';
import pathToRegexp from 'path-to-regexp';
import HeaderDropdown from '@/components/HeaderDropdown';
import { Menu, Avatar, Icon } from 'antd';
import router from 'umi/router';
import { getLocationParam } from '@/utils/utils';
import * as styles from './SunmiLayout.less';

class SunmiLayout extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bgClass: 'login-bg',
        };
    }

    componentDidMount() {
        this.changeBgClass();
    }

    componentWillReceiveProps() {
        this.changeBgClass();
    }

    changeBgClass = () => {
        const {
            location: { pathname },
        } = window;

        const gaosBg = ['storeRelate', 'merchantCreate'];

        if (gaosBg.some(path => pathname.indexOf(path) > -1)) {
            this.setState({
                bgClass: 'login-gaos-bg',
            });
        } else {
            this.setState({
                bgClass: 'login-bg',
            });
        }
    };

    onMenuClick = async ({ key }) => {
        const { dispatch } = this.props;
        if (key === 'userCenter') {
            router.push('/account');
            return;
        }
        if (key === 'logout') {
            dispatch({
                type: 'user/logout',
            });
        }
    };

    matchParamsPath = (pathname, breadcrumbNameMap) => {
        const pathKey = Object.keys(breadcrumbNameMap).find(key =>
            pathToRegexp(key).test(pathname)
        );
        return breadcrumbNameMap[pathKey];
    };

    getPageTitle = (pathname, breadcrumbNameMap) => {
        const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

        if (!currRouterData) {
            return 'SUNMI STORE';
        }
        const pageName = formatMessage({
            id: currRouterData.locale || currRouterData.name,
            defaultMessage: currRouterData.name,
        });

        return `${pageName} - SUNMI STORE`;
    };

    render() {
        const { bgClass } = this.state;
        const {
            currentUser,
            location: { pathname },
            children,
            breadcrumbNameMap,
        } = this.props;

        const from = getLocationParam('from') || null;
        const currentLanguage = getLocale();

        const menu = (
            <Menu
                className={`${styles['drop-down-menu']} ${styles['drop-down']}`}
                selectedKeys={[]}
                onClick={this.onMenuClick}
            >
                <Menu.Item key="userCenter">
                    <Icon type="user" />
                    <FormattedMessage id="menu.account" defaultMessage="account center" />
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout">
                    <Icon type="logout" />
                    <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
                </Menu.Item>
            </Menu>
        );

        return (
            <>
                <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
                    <div className={`${styles.wrapper} ${styles[bgClass]}`}>
                        <div className={styles['header-bar']}>
                            <div
                                className={
                                    currentLanguage === 'zh-CN' ? styles.logo : styles['logo-en']
                                }
                            />
                            {from !== 'accountCenter' && (
                                <div className={styles['lang-wrapper']}>
                                    <SelectLang className={styles['drop-down']} />
                                </div>
                            )}
                            {from === 'accountCenter' && (
                                <div className={styles['avater-wrapper']}>
                                    {Object.keys(currentUser).length > 0 && (
                                        <HeaderDropdown overlay={menu}>
                                            <span
                                                className={`${styles.action} ${styles.account}`}
                                                style={{ marginRight: 10 }}
                                            >
                                                <Avatar
                                                    size="small"
                                                    className={styles.avatar}
                                                    icon="user"
                                                    src={currentUser.resize_icon}
                                                    alt="avatar"
                                                />
                                                <span className={styles.name}>
                                                    {currentUser.username}
                                                </span>
                                            </span>
                                        </HeaderDropdown>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={styles.divider} />
                        <div className={styles.content}>{children}</div>
                        <div className={styles['footer-bar']}>
                            <span>{formatMessage({ id: 'layout.user.footer' })}</span>
                        </div>
                    </div>
                </DocumentTitle>
            </>
        );
    }
}

export default connect(({ user, menu }) => ({
    currentUser: user.currentUser,
    breadcrumbNameMap: menu.breadcrumbNameMap,
}))(SunmiLayout);
