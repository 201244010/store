import React, { Component } from 'react';
import { Button, Divider, message, Modal, Table, Menu, Dropdown, Row, Col, Select } from "antd";
import { formatMessage } from 'umi/locale';
import { DURATION_TIME, ESL_STATES } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';
import Detail from './Detail';

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailVisible: false,
            templateVisible: false,
            currentRecord: {}
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

    deleteESL = (record) => {
        const { deleteESL } = this.props;
        const content = (
            <div>
                <div>{formatMessage({ id: 'esl.device.esl.delete.message1' })}</div>
                <div>{formatMessage({ id: 'esl.device.esl.delete.message2' })}</div>
            </div>
        );

        Modal.confirm({
            icon: 'info-circle',
            title: formatMessage({ id: 'btn.delete' }),
            content,
            okText: formatMessage({ id: 'btn.delete' }),
            onOk() {
                deleteESL({
                    options: { esl_id: record.id },
                });
            },
        });
    };

    closeModal = name => {
        const { [name]: modalStatus } = this.state;
        this.setState({
            [name]: !modalStatus,
        });
    };

    handleMoreClick = async (e) => {
        const { flashLed, fetchTemplatesByESLCode } = this.props;
        const { dataset: {recordId, record} } = e.domEvent.target;
        const eslDetail = JSON.parse(record);
        if (e.key === '1') {
            await fetchTemplatesByESLCode({
                options: {
                    esl_code: eslDetail.esl_code
                }
            });
            this.setState({
                templateVisible: true,
                currentRecord: eslDetail
            });
        }
        if (e.key === '2') {
            flashLed({
                options: {
                    mode_id: 60019,
                    esl_id_list: [parseInt(recordId, 10)]
                }
            });
        }
        if (e.key === '3') {
            this.deleteESL({
                id: recordId
            });
        }
    };

    render() {
        const { loading, data, pagination, detailInfo, templates4ESL } = this.props;
        const { detailVisible, templateVisible, currentRecord } = this.state;
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
                        <Dropdown overlay={
                            <Menu onClick={this.handleMoreClick}>
                                <Menu.Item key="0">
                                    <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
                                </Menu.Item>
                                <Menu.Divider />
                                {
                                    record.product_id ?
                                        <Menu.Item key="1">
                                            <a href="javascript: void (0);" data-record={JSON.stringify(record)}>修改模板</a>
                                        </Menu.Item> :
                                        null
                                }
                                {
                                    record.product_id ? <Menu.Divider /> : null
                                }
                                <Menu.Item key="2">
                                    <a href="javascript: void (0);" data-record-id={record.id}>闪灯</a>
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item key="3">
                                    <a href="javascript: void (0);" data-record-id={record.id}>删除</a>
                                </Menu.Item>
                            </Menu>
                        }
                        >
                            <a className="ant-dropdown-link" href="javascript: void (0)">
                                {formatMessage({ id: 'list.action.more' })}
                            </a>
                        </Dropdown>
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
                <Modal
                    title={formatMessage({ id: 'esl.device.esl.template.edit' })}
                    visible={templateVisible}
                    width={500}
                    onCancel={() => this.closeModal('templateVisible')}
                    footer={[
                        <Button
                            key="submit"
                            type="primary"
                            onClick={() => this.closeModal('templateVisible')}
                        >
                            {formatMessage({ id: 'btn.confirm' })}
                        </Button>,
                    ]}
                >
                    <Row>
                        <Col span={4}>{formatMessage({ id: 'esl.device.esl.id' })}:</Col>
                        <Col span={20}>{currentRecord.esl_code}</Col>
                        <Col span={4}>{formatMessage({ id: 'esl.device.esl.product.seq.num' })}:</Col>
                        <Col span={20}>{currentRecord.product_seq_num}</Col>
                        <Col span={4}>{formatMessage({ id: 'esl.device.esl.product.name' })}:</Col>
                        <Col span={20}>{currentRecord.product_name}</Col>
                        <Col span={4}>{formatMessage({ id: 'esl.device.esl.template.name' })}:</Col>
                        <Col span={20}>
                            <Select value={currentRecord.template_id} style={{width: '100%'}}>
                                {
                                    templates4ESL.map(template =>
                                        <Select.Option key={template.id} value={template.id}>
                                            {template.name}
                                        </Select.Option>
                                    )
                                }
                            </Select>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default SearchResult;
