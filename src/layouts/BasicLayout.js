import React from 'react';
import { Layout, message } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { formatMessage } from 'umi/locale';
import MQTTWrapper from '@/components/MQTT';
import Authorized from '@/utils/Authorized';
import router from 'umi/router';
import * as CookieUtil from '@/utils/cookies';
import Storage from '@konata9/storage.js';
import Header from './Header';
import Context from './MenuContext';
import SiderMenu from '@/components/SiderMenu';
import { MENU_PREFIX } from '@/constants';
import styles from './BasicLayout.less';
import logo from '../assets/menuLogo.png';

message.config({
    maxCount: 1,
});

const { Content } = Layout;

const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
        maxWidth: 1599,
    },
    'screen-xxl': {
        minWidth: 1600,
    },
};

@MQTTWrapper
class BasicLayout extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getPageTitle = memoizeOne(this.getPageTitle);
        this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
        this.state = {
            selectedStore: CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY),
        };
    }

    componentDidMount() {
        this.dataInitial();
    }

    componentWillReceiveProps() {
        const {
            location: { pathname },
        } = window;

        if (![`${MENU_PREFIX.STORE}/createStore`, '/account/center'].includes(pathname)) {
            this.checkStore();
        }

        this.setState({
            selectedStore: CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY),
        });
    }

    componentDidUpdate(preProps) {
        // After changing to phone mode,
        // if collapsed is true, you need to click twice to display
        const { collapsed, isMobile } = this.props;
        if (isMobile && !preProps.isMobile && !collapsed) {
            this.handleMenuCollapse(false);
        }
    }

    getContext() {
        const { location, breadcrumbNameMap } = this.props;
        return {
            location,
            breadcrumbNameMap,
        };
    }

    dataInitial = async () => {
        const {
            getMenuData,
            route: { routes, authority },
        } = this.props;

        await getMenuData({ routes, authority });
    };

    matchParamsPath = (pathname, breadcrumbNameMap) => {
        const pathKey = Object.keys(breadcrumbNameMap).find(key =>
            pathToRegexp(key).test(pathname)
        );
        return breadcrumbNameMap[pathKey];
    };

    getRouterAuthority = (pathname, routeData) => {
        let routeAuthority = ['noAuthority'];
        const getAuthority = (key, routes) => {
            routes.map(route => {
                if (route.path === key) {
                    routeAuthority = route.authority;
                } else if (route.routes) {
                    routeAuthority = getAuthority(key, route.routes);
                }
                return route;
            });
            return routeAuthority;
        };
        return getAuthority(pathname, routeData);
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

    getLayoutStyle = () => {
        const { fixSiderbar, isMobile, collapsed, layout } = this.props;
        if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
            return {
                paddingLeft: collapsed ? '80px' : '256px',
            };
        }
        return null;
    };

    handleMenuCollapse = collapsed => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/changeLayoutCollapsed',
            payload: collapsed,
        });
    };

    checkStore = () => {
        const shopList = Storage.get(CookieUtil.SHOP_LIST_KEY, 'local') || [];
        if (shopList.length === 0) {
            message.warning(formatMessage({ id: 'alert.store.is.none' }));
            router.push(`${MENU_PREFIX.STORE}/createStore?action=create`);
        }
    };

    render() {
        const { selectedStore } = this.state;
        const {
            navTheme,
            layout: PropsLayout,
            children,
            location: { pathname },
            isMobile,
            menuData,
            breadcrumbNameMap,
            route: { routes },
            fixedHeader,
        } = this.props;

        const isTop = PropsLayout === 'topmenu';
        const routerConfig = this.getRouterAuthority(pathname, routes);
        const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
        const layout = (
            <Layout>
                {isTop && !isMobile ? null : (
                    <SiderMenu
                        logo={logo}
                        theme={navTheme}
                        onCollapse={this.handleMenuCollapse}
                        menuData={menuData}
                        isMobile={isMobile}
                        {...this.props}
                    />
                )}
                <Layout
                    style={{
                        ...this.getLayoutStyle(),
                        minHeight: '100vh',
                    }}
                >
                    <Header
                        menuData={menuData}
                        handleMenuCollapse={this.handleMenuCollapse}
                        logo={logo}
                        isMobile={isMobile}
                        selectedStore={selectedStore}
                        {...this.props}
                    />
                    {/* <Breadcrumbs /> */}
                    <Content className={styles.content} style={contentStyle}>
                        <Authorized authority={routerConfig} noMatch={<p>Exception403</p>}>
                            {children}
                        </Authorized>
                    </Content>
                </Layout>
            </Layout>
        );
        return (
            <React.Fragment>
                <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
                    <ContainerQuery query={query}>
                        {params => (
                            <Context.Provider value={this.getContext()}>
                                <div className={classNames(params)}>{layout}</div>
                            </Context.Provider>
                        )}
                    </ContainerQuery>
                </DocumentTitle>
            </React.Fragment>
        );
    }
}

export default connect(
    ({ global, setting, menu, user, store: storeData }) => ({
        collapsed: global.collapsed,
        layout: setting.layout,
        menuData: menu.menuData,
        breadcrumbNameMap: menu.breadcrumbNameMap,
        user,
        storeData,
        ...setting,
    }),
    dispatch => ({
        getMenuData: payload => dispatch({ type: 'menu/getMenuData', payload }),
        getStoreList: payload => dispatch({ type: 'store/getStoreList', payload }),
        dispatch,
    })
)(props => (
    <Media query="(max-width: 599px)">
        {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
    </Media>
));
