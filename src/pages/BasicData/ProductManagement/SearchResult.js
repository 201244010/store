import React, { Component } from 'react';
import { Divider, Modal, Table, Button } from 'antd';
import { CustomSkeleton } from '@/components/Skeleton';
import { idEncode, unixSecondToDate } from '@/utils/utils';
import router from 'umi/router';
import * as CookieUtil from '@/utils/cookies';
import { formatMessage } from 'umi/locale';
import { MENU_PREFIX } from '@/constants';
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
        CookieUtil.setCookieByKey(CookieUtil.GOODS_PAGE_SIZE_KEY, pagination.pageSize);
        fetchProductList({
            options: {
                pageSize: pagination.pageSize,
                current: pagination.current,
            },
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
            productDetail: `${MENU_PREFIX.PRODUCT}/productInfo?id=${encodeID}&from=list`,
            createProduct: `${MENU_PREFIX.PRODUCT}/productCreate?action=create&from=list`,
            update: `${MENU_PREFIX.PRODUCT}/productUpdate?action=edit&id=${encodeID}&from=list`,
            erpImport: `${MENU_PREFIX.PRODUCT}/erpImport`,
        };

        router.push(urlMap[name]);
    };

    deleteProducts = () => {
        const { selectedRowKeys } = this.state;
        const { deleteProduct } = this.props;

        Modal.confirm({
            icon: 'info-circle',
            title: formatMessage({ id: 'basicData.product.delete.confirm' }),
            content: formatMessage({ id: 'basicData.product.delete.notice' }),
            okText: formatMessage({ id: 'btn.delete' }),
            cancelText: formatMessage({ id: 'btn.cancel' }),
            onOk() {
                deleteProduct({
                    options: {
                        product_id_list: selectedRowKeys,
                    },
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
                render: text => <span>{parseInt(text,10) < 0? '' :  parseFloat(text).toFixed(2)}</span>,
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
                            {formatMessage({ id: 'list.action.alter' })}
                        </a>
                    </span>
                ),
            },
        ];

        const { selectedRowKeys } = this.state;
        const {
            loading,
            data,
            pagination,
            saasBindInfo: { isBind },
        } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div>
                <div className={styles['table-header']}>
                    {loading ? (
                        <CustomSkeleton />
                    ) : (
                        <>
                            {!isBind && (
                                <Button
                                    className={styles['function-btn']}
                                    type="primary"
                                    onClick={() => this.toPath('createProduct')}
                                >
                                    {formatMessage({ id: 'btn.create' })}
                                </Button>
                            )}

                            {/* <Button className={styles['function-btn']}> */}
                            {/* {formatMessage({ id: 'btn.import' })} */}
                            {/* </Button> */}
                            <Button
                                className={styles['function-btn']}
                                onClick={() => this.toPath('erpImport')}
                            >
                                {formatMessage({ id: 'btn.erp.import' })}
                            </Button>
                            {/* <Button */}
                            {/* className={styles['function-btn']} */}
                            {/* disabled={selectedRowKeys.length <= 0} */}
                            {/* > */}
                            {/* {formatMessage({ id: 'btn.multi.edit' })} */}
                            {/* </Button> */}
                            {!isBind && (
                                <Button
                                    className={styles['function-btn']}
                                    disabled={selectedRowKeys.length <= 0}
                                    onClick={this.deleteProducts}
                                >
                                    {formatMessage({ id: 'btn.delete' })}
                                </Button>
                            )}
                        </>
                    )}
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
