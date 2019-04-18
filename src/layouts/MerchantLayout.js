import React from 'react';
import { Menu, Icon, Avatar, Spin } from 'antd';
import HeaderDropdown from '@/components/HeaderDropdown';
import { FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { connect } from 'dva';

import styles from './MerchantLayout.less';

class MerchantLayout extends React.PureComponent {
    onMenuClick = async ({ key }) => {
        const { dispatch } = this.props;
        if (key === 'userCenter') {
            router.push('/account/center');
            return;
        }
        if (key === 'logout') {
            dispatch({
                type: 'user/logout',
            });
        }
    };

    render() {
        const { children, currentUser } = this.props;
        const menu = (
            <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
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
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles['content-inline']}>
                        <div className={styles['title-background']} />
                        {currentUser.username ? (
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
                                    <span className={styles.name}>{currentUser.username}</span>
                                </span>
                            </HeaderDropdown>
                        ) : (
                            <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
                        )}
                    </div>
                    {children}
                </div>
            </div>
        );
    }
}

export default connect(({ user, global, setting, loading }) => ({
    currentUser: user.currentUser,
    fetchingNotices: loading.effects['global/fetchNotices'],
    notices: global.notices,
    setting,
    user,
}))(MerchantLayout);
