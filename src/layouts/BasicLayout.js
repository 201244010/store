import React from 'react';
import ResizeDetecor from 'element-resize-detector';

import { Layout, message, Spin } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { formatMessage, getLocale } from 'umi/locale';
import MQTTWrapper from '@/components/MQTT';
import * as CookieUtil from '@/utils/cookies';
// import router from 'umi/router';
import Storage from '@konata9/storage.js';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Header from './Header';
import Context from './MenuContext';
import SiderMenu from '@/components/SiderMenu';
import { MENU_PREFIX } from '@/constants';
import styles from './BasicLayout.less';
import logo from '../assets/logo-big.png';
import logoEN from '../assets/menuLogoEN.png';
import { env } from '@/config';

import 'react-perfect-scrollbar/dist/css/styles.css';

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

const UNAUTH_PATH = ['account', 'notification', 'exception'];

@MQTTWrapper
class BasicLayout extends React.PureComponent {
	constructor(props) {
		super(props);
		this.getPageTitle = memoizeOne(this.getPageTitle);
		this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
		this.state = {
			selectedStore: CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY),
			inMenuChecking: true,
		};
	}

	componentDidMount() {
		this.dataInitial();
	}

	componentWillReceiveProps() {
		const {
			location: { pathname },
		} = window;

		if (![`${MENU_PREFIX.STORE}/createStore`, '/account'].includes(pathname)) {
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

		if (this.dom) {
			const erd = ResizeDetecor();
			erd.listenTo(this.dom, () => {
				this.scrollbar._ps.update();
			});
		}
	}

	getContext() {
		const { location, breadcrumbNameMap } = this.props;
		return {
			location,
			breadcrumbNameMap,
		};
	}

	checkMenuAuth = menuData => {
		const {
			location: { pathname },
		} = window;
		const { goToPath } = this.props;

		const visitPath = pathname.slice(1).split('/')[0];
		if (UNAUTH_PATH.includes(visitPath)) {
			this.setState({
				inMenuChecking: false,
			});
		} else if (pathname === '/') {
			goToPath('root');
			this.setState({
				inMenuChecking: false,
			});
		} else {
			const isAccessable = menuData.some(menu => menu.path.slice(1) === visitPath);
			if (isAccessable) {
				this.setState({
					inMenuChecking: false,
				});
			} else {
				goToPath('noPermission');
				this.setState({
					inMenuChecking: false,
				});
				// goToPath('noPermission');
				// router.goBack();
			}
		}
	};

	dataInitial = async () => {
		const {
			getMenuData,
			route: { routes, authority },
			logout,
		} = this.props;

		const currentCompany = CookieUtil.getCookieByKey(CookieUtil.COMPANY_ID_KEY);
		if (!currentCompany) {
			logout();
		} else {
			const menuData = await getMenuData({ routes, authority });
			if (env === 'dev') {
				this.setState({
					inMenuChecking: false,
				});
			} else {
				this.checkMenuAuth(menuData);
			}
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
		const { goToPath, role: { userPermissionList = [] } = {} } = this.props;
		const shopList = Storage.get(CookieUtil.SHOP_LIST_KEY, 'local') || [];
		if (shopList.length === 0) {
			if (
				userPermissionList.some(
					permission => permission.path === `${MENU_PREFIX.STORE}/list`
				)
			) {
				message.warning(formatMessage({ id: 'alert.store.is.none' }));
				goToPath('storeCreate', { action: 'create' });
			} else {
				goToPath('account');
			}
			// router.push(`${MENU_PREFIX.STORE}/createStore?action=create`);
		}
	};

	render() {
		const { selectedStore, inMenuChecking } = this.state;
		const {
			navTheme,
			layout: PropsLayout,
			children,
			location: { pathname },
			isMobile,
			menuData,
			breadcrumbNameMap,
			fixedHeader,
		} = this.props;
		const currentLanguage = getLocale();
		const isTop = PropsLayout === 'topmenu';
		const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
		const layout = (
			<Layout>
				{isTop && !isMobile ? null : (
					<SiderMenu
						logo={currentLanguage === 'zh-CN' ? logo : logoEN}
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
						{children}
					</Content>
				</Layout>
			</Layout>
		);
		return (
			<React.Fragment>
				<DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
					{inMenuChecking ? (
						<Spin spinning />
					) : (
						<ContainerQuery query={query}>
							{params => (
								<Context.Provider value={this.getContext()}>
									<PerfectScrollbar
										ref={scrollbar => (this.scrollbar = scrollbar)}
									>
										<div
											ref={dom => (this.dom = dom)}
											className={classNames(params)}
										>
											{layout}
										</div>
									</PerfectScrollbar>
								</Context.Provider>
							)}
						</ContainerQuery>
					)}
				</DocumentTitle>
			</React.Fragment>
		);
	}
}

export default connect(
	({ global, setting, menu, user, store: storeData, role }) => ({
		collapsed: global.collapsed,
		layout: setting.layout,
		menuData: menu.menuData,
		breadcrumbNameMap: menu.breadcrumbNameMap,
		user,
		storeData,
		role,
		...setting,
	}),
	dispatch => ({
		logout: () => dispatch({ type: 'user/logout' }),
		getMenuData: payload => dispatch({ type: 'menu/getMenuData', payload }),
		getStoreList: payload => dispatch({ type: 'store/getStoreList', payload }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
		dispatch,
	})
)(props => (
	<Media query="(max-width: 599px)">
		{isMobile => <BasicLayout {...props} isMobile={isMobile} />}
	</Media>
));
