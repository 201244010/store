import React, { Component } from 'react';
import { Divider, message, Modal, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { DURATION_TIME } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';

export const STATES = {
    0: '未激活',
    1: '正常',
    2: '通信失败',
};

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailVisible: false,
        };
    }

    onTableChange = pagination => {
        const { fetchElectricLabels } = this.props;

        fetchElectricLabels({
            options: {
                current: pagination.current,
            },
        });
    };

    showDetailVisible = async record => {
        const { detailVisible } = this.state;
        const { getBaseStationDetail } = this.props;
        const response = await getBaseStationDetail({ ap_id: record.id });
        if (response && response.code === ERROR_OK) {
            this.setState({
                detailVisible: !detailVisible,
            });
        } else {
            message.error(formatMessage({ id: 'error.retry' }), DURATION_TIME);
        }
    };

    showDeleteStation = record => {
        const { deleteBaseStation } = this.props;
        const content = (
            <div>
                <div>{formatMessage({ id: 'esl.device.ap.delete.message1' })}</div>
                <div>{formatMessage({ id: 'esl.device.ap.delete.message2' })}</div>
            </div>
        );

        Modal.confirm({
            icon: 'info-circle',
            title: formatMessage({ id: 'btn.delete' }),
            content,
            okText: formatMessage({ id: 'btn.delete' }),
            onOk() {
                deleteBaseStation({ ap_id: record.id });
            },
        });
    };

    render() {
        const { loading, data, pagination } = this.props;
        const columns = [
            {
                title: formatMessage({ id: 'esl.device.esl.id' }),
                dataIndex: 'esl_code',
            },
            {
                title: formatMessage({ id: 'esl.device.esl.model.name' }),
                dataIndex: 'model_name',
            },
            {
                title: formatMessage({ id: 'esl.device.esl.product.seq.num' }),
                dataIndex: 'product_seq_num',
            },
            {
                title: formatMessage({ id: 'esl.device.esl.product.name' }),
                dataIndex: 'product_name',
            },
            {
                title: formatMessage({ id: 'esl.device.esl.template.name' }),
                dataIndex: 'template_name',
            },
            {
                title: formatMessage({ id: 'esl.device.esl.status' }),
                dataIndex: 'status',
                render: text => <span>{STATES[text]}</span>,
            },
            {
                title: formatMessage({ id: 'esl.device.esl.battery' }),
                dataIndex: 'battery',
                render: text => <span>{text}%</span>,
            },
            {
                title: formatMessage({ id: 'list.action.title' }),
                key: 'action',
                render: (_, record) => (
                    <span>
                        <a
                            href="javascript: void (0);"
                            onClick={() => this.showDetailVisible(record)}
                        >
                            {formatMessage({ id: 'list.action.detail' })}
                        </a>
                        <Divider type="vertical" />
                        <a
                            href="javascript: void (0);"
                            onClick={() => this.showDetailVisible(record)}
                        >
                            {formatMessage({ id: 'list.action.bind' })}
                        </a>
                        <Divider type="vertical" />
                        <a
                            href="javascript: void (0);"
                            onClick={() => this.showDeleteStation(record)}
                        >
                            {formatMessage({ id: 'list.action.push.again' })}
                        </a>
                        <Divider type="vertical" />
                        <a
                            href="javascript: void (0);"
                            onClick={() => this.showDeleteStation(record)}
                        >
                            {formatMessage({ id: 'list.action.more' })}
                        </a>
                    </span>
                ),
            },
        ];

        return (
            <div>
                <Table
                    rowKey="id"
                    loading={loading}
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        ...pagination,
                        showTotal: total =>
                            `${formatMessage({ id: 'esl.device.ap.all' })}${total}${formatMessage({
                                id: 'esl.device.ap.total',
                            })}`,
                    }}
                    onChange={this.onTableChange}
                />
            </div>
        );
    }
}

export default SearchResult;
