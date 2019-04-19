import React, { Component } from 'react';
import { Button, Divider, message, Modal, Table } from "antd";
import { formatMessage } from 'umi/locale';
import { DURATION_TIME, ESL_STATES } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';
import Detail from './Detail';

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

    showDetailVisible = async (record) => {
        const { detailVisible } = this.state;
        const { fetchESLDetails } = this.props;
        const response = await fetchESLDetails({
            options: {
                esl_id: record.id
            }
        });
        if (response && response.code === ERROR_OK) {
            this.setState({
                detailVisible: !detailVisible,
            });
        } else {
            message.error(formatMessage({ id: 'error.retry' }), DURATION_TIME);
        }
    };

    pushAgain = async () => {

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

    closeModal = name => {
        const { [name]: modalStatus } = this.state;
        this.setState({
            [name]: !modalStatus,
        });
    };

    render() {
        const { loading, data, pagination, detailInfo } = this.props;
        const { detailVisible } = this.state;
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
                render: text => <span>{ESL_STATES[text]}</span>,
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
                            onClick={() => this.pushAgain(record)}
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
                            `${formatMessage({ id: 'esl.device.esl.all' })}${total}${formatMessage({
                                id: 'esl.device.esl.total',
                            })}`,
                    }}
                    onChange={this.onTableChange}
                />
                <Modal
                    title={formatMessage({ id: 'esl.device.esl.detail' })}
                    visible={detailVisible}
                    width={650}
                    onCancel={() => this.closeModal('detailVisible')}
                    footer={[
                        <Button
                            key="submit"
                            type="primary"
                            onClick={() => this.closeModal('detailVisible')}
                        >
                            {formatMessage({ id: 'btn.confirm' })}
                        </Button>,
                    ]}
                >
                    <Detail detailInfo={detailInfo} />
                </Modal>
            </div>
        );
    }
}

export default SearchResult;
