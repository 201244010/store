import React, { Component } from 'react';
import { Checkbox, Table, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
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
        updateNotificationStatus: payload =>
            dispatch({ type: 'notification/updateNotificationStatus', payload }),
        deleteNotification: payload =>
            dispatch({ type: 'notification/deleteNotification', payload }),
    })
)
class NotificationCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
        };
    }

    componentDidMount() {
        const { getNotificationModels, getNotificationList } = this.props;
        getNotificationModels();
        getNotificationList();
    }

    onTableChange = pagination => {
        const { getNotificationList } = this.props;
        getNotificationList({
            pageSize: pagination.pageSize,
            pageNum: pagination.current,
        });
    };

    onChange = e => {
        const { getNotificationList } = this.props;
        getNotificationList({
            statusCode: e.target.checked ? 0 : -1,
        });
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
        router.push(`/notificationInfo?msgId=${msgId}`);
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
            notification: { notificationList, modelList, pagination },
        } = this.props;
        const filterList = modelList.map(item =>
            Object.assign({}, { text: item.model_name, value: item.model_name })
        );
        const columns = [
            {
                title: formatMessage({ id: 'basicData.product.seq_num' }),
                dataIndex: 'title',
                render: (content, record) => (
                    <div
                        onClick={() => this.goNotificationInfo(record)}
                        className={styles['title-content']}
                    >
                        {record.receive_status ? (
                            <span className={styles.read}>{record.title}</span>
                        ) : (
                            [<i />, <span className={styles.unread}>{record.title}</span>]
                        )}
                    </div>
                ),
            },
            {
                title: formatMessage({ id: 'basicData.product.name' }),
                dataIndex: 'receive_time',
                render: time => <div>{moment.unix(time).format('YYYY-MM-DD hh:mm:ss')}</div>,
            },
            {
                title: formatMessage({ id: 'basicData.product.bar_code' }),
                dataIndex: 'model_name',
                filters: filterList,
                onFilter: (value, record) => record.model_name.indexOf(value) === 0,
            },
        ];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        const unreadCount = notificationList.filter(item => item.receive_status === 0).length;
        return (
            <div className={styles.wrapper}>
                <div className={styles.title}>
                    <span className={styles['message-title']}>
                        {formatMessage({ id: 'notification.notificationCenter' })}
                    </span>
                    <Checkbox onChange={this.onChange}>
                        {formatMessage({ id: 'notification.unreadmessage' })}
                        <span className={styles.number}>（{unreadCount}）</span>
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
                <div>
                    <Table
                        rowKey="msg_id"
                        // loading={loading}
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={notificationList}
                        pagination={{ ...pagination }}
                        onChange={this.onTableChange}
                    />
                </div>
            </div>
        );
    }
}

export default NotificationCenter;
