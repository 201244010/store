import React, { Component } from 'react';
import { Checkbox, Table, Button, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import { MENU_PREFIX } from '@/constants';
import styles from './Notification.less';

@connect(
    state => ({
        notification: state.notification,
    }),
    dispatch => ({
        getNotificationModels: payload =>
            dispatch({ type: 'notification/getNotificationModels', payload }),
        getNotificationList: payload =>
            dispatch({ type: 'notification/getNotificationList', payload }),
        getNotificationCount: () => dispatch({ type: 'notification/getNotificationCount' }),
        updateSearchValue: payload => dispatch({ type: 'notification/updateSearchValue', payload }),
        updateNotificationStatus: payload =>
            dispatch({ type: 'notification/updateNotificationStatus', payload }),
        deleteNotification: payload =>
            dispatch({ type: 'notification/deleteNotification', payload }),
        clearSearchValue: () => dispatch({ type: 'notification/clearSearchValue' }),
    }),
)
class NotificationCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
        };
    }

    componentDidMount() {
        this.init();
    }

    componentWillUnmount() {
        const { clearSearchValue } = this.props;
        clearSearchValue();
    }

    init = async () => {
        const { getNotificationModels, getNotificationList, getNotificationCount } = this.props;
        await getNotificationCount();
        await getNotificationModels();
        await getNotificationList();
    };

    onTableChange = pagination => {
        const { getNotificationList } = this.props;
        getNotificationList({
            pageSize: pagination.pageSize,
            pageNum: pagination.current,
        });
    };

    onChange = async e => {
        const { getNotificationList, updateSearchValue, notification: { searchFormValues } } = this.props;
        await updateSearchValue({
            ...searchFormValues,
            statusCode: e.target.checked ? 0 : -1,
        });
        await getNotificationList();
    };

    onSelectChange = selectedRowKeys => {
        this.setState({
            selectedRowKeys,
        });
    };

    goNotificationInfo = record => {
        const msgId = record.msg_id;
        const { updateNotificationStatus } = this.props;
        updateNotificationStatus({
            msgIdList: [msgId],
            statusCode: 1,
        });
        router.push(`${MENU_PREFIX.NOTIFICATION}/info?msgId=${msgId}`);
    };

    dealMessage = type => {
        const { selectedRowKeys } = this.state;
        const { updateNotificationStatus, deleteNotification } = this.props;
        const dealList = {
            delete: deleteNotification,
            read: updateNotificationStatus,
        };
        dealList[type]({
            msgIdList: selectedRowKeys,
            statusCode: 1,
        });
        this.setState({
            selectedRowKeys: [],
        });
    };

    render() {
        const {
            notification: {
                notificationList,
                modelList,
                pagination,
                loading,
                count: { unread },
            },
        } = this.props;
        const filterList = modelList.map(item =>
            Object.assign({}, { text: item.model_name, value: item.model_name }),
        );
        const columns = [
            {
                title: formatMessage({ id: 'notification.title' }),
                dataIndex: 'title',
                render: (content, record) => (
                    <div
                        onClick={() => this.goNotificationInfo(record)}
                        className={styles['title-content']}
                    >
                        {record.receive_status ? (
                            <span key={record.mes_id} className={styles.read}>{record.title}</span>
                        ) : (
                            <div key={record.msg_id}>
                                <i /><span className={styles.unread}>{record.title}</span>
                            </div>
                        )}
                    </div>
                ),
            },
            {
                title: formatMessage({ id: 'notification.receiveTime' }),
                dataIndex: 'receive_time',
                render: time => <div>{moment.unix(time).format('YYYY-MM-DD HH:mm:ss')}</div>,
            },
            {
                title: formatMessage({ id: 'notification.type' }),
                dataIndex: 'model_name',
                filterIcon: () => <Icon type="filter" style={{ left: '60px' }} />,
                filters: filterList,
                // onFilter: (value) => this.handleFilterChange(value),
                onFilter: (value, record) => record.model_name.indexOf(value) === 0,
            },
        ];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div className={styles.wrapper}>
                <div className={styles.title}>
                    <span className={styles['message-title']}>
                        {formatMessage({ id: 'notification.notificationCenter' })}
                    </span>
                    <Checkbox onChange={this.onChange}>
                        {formatMessage({ id: 'notification.unreadmessage' })}
                        <span className={styles.number}>（{unread}）</span>
                    </Checkbox>
                </div>
                <div className={styles['function-button']}>
                    <Button
                        disabled={!hasSelected}
                        onClick={() => this.dealMessage('delete')}
                        className={styles['first-button']}
                    >
                        {formatMessage({ id: 'btn.delete' })}
                    </Button>
                    <Button disabled={!hasSelected} onClick={() => this.dealMessage('read')}>
                        {formatMessage({ id: 'notification.allread' })}
                    </Button>
                </div>
                <Table
                    rowKey="msg_id"
                    loading={loading}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={notificationList}
                    pagination={{ ...pagination }}
                    onChange={this.onTableChange}
                />
            </div>
        );
    }
}

export default NotificationCenter;
