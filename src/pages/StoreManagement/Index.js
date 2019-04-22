import React, { Component } from 'react';
import { Table, Form, Input, Select, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import router from 'umi/router';
// import { paramsDeserialization, paramsSerialization } from '@/utils/utils';
import storage from '@konata9/storage.js/src/storage';
import styles from './StoreManagement.less';

const columns = [
    {
        title: formatMessage({ id: 'storeManagement.list.columnId' }),
        dataIndex: 'shopId',
        key: 'shopId',
    },
    {
        title: formatMessage({ id: 'storeManagement.list.columnName' }),
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: formatMessage({ id: 'storeManagement.list.columnStatus' }),
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => <span>{record.status === '0' ? '营业' : '停业'}</span>,
    },
    {
        title: formatMessage({ id: 'storeManagement.list.columnAddress' }),
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: formatMessage({ id: 'storeManagement.list.columnTypes' }),
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: formatMessage({ id: 'storeManagement.list.columnContacts' }),
        dataIndex: 'contactPerson',
        key: 'contactPerson',
    },
    {
        title: formatMessage({ id: 'storeManagement.list.columnOperation' }),
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
            <span>
                <a
                    onClick={() => {
                        router.push(`storeInformation?shopId=${record.shopId}`);
                    }}
                    className={styles.infoAnchor}
                >
                    {formatMessage({ id: 'storeManagement.list.operation1' })}
                </a>
                <a
                    onClick={() => {
                        router.push(`alterStore?shopId=${record.shopId}`);
                    }}
                    className={styles.infoAnchor}
                >
                    {formatMessage({ id: 'storeManagement.list.operation2' })}
                </a>
            </span>
        ),
    },
];

@connect(
    state => ({
        list: state.store.getList,
    }),
    dispatch => ({
        getArray: payload => dispatch({ type: 'store/getArray', payload }),
    })
)
class StoreManagement extends Component {
    state = {
        currentPage: 1,
        pageSize: 100,
        optionArray: ['全部品类'],
        companyId: '',
    };

    componentDidMount() {
        this.initFetch();
    }

    initFetch = () => {
        const companyId = storage.get('__company_id__');
        this.setState({ companyId });
        const { getArray } = this.props;
        const payload = {
            options: {
                company_id: companyId,
                page_num: 1,
                page_size: 100,
            },
        };
        getArray(payload);
    };

    handleReset = () => {
        const {
            form: { resetFields },
        } = this.props;
        resetFields();
    };

    handleSubmit = e => {
        e.preventDefault();
        const { currentPage, pageSize, companyId } = this.state;
        const {
            form: { getFieldsValue },
            getArray,
        } = this.props;
        const formValue = getFieldsValue();
        const payload = {
            options: {
                company_id: companyId,
                page_num: currentPage,
                page_size: pageSize,
            },
        };
        const { options } = payload;
        if (formValue.types === '全部品类' || formValue.types === '') {
            // 不对种类进行筛选
        } else {
            options.type_one = formValue.types;
        }

        if (formValue.storeName !== '') {
            options.keyword = formValue.storeName;
        }

        getArray(payload);
    };

    render() {
        const { form, list } = this.props;
        const { optionArray } = this.state;
        const { getFieldDecorator } = form;
        const FormItem = Form.Item;
        const { Option } = Select;

        return (
            <div className={styles.storeList}>
                <div className={styles.top}>
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem label={formatMessage({ id: 'storeManagement.list.inputLabel' })}>
                            {getFieldDecorator('storeName', {
                                initialValue: '',
                            })(
                                <Input
                                    placeholder={formatMessage({
                                        id: 'storeManagement.list.inputPlaceHolder',
                                    })}
                                    style={{ width: '220px' }}
                                />
                            )}
                        </FormItem>
                        <FormItem label={formatMessage({ id: 'storeManagement.list.selectLabel' })}>
                            {getFieldDecorator('types', {
                                initialValue: '全部品类',
                            })(
                                <Select
                                    placeholder={formatMessage({
                                        id: 'storeManagement.list.selectPlaceHolder',
                                    })}
                                    style={{ width: '220px' }}
                                >
                                    {optionArray.map(value => (
                                        <Option value={value} key={value}>
                                            {value}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button htmlType="submit">
                                {formatMessage({ id: 'storeManagement.list.buttonSubmit' })}
                            </Button>
                        </FormItem>
                        <a onClick={this.handleReset}>
                            {formatMessage({ id: 'storeManagement.list.buttonReset' })}
                        </a>
                    </Form>
                </div>
                <a
                    onClick={() => {
                        router.push('/storeManagement/createStore');
                    }}
                    className={styles.link}
                >
                    {formatMessage({ id: 'storeManagement.list.newBuiltStore' })}
                </a>
                <div className={styles.table}>
                    <Table dataSource={list.data} columns={columns} pagination={false} />
                </div>
                {/* <Pagination */}
                {/* showSizeChanger */}
                {/* showQuickJumper */}
                {/* onChange={ */}
                {/* a => {this.setState({ currentPage: a }); */}
                {/* }} */}
                {/* onShowSizeChange={ */}
                {/* (a, b) => {this.setState({ currentPage: a, pageSize: b }); */}
                {/* }} */}
                {/* /> */}
                {/* <p className={styles.pageText} onClick={()=>{console.log(list)}}> */}
                {/* 共{totalData}条记录 第{currentPage}/ */}
                {/* { */}
                {/* totalData % pageSize === 0 */}
                {/* ? totalData / pageSize */}
                {/* : parseInt(totalData / pageSize + 1, 10) */}
                {/* } */}
                {/* 页 */}
                {/* </p> */}
            </div>
        );
    }
}

const StoreManagementForm = Form.create({
    mapPropsToFields: () => ({
        storeName: Form.createFormField(''),
        types: Form.createFormField(''),
    }),
})(StoreManagement);
export default StoreManagementForm;
