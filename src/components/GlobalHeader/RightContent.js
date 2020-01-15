import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Avatar, /* Select, */ TreeSelect } from 'antd';
// import moment from 'moment';
// import router from 'umi/router';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import * as CookieUtil from '@/utils/cookies';
import { formatTimeMessage } from '@/utils/utils';
// import HeaderSearch from '../HeaderSearch';
import HeaderDropdown from '../HeaderDropdown';
import { MENU_PREFIX } from '@/constants';

import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch({
			type: 'notification/getNotificationList',
			payload: {},
		});
	}

	getNoticeData() {
		const { notification = {} } = this.props;
		const notices = notification.unreadList;

		if (notices.length === 0) {
			return {};
		}
		const newNotices = notices.map(notice => {
			const newNotice = { ...notice };
			if (newNotice.receive_time) {
				newNotice.receive_time = formatTimeMessage(notice.receive_time);
			}
			if (newNotice.msg_id) {
				newNotice.key = newNotice.msg_id;
			}
			if (newNotice.extra && newNotice.status) {
				const color = {
					todo: '',
					processing: 'blue',
					urgent: 'red',
					doing: 'gold',
				}[newNotice.status];
				newNotice.extra = (
					<Tag color={color} style={{ marginRight: 0 }}>
						{newNotice.extra}
					</Tag>
				);
			}
			return newNotice;
		});
		return groupBy(newNotices, 'receive_status');
	}

	getUnreadData = noticeData => {
		const unreadMsg = {};
		Object.entries(noticeData).forEach(([key, value]) => {
			if (!unreadMsg[key]) {
				unreadMsg[key] = 0;
			}
			if (Array.isArray(value)) {
				unreadMsg[key] = value.filter(item => !item.receive_status).length;
			}
		});
		return unreadMsg;
	};

	changeReadState = clickedItem => {
		const { msg_id } = clickedItem;
		const { dispatch } = this.props;
		dispatch({
			type: 'notification/updateNotificationStatus',
			payload: {
				msgIdList: [msg_id],
				statusCode: 1,
			},
		});
		window.open(`${MENU_PREFIX.NOTIFICATION}/info?msgId=${msg_id}`);
		// router.push(`/notificationInfo?msgId=${msg_id}`);
	};

	handleStoreChange = storeId => {
		const { goToPath } = this.props;
		CookieUtil.setCookieByKey(CookieUtil.SHOP_ID_KEY, storeId);
		goToPath('root', {}, 'href');
		// window.location.reload();
	};

	render() {
		const {
			currentUser,
			notification,
			fetchingNotices,
			getNotificationCount,
			getUnreadNotification,
			onNoticeVisibleChange,
			onMenuClick,
			onNoticeClear,
			theme,
			store: { /* allStores: storeList, */ treeData },
			selectedStore,
		} = this.props;

		const menu = (
			<Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
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
		const noticeData = this.getNoticeData();
		const unreadMsg = this.getUnreadData(noticeData);
		let className = styles.right;
		if (theme === 'dark') {
			className = `${styles.right}  ${styles.dark}`;
		}
		return (
			<div className={className}>
				<TreeSelect
					style={{ width: '250px' }}
					treeData={treeData}
					value={treeData && treeData.length > 0 ? `${selectedStore}` : ''}
					onChange={this.handleStoreChange}
					treeDefaultExpandedKeys={[`${selectedStore}`]}
					dropdownStyle={{ maxHeight: '50vh'}}
				/>
				{/* <Select
					value={selectedStore}
					style={{ width: '250px' }}
					onChange={this.handleStoreChange}
				>
					{storeList.map(store => (
						<Select.Option key={store.shopId} value={store.shopId}>
							{store.shopName || ''}
						</Select.Option>
					))}
				</Select> */}
				{/* <HeaderSearch */}
				{/* className={`${styles.action} ${styles.search}`} */}
				{/* placeholder={formatMessage({ id: 'component.globalHeader.search' })} */}
				{/* dataSource={[ */}
				{/* formatMessage({ id: 'component.globalHeader.search.example1' }), */}
				{/* formatMessage({ id: 'component.globalHeader.search.example2' }), */}
				{/* formatMessage({ id: 'component.globalHeader.search.example3' }), */}
				{/* ]} */}
				{/* onSearch={value => { */}
				{/* console.log('input', value); // eslint-disable-line */}
				{/* }} */}
				{/* onPressEnter={value => { */}
				{/* console.log('enter', value); // eslint-disable-line */}
				{/* }} */}
				{/* /> */}
				{/* <NoticeIcon */}
				{/* className={styles.action} */}
				{/* count={currentUser.unreadCount} */}
				{/* onItemClick={(item, tabProps) => { */}
				{/* console.log(item, tabProps); // eslint-disable-line */}
				{/* this.changeReadState(item, tabProps); */}
				{/* }} */}
				{/* locale={{ */}
				{/* emptyText: formatMessage({ id: 'component.noticeIcon.empty' }), */}
				{/* clear: formatMessage({ id: 'component.noticeIcon.clear' }), */}
				{/* }} */}
				{/* onClear={onNoticeClear} */}
				{/* onPopupVisibleChange={onNoticeVisibleChange} */}
				{/* loading={fetchingNotices} */}
				{/* clearClose */}
				{/* > */}
				{/* <NoticeIcon.Tab */}
				{/* count={unreadMsg.notification} */}
				{/* list={noticeData.notification} */}
				{/* title={formatMessage({ id: 'component.globalHeader.notification' })} */}
				{/* name="notification" */}
				{/* emptyText={formatMessage({ */}
				{/* id: 'component.globalHeader.notification.empty', */}
				{/* })} */}
				{/* emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg" */}
				{/* /> */}
				{/* <NoticeIcon.Tab */}
				{/* count={unreadMsg.message} */}
				{/* list={noticeData.message} */}
				{/* title={formatMessage({ id: 'component.globalHeader.message' })} */}
				{/* name="message" */}
				{/* emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })} */}
				{/* emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg" */}
				{/* /> */}
				{/* <NoticeIcon.Tab */}
				{/* count={unreadMsg.event} */}
				{/* list={noticeData.event} */}
				{/* title={formatMessage({ id: 'component.globalHeader.event' })} */}
				{/* name="event" */}
				{/* emptyText={formatMessage({ id: 'component.globalHeader.event.empty' })} */}
				{/* emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg" */}
				{/* /> */}
				{/* </NoticeIcon> */}
				<NoticeIcon
					className={styles.action}
					count={notification.count.unread}
					onItemClick={(item, tabProps) => {
						// console.log(item, tabProps); // eslint-disable-line
						this.changeReadState(item, tabProps);
					}}
					loading={fetchingNotices}
					locale={{
						emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),
						clear: formatMessage({ id: 'component.noticeIcon.clear' }),
						viewMore: formatMessage({ id: 'component.noticeIcon.view-more' }),
						unread: formatMessage({ id: 'component.globalHeader.unread' }),
						message: formatMessage({ id: 'component.globalHeader.message' }),
						event: formatMessage({ id: 'component.globalHeader.event' }),
					}}
					onClear={onNoticeClear}
					onPopupVisibleChange={onNoticeVisibleChange}
					onViewMore={() => {
						window.open(`${MENU_PREFIX.NOTIFICATION}/center`);
						// router.push('/notificationCenter');
					}}
					getNotificationCount={getNotificationCount}
					getUnreadNotification={getUnreadNotification}
					clearClose
				>
					<NoticeIcon.Tab
						count={unreadMsg['0']}
						list={noticeData['0']}
						title="unread"
						emptyText={formatMessage({
							id: 'component.globalHeader.notification.empty',
						})}
						emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
						showViewMore
					/>
				</NoticeIcon>
				{Object.keys(currentUser).length > 0 ? (
					<HeaderDropdown overlay={menu}>
						<span className={`${styles.action} ${styles.account}`}>
							<Avatar
								size="small"
								className={styles.avatar}
								icon="user"
								src={currentUser.resize_icon}
								alt="avatar"
							/>
							<span className={styles.name}>{currentUser.username}</span>
						</span>
					</HeaderDropdown>
				) : (
					<Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
				)}
			</div>
		);
	}
}
