import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { Layout, message } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import * as CookieUtil from '@/utils/cookies';
import styles from './Header.less';

const { Header } = Layout;

class HeaderView extends PureComponent {
	state = {
		visible: true,
	};

	static getDerivedStateFromProps(props, state) {
		if (!props.autoHideHeader && !state.visible) {
			return {
				visible: true,
			};
		}
		return null;
	}

	componentDidMount() {
		const { getStoreList, getOrgLayer } = this.props;
		document.addEventListener('scroll', this.handScroll, { passive: true });
		const token = CookieUtil.getCookieByKey(CookieUtil.TOKEN_KEY);
		if (token) {
			getStoreList({});
			getOrgLayer({});
		}
	}

	componentWillUnmount() {
		document.removeEventListener('scroll', this.handScroll);
	}

	getHeadWidth = () => {
		const { isMobile, collapsed, setting } = this.props;
		const { fixedHeader, layout } = setting;
		if (isMobile || !fixedHeader || layout === 'topmenu') {
			return '100%';
		}
		return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
	};

	handleNoticeClear = type => {
		message.success(
			`${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({
				id: `component.globalHeader.${type}`,
			})}`
		);
	};

	handleMenuClick = async ({ key }) => {
		const { logout, goToPath } = this.props;
		if (key === 'userCenter') {
			goToPath('account');
			// router.push('/account');
			return;
		}
		if (key === 'logout') {
			logout();
		}
	};

	handleNoticeVisibleChange = values => {
		console.log(values);
	};

	handScroll = () => {
		const { autoHideHeader } = this.props;
		const { visible } = this.state;
		if (!autoHideHeader) {
			return;
		}
		const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
		if (!this.ticking) {
			this.ticking = true;
			requestAnimationFrame(() => {
				if (this.oldScrollTop > scrollTop) {
					this.setState({
						visible: true,
					});
				} else if (scrollTop > 300 && visible) {
					this.setState({
						visible: false,
					});
				} else if (scrollTop < 300 && !visible) {
					this.setState({
						visible: true,
					});
				}
				this.oldScrollTop = scrollTop;
				this.ticking = false;
			});
		}
	};

	render() {
		const { isMobile, handleMenuCollapse, setting, getUnreadNotification } = this.props;
		const { navTheme, layout, fixedHeader } = setting;
		const { visible } = this.state;
		const isTop = layout === 'topmenu';
		const width = this.getHeadWidth();
		const HeaderDom = visible ? (
			<Header style={{ padding: 0, width }} className={fixedHeader ? styles.fixedHeader : ''}>
				{isTop && !isMobile ? (
					<TopNavHeader
						theme={navTheme}
						mode="horizontal"
						onCollapse={handleMenuCollapse}
						getUnreadNotification={getUnreadNotification}
						onNoticeClear={this.handleNoticeClear}
						onMenuClick={this.handleMenuClick}
						onNoticeVisibleChange={this.handleNoticeVisibleChange}
						{...this.props}
					/>
				) : (
					<GlobalHeader
						getUnreadNotification={getUnreadNotification}
						onCollapse={handleMenuCollapse}
						onNoticeClear={this.handleNoticeClear}
						onMenuClick={this.handleMenuClick}
						onNoticeVisibleChange={this.handleNoticeVisibleChange}
						{...this.props}
					/>
				)}
			</Header>
		) : null;
		return (
			<Animate component="" transitionName="fade">
				{HeaderDom}
			</Animate>
		);
	}
}

export default connect(
	({ user, global, setting, store, notification }) => ({
		currentUser: user.currentUser,
		collapsed: global.collapsed,
		fetchingNotices: notification.loading,
		notification,
		setting,
		user,
		store,
	}),
	dispatch => ({
		logout: () => dispatch({ type: 'user/logout' }),
		getStoreList: payload => dispatch({ type: 'store/getStoreList', payload }),
		getOrgLayer: payload => dispatch({ type: 'store/getOrgLayer', payload }),
		getUnreadNotification: () => dispatch({ type: 'notification/getUnreadNotification' }),
		getNotificationCount: () => dispatch({ type: 'notification/getNotificationCount' }),
		goToPath: (pathId, urlParams = {}, linkType = null) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams, linkType } }),
		dispatch,
	})
)(HeaderView);
