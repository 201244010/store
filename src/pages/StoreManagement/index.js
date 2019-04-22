import React, { Component } from 'react';
import { Table, Form, Input, Select, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import router from 'umi/router';
import storage from '@konata9/storage.js/src/storage';
import styles from './StoreManagement.less';

const FormItem = Form.Item;
const { Option } = Select;

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
        render: (text, record) => (
            <span>
                {record.status === 0
                    ? formatMessage({ id: 'storeManagement.create.statusValue1' })
                    : formatMessage({ id: 'storeManagement.create.statusValue2' })}
            </span>
        ),
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
        optionArray: [formatMessage({ id: 'storeManagement.info.fullTypes' })],
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
        if (
            formValue.types === formatMessage({ id: 'storeManagement.info.fullTypes' }) ||
            formValue.types === ''
        ) {
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
        const { form: { getFieldDecorator }, list } = this.props;
        const { optionArray } = this.state;

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
                                initialValue: formatMessage({
                                    id: 'storeManagement.info.fullTypes',
                                }),
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
                <Button
                    type="primary"
                    icon="plus"
                    onClick={() => { router.push('/basicData/storeManagement/createStore');}}
                >
                    {formatMessage({ id: 'storeManagement.list.newBuiltStore' })}
                </Button>
                <div className={styles.table}>
                    <Table rowKey="shopId" dataSource={list.data} columns={columns} />
                </div>
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
