import React, { Component } from 'react';
import { Button, Divider, message, Modal, Table, Menu, Dropdown, Row, Col, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import { DURATION_TIME } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';
import { unixSecondToDate } from '@/utils/utils';
import Detail from './Detail';
import BindModal from './BindModal';
import styles from './index.less';

const ESL_STATES = {
    1: formatMessage({ id: 'esl.device.esl.push.wait.bind' }),
    2: formatMessage({ id: 'esl.device.esl.push.wait' }),
    3: formatMessage({ id: 'esl.device.esl.push.success' }),
    4: formatMessage({ id: 'esl.device.esl.push.fail' }),
};

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailVisible: false,
            templateVisible: false,
            bindVisible: false,
            currentRecord: {},
            selectedProduct: {},
        };
    }

    onTableChange = pagination => {
        const { fetchElectricLabels } = this.props;

        fetchElectricLabels({
            options: {
                current: pagination.current,
                pageSize: pagination.pageSize,
            },
        });
    };

    showDetail = async record => {
        const { detailVisible } = this.state;
        const { fetchESLDetails } = this.props;
        const response = await fetchESLDetails({
            options: {
                esl_id: record.id,
            },
        });
        if (response && response.code === ERROR_OK) {
            this.setState({
                detailVisible: !detailVisible,
            });
        } else {
            message.error(formatMessage({ id: 'error.retry' }), DURATION_TIME);
        }
    };

    showBind = async record => {
        const { fetchTemplatesByESLCode, fetchProductList } = this.props;
        await fetchTemplatesByESLCode({
            options: {
                esl_code: record.esl_code,
            },
        });
        await fetchProductList({
            options: {
                current: 1,
            },
        });

        this.setState({
            currentRecord: record,
            selectedProduct: {
                id: record.product_id,
            },
            bindVisible: true,
        });
    };

    flushESL = async record => {
        const { flushESL } = this.props;
        flushESL({
            options: {
                esl_code: record.esl_code,
                product_id: record.product_id,
            },
        });
    };

    unbindESL = record => {
        const { unbindESL } = this.props;
        const content = (
            <div>
                <div>{formatMessage({ id: 'esl.device.esl.unbind.message' })}</div>
            </div>
        );

        Modal.confirm({
            icon: 'info-circle',
            title: formatMessage({ id: 'esl.device.esl.unbind.title' }),
            content,
            okText: formatMessage({ id: 'btn.unbind' }),
            onOk() {
                unbindESL({
                    options: { esl_code: record.eslCode },
                });
            },
        });
    };

    deleteESL = record => {
        const { deleteESL } = this.props;
        const content = (
            <div>
                <div>{formatMessage({ id: 'esl.device.esl.delete.message1' })}</div>
                <div>{formatMessage({ id: 'esl.device.esl.delete.message2' })}</div>
            </div>
        );

        Modal.confirm({
            icon: 'info-circle',
            title: formatMessage({ id: 'esl.device.esl.delete.title' }),
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

    selectProduct = selectedProduct => {
        this.setState({
            selectedProduct,
        });
    };

    updateProduct = templateId => {
        const { currentRecord } = this.state;
        this.setState({
            currentRecord: {
                ...currentRecord,
                template_id: templateId,
            },
        });
    };

    handleMoreClick = async e => {
        const { flashModes, flashLed, fetchTemplatesByESLCode } = this.props;
        const {
            dataset: { recordId, record },
        } = e.domEvent.target;

        if (e.key === '0') {
            const eslDetail = JSON.parse(record);
            this.unbindESL({
                eslCode: eslDetail.esl_code,
            });
        }
        if (e.key === '1') {
            const eslDetail = JSON.parse(record);
            await fetchTemplatesByESLCode({
                options: {
                    esl_code: eslDetail.esl_code,
                },
            });
            this.setState({
                templateVisible: true,
                currentRecord: eslDetail,
            });
        }
        if (e.key === '2') {
            if (flashModes[0]) {
                flashLed({
                    options: {
                        mode_id: flashModes[0].id,
                        esl_id_list: [parseInt(recordId, 10)],
                    },
                });
            } else {
                message.error(formatMessage({ id: 'esl.device.esl.flash.mode.error' }));
            }
        }
        if (e.key === '3') {
            this.deleteESL({
                id: recordId,
            });
        }
        if (e.key === '4') {
            const eslDetail = JSON.parse(record);
            this.showBind(eslDetail);
        }
        if (e.key === '5') {
            const eslDetail = JSON.parse(record);
            this.flushESL(eslDetail);
        }
    };

    confirmBind = () => {
        const { changeTemplate } = this.props;
        const { currentRecord } = this.state;

        changeTemplate({
            options: {
                template_id: currentRecord.template_id,
                esl_code: currentRecord.esl_code,
            },
        });
        this.closeModal('templateVisible');
    };

    render() {
        const {
            loading,
            data,
            pagination,
            detailInfo,
            templates4ESL,
            products,
            productPagination,
            fetchProductList,
            bindESL,
        } = this.props;
        const {
            detailVisible,
            templateVisible,
            bindVisible,
            currentRecord,
            selectedProduct,
        } = this.state;
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
                title: formatMessage({ id: 'esl.device.esl.battery' }),
                dataIndex: 'battery',
                render: text => (
                    <span className={text < 10 ? styles['low-battery'] : ''}>{text}%</span>
                ),
                sorter: (a, b) => a.battery - b.battery,
                sortDirections: ['descend', 'ascend'],
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
                render: text => (
                    <span style={{ color: `${text}` === '2' ? 'red' : 'rgba(0, 0, 0, 0.65)' }}>
                        {ESL_STATES[text]}
                    </span>
                ),
            },
            {
                title: formatMessage({ id: 'esl.device.esl.push.time' }),
                dataIndex: 'push_time',
                render: text => (text !== 0 ? <span>{unixSecondToDate(text)}</span> : <noscript />),
            },
            {
                title: formatMessage({ id: 'list.action.title' }),
                key: 'action',
                render: (_, record) => (
                    <span>
                        <a href="javascript: void (0);" onClick={() => this.showDetail(record)}>
                            {formatMessage({ id: 'list.action.detail' })}
                        </a>
                        <Divider type="vertical" />
                        <Dropdown
                            overlay={
                                <Menu onClick={this.handleMoreClick}>
                                    <Menu.Item key="4">
                                        <a
                                            href="javascript: void (0);"
                                            data-record={JSON.stringify(record)}
                                        >
                                            {formatMessage({ id: 'list.action.bind' })}
                                        </a>
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item key="5">
                                        <a
                                            href="javascript: void (0);"
                                            data-record={JSON.stringify(record)}
                                        >
                                            {formatMessage({ id: 'list.action.push.again' })}
                                        </a>
                                    </Menu.Item>
                                    <Menu.Divider />
                                    {record.product_id ? (
                                        <Menu.Item key="0">
                                            <a
                                                href="javascript: void (0);"
                                                data-record={JSON.stringify(record)}
                                            >
                                                {formatMessage({ id: 'esl.device.esl.unbind' })}
                                            </a>
                                        </Menu.Item>
                                    ) : null}
                                    {record.product_id ? <Menu.Divider /> : null}
                                    {record.product_id ? (
                                        <Menu.Item key="1">
                                            <a
                                                href="javascript: void (0);"
                                                data-record={JSON.stringify(record)}
                                            >
                                                {formatMessage({
                                                    id: 'esl.device.esl.template.alter',
                                                })}
                                            </a>
                                        </Menu.Item>
                                    ) : null}
                                    {record.product_id ? <Menu.Divider /> : null}
                                    <Menu.Item key="2">
                                        <a href="javascript: void (0);" data-record-id={record.id}>
                                            {formatMessage({ id: 'esl.device.esl.flash' })}
                                        </a>
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item key="3">
                                        <a href="javascript: void (0);" data-record-id={record.id}>
                                            {formatMessage({ id: 'btn.delete' })}
                                        </a>
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
                            key="cancel"
                            type="default"
                            onClick={() => this.closeModal('templateVisible')}
                        >
                            {formatMessage({ id: 'btn.cancel' })}
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.confirmBind}>
                            {formatMessage({ id: 'btn.confirm' })}
                        </Button>,
                    ]}
                >
                    <div className={styles['custom-modal-wrapper']}>
                        <Row>
                            <Col span={4}>{formatMessage({ id: 'esl.device.esl.id' })}:</Col>
                            <Col span={20}>{currentRecord.esl_code}</Col>
                            <Col span={4}>
                                {formatMessage({ id: 'esl.device.esl.product.seq.num' })}:
                            </Col>
                            <Col span={20}>{currentRecord.product_seq_num}</Col>
                            <Col span={4}>
                                {formatMessage({ id: 'esl.device.esl.product.name' })}:
                            </Col>
                            <Col span={20}>{currentRecord.product_name}</Col>
                            <Col span={4}>
                                {formatMessage({ id: 'esl.device.esl.template.name' })}:
                            </Col>
                            <Col span={20}>
                                <Select
                                    style={{ width: '100%' }}
                                    value={currentRecord.template_id}
                                    onChange={id => this.updateProduct(id)}
                                >
                                    {templates4ESL.map(template => (
                                        <Select.Option key={template.id} value={template.id}>
                                            {template.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>
                        </Row>
                    </div>
                </Modal>
                <BindModal
                    {...{
                        bindVisible,
                        currentRecord: {
                            ...currentRecord,
                            template_id: currentRecord.template_id || undefined,
                        },
                        templates4ESL,
                        products,
                        productPagination,
                        fetchProductList,
                        selectedProduct,
                        bindESL,
                        closeModal: this.closeModal,
                        selectProduct: this.selectProduct,
                        updateProduct: this.updateProduct,
                    }}
                />
            </div>
        );
    }
}

export default SearchResult;
