import React from 'react';
import { Menu, Icon, Avatar } from 'antd';
import DocumentTitle from 'react-document-title';
import HeaderDropdown from '@/components/HeaderDropdown';
import { FormattedMessage, formatMessage } from 'umi/locale';
import router from 'umi/router';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import styles from './MerchantLayout.less';

class MerchantLayout extends React.PureComponent {
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
		const {
			location: { pathname },
			children,
			currentUser,
			breadcrumbNameMap,
		} = this.props;
		const menu = (
			<Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
				<Menu.Item key="userCenter">
					<Icon type="user" />
					<FormattedMessage id="menu.account" defaultMessage="个人中心" />
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="logout">
					<Icon type="logout" />
					<FormattedMessage id="menu.account.logout" defaultMessage="登出" />
				</Menu.Item>
			</Menu>
		);
		return (
			<>
				<DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
					<div className={styles.container}>
						<div className={styles.content}>
							<div className={styles['content-inline']}>
								<div className={styles['title-background']} />
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
												src={currentUser.avatar}
												alt="avatar"
											/>
											<span className={styles.name}>
												{currentUser.username}
											</span>
										</span>
									</HeaderDropdown>
								)}
							</div>
							{children}
						</div>
					</div>
				</DocumentTitle>
			</>
		);
	}
}

export default connect(({ user, global, setting, menu }) => ({
	currentUser: user.currentUser,
	// fetchingNotices: loading.effects['global/fetchNotices'],
	notices: global.notices,
	breadcrumbNameMap: menu.breadcrumbNameMap,
	...setting,
	user,
}))(MerchantLayout);
