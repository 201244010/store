import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Avatar, Select } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { NoticeIcon } from 'ant-design-pro';
import Storage from '@konata9/storage.js';
import HeaderSearch from '../HeaderSearch';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
    getNoticeData() {
        const { notices = [] } = this.props;
        if (notices.length === 0) {
            return {};
        }
        const newNotices = notices.map(notice => {
            const newNotice = { ...notice };
            if (newNotice.datetime) {
                newNotice.datetime = moment(notice.datetime).fromNow();
            }
            if (newNotice.id) {
                newNotice.key = newNotice.id;
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
        return groupBy(newNotices, 'type');
    }

    getUnreadData = noticeData => {
        const unreadMsg = {};
        Object.entries(noticeData).forEach(([key, value]) => {
            if (!unreadMsg[key]) {
                unreadMsg[key] = 0;
            }
            if (Array.isArray(value)) {
                unreadMsg[key] = value.filter(item => !item.read).length;
            }
        });
        return unreadMsg;
    };

    changeReadState = clickedItem => {
        const { id } = clickedItem;
        const { dispatch } = this.props;
        dispatch({
            type: 'global/changeNoticeReadState',
            payload: id,
        });
    };

    handleStoreChange = storeId => {
        Storage.set({ __shop_id__: storeId });
        window.location.reload();
    };

    render() {
        const {
            currentUser,
            fetchingNotices,
            onNoticeVisibleChange,
            onMenuClick,
            onNoticeClear,
            theme,
            store: { storeList },
        } = this.props;
        const menu = (
            <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
                <Menu.Item key="userCenter">
                    <Icon type="user" />
                    <FormattedMessage id="menu.account.center" defaultMessage="account center" />
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
        const defaultShop = Storage.get('__shop_id__');

        return (
            <div className={className}>
                <Select
                    defaultValue={defaultShop}
                    style={{ minWidth: '200px' }}
                    onChange={this.handleStoreChange}
                >
                    {storeList.map(store => (
                        <Select.Option key={store.shop_id} value={store.shop_id}>
                            {store.shop_name || ''}
                        </Select.Option>
                    ))}
                </Select>
                <HeaderSearch
                    className={`${styles.action} ${styles.search}`}
                    placeholder={formatMessage({ id: 'component.globalHeader.search' })}
                    dataSource={[
                        formatMessage({ id: 'component.globalHeader.search.example1' }),
                        formatMessage({ id: 'component.globalHeader.search.example2' }),
                        formatMessage({ id: 'component.globalHeader.search.example3' }),
                    ]}
                    onSearch={value => {
                        console.log('input', value); // eslint-disable-line
                    }}
                    onPressEnter={value => {
                        console.log('enter', value); // eslint-disable-line
                    }}
                />
                <NoticeIcon
                    className={styles.action}
                    count={currentUser.unreadCount}
                    onItemClick={(item, tabProps) => {
                        console.log(item, tabProps); // eslint-disable-line
                        this.changeReadState(item, tabProps);
                    }}
                    locale={{
                        emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),
                        clear: formatMessage({ id: 'component.noticeIcon.clear' }),
                    }}
                    onClear={onNoticeClear}
                    onPopupVisibleChange={onNoticeVisibleChange}
                    loading={fetchingNotices}
                    clearClose
                >
                    <NoticeIcon.Tab
                        count={unreadMsg.notification}
                        list={noticeData.notification}
                        title={formatMessage({ id: 'component.globalHeader.notification' })}
                        name="notification"
                        emptyText={formatMessage({
                            id: 'component.globalHeader.notification.empty',
                        })}
                        emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                    />
                    <NoticeIcon.Tab
                        count={unreadMsg.message}
                        list={noticeData.message}
                        title={formatMessage({ id: 'component.globalHeader.message' })}
                        name="message"
                        emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
                        emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                    />
                    <NoticeIcon.Tab
                        count={unreadMsg.event}
                        list={noticeData.event}
                        title={formatMessage({ id: 'component.globalHeader.event' })}
                        name="event"
                        emptyText={formatMessage({ id: 'component.globalHeader.event.empty' })}
                        emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
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
