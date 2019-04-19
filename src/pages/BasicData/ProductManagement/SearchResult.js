import React, { Component } from 'react';
import { Divider, Modal, Table, Button } from 'antd';
import { idEncode, unixSecondToDate } from '@/utils/utils';
import router from 'umi/router';
import Storage from '@konata9/storage.js';
import { formatMessage } from 'umi/locale';
import * as styles from './ProductManagement.less';

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
        };
    }

    onTableChange = pagination => {
        const { fetchProductList } = this.props;
        Storage.set('goodsPageSize', pagination.pageSize);
        fetchProductList({
            pageSize: pagination.pageSize,
            current: pagination.current,
        });
    };

    onSelectChange = selectedRowKeys => {
        this.setState({
            selectedRowKeys,
        });
    };

    toPath = (name, record = {}) => {
        const encodeID = record.id ? idEncode(record.id) : null;
        const urlMap = {
            productDetail: `/basicData/productManagement/list/productInfo?id=${encodeID}&from=list`,
            createProduct:
                '/basicData/productManagement/list/productCreate?action=create&from=list',
            update: `/basicData/productManagement/list/productUpdate?action=edit&id=${encodeID}&from=list`,
            erpImport: `/basicData/productManagement/list/erpImport`,
        };

        router.push(urlMap[name]);
    };

    deleteGoods = record => {
        const { deleteProduct } = this.props;

        Modal.confirm({
            icon: 'info-circle',
            title: formatMessage({ id: 'basicData.product.delete.confirm' }),
            content: formatMessage({ id: 'basicData.product.delete.notice' }),
            okText: formatMessage({ id: 'btn.delete' }),
            onOk() {
                deleteProduct({
                    id: record.id,
                });
            },
        });
    };

    render() {
        const columns = [
            {
                title: formatMessage({ id: 'basicData.product.seq_num' }),
                dataIndex: 'seq_num',
            },
            {
                title: formatMessage({ id: 'basicData.product.name' }),
                dataIndex: 'name',
            },
            {
                title: formatMessage({ id: 'basicData.product.bar_code' }),
                dataIndex: 'bar_code',
            },
            {
                title: formatMessage({ id: 'basicData.product.price' }),
                dataIndex: 'price',
            },
            {
                title: formatMessage({ id: 'basicData.product.modified_time' }),
                dataIndex: 'modified_time',
                render: text => <span>{unixSecondToDate(text)}</span>,
            },
            {
                title: formatMessage({ id: 'list.action.title' }),
                key: 'action',
                render: (_, record) => (
                    <span>
                        <a
                            href="javascript: void (0);"
                            onClick={() => this.toPath('productDetail', record)}
                        >
                            {formatMessage({ id: 'list.action.detail' })}
                        </a>
                        <Divider type="vertical" />
                        <a
                            href="javascript: void (0);"
                            onClick={() => this.toPath('update', record)}
                        >
                            {formatMessage({ id: 'list.action.edit' })}
                        </a>
                    </span>
                ),
            },
        ];

        const { selectedRowKeys } = this.state;
        const { loading, data, pagination } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div>
                <div className={styles['table-header']}>
                    <Button
                        className={styles['function-btn']}
                        type="primary"
                        onClick={() => this.toPath('createProduct')}
                    >
                        {formatMessage({ id: 'btn.create' })}
                    </Button>
                    <Button className={styles['function-btn']}>
                        {formatMessage({ id: 'btn.import' })}
                    </Button>
                    <Button
                        className={styles['function-btn']}
                        onClick={() => this.toPath('erpImport')}
                    >
                        {formatMessage({ id: 'btn.erp.import' })}
                    </Button>
                    <Button
                        className={styles['function-btn']}
                        disabled={selectedRowKeys.length <= 0}
                    >
                        {formatMessage({ id: 'btn.multi.edit' })}
                    </Button>
                    <Button
                        className={styles['function-btn']}
                        disabled={selectedRowKeys.length <= 0}
                    >
                        {formatMessage({ id: 'btn.delete' })}
                    </Button>
                </div>
                <div className="table-content">
                    <Table
                        rowKey="id"
                        loading={loading}
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={data}
                        pagination={{
                            ...pagination,
                            showTotal: total =>
                                selectedRowKeys.length === 0
                                    ? `${formatMessage({
                                          id: 'pagination.total.prefix',
                                      })}${total}${formatMessage({
                                          id: 'basicData.product.total',
                                      })}`
                                    : `${formatMessage({
                                          id: 'pagination.total.prefix',
                                      })}${total}${formatMessage({
                                          id: 'basicData.product.total',
                                      })}${formatMessage({ id: 'basicData.product.selected' })}${
                                          selectedRowKeys.length
                                      }${formatMessage({
                                          id: 'basicData.product.pagination.unit',
                                      })}`,
                        }}
                        onChange={this.onTableChange}
                    />
                </div>
            </div>
        );
    }
}

export default SearchResult;
