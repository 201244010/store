import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { Layout, message } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
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
        const { getStoreList } = this.props;
        document.addEventListener('scroll', this.handScroll, { passive: true });
        const token = CookieUtil.getCookieByKey(CookieUtil.TOKEN_KEY);
        if (token) {
            getStoreList({});
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
        const { isMobile, handleMenuCollapse, setting } = this.props;
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
                        onNoticeClear={this.handleNoticeClear}
                        onMenuClick={this.handleMenuClick}
                        onNoticeVisibleChange={this.handleNoticeVisibleChange}
                        {...this.props}
                    />
                ) : (
                    <GlobalHeader
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
    ({ user, global, setting, loading, store, notification }) => ({
        currentUser: user.currentUser,
        collapsed: global.collapsed,
        fetchingNotices: loading.effects['notification/getNotificationList'],
        notification,
        setting,
        user,
        store,
    }),
    dispatch => ({
        getStoreList: payload => dispatch({ type: 'store/getStoreList', payload }),
        dispatch,
    })
)(HeaderView);
