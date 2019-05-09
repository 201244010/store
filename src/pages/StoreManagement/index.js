import React, { Component } from 'react';
import { Table, Form, Input, Button, Row, Col, Cascader, Divider } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import router from 'umi/router';
import Storage from '@konata9/storage.js';
import { FORM_FORMAT, FORM_ITEM_LAYOUT } from '@/constants/form';
import { MENU_PREFIX } from '@/constants';
import styles from './StoreManagement.less';
import { formatEmptyWithoutZero } from '@/utils/utils';

const FormItem = Form.Item;

const columns = [
    {
        title: formatMessage({ id: 'storeManagement.list.columnId' }),
        dataIndex: 'shop_id',
        key: 'shop_id',
    },
    {
        title: formatMessage({ id: 'storeManagement.list.columnName' }),
        dataIndex: 'shop_name',
        key: 'shop_name',
    },
    {
        title: formatMessage({ id: 'storeManagement.list.columnStatus' }),
        dataIndex: 'business_status',
        key: 'business_status',
        render: text => (
            <span>
                {text === 0
                    ? formatMessage({ id: 'storeManagement.create.status.open' })
                    : formatMessage({ id: 'storeManagement.create.status.closed' })}
            </span>
        ),
    },
    {
        title: formatMessage({ id: 'storeManagement.list.columnAddress' }),
        dataIndex: 'address',
        key: 'address',
        render: (text, record) => (
            <>
                {
                    (text === '--' && record.region === '--')
                        ? (<span>--</span>)
                        : (
                            <>
                                <span>{record.region !== '--' ? record.region.split(',').join(' ') : ''} </span>
                                <span>{text !== '--' ? text : ''}</span>
                            </>
                        )
                }
            </>
        ),
    },
    {
        title: formatMessage({ id: 'storeManagement.list.columnTypes' }),
        dataIndex: 'type_name',
        key: 'type_name',
    },
    {
        title: formatMessage({ id: 'storeManagement.list.columnContacts' }),
        dataIndex: 'contact_person',
        key: 'contact_person',
    },
    {
        title: formatMessage({ id: 'storeManagement.list.columnOperation' }),
        dataIndex: 'operation',
        key: 'operation',
        width: 120,
        render: (text, record) => (
            <span>
                <a
                    onClick={() => {
                        router.push(
                            `${MENU_PREFIX.STORE}/storeInformation?shopId=${record.shop_id}`,
                        );
                    }}
                    className={styles.infoAnchor}
                >
                    {formatMessage({ id: 'storeManagement.list.operation1' })}
                </a>
                <Divider type="vertical" />
                <a
                    onClick={() => {
                        router.push(
                            `${MENU_PREFIX.STORE}/alterStore?shopId=${record.shop_id}&action=edit`,
                        );
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
        store: state.store,
    }),
    dispatch => ({
        changeSearchFormValue: payload =>
            dispatch({ type: 'store/changeSearchFormValue', payload }),
        clearSearch: () => dispatch({ type: 'store/clearSearch' }),
        getStoreList: payload => dispatch({ type: 'store/getStoreList', payload }),
        getShopTypeList: () => dispatch({ type: 'store/getShopTypeList' }),
        getRegionList: () => dispatch({ type: 'store/getRegionList' }),
    }),
)
class StoreManagement extends Component {
    componentDidMount() {
        const { getShopTypeList, getRegionList, getStoreList, clearSearch } = this.props;
        if (!Storage.get('__shopTypeList__', 'local')) {
            getShopTypeList();
        }

        if (!Storage.get('__regionList__', 'local')) {
            getRegionList();
        }
        clearSearch();
        getStoreList({});
    }

    componentWillUnmount() {
        const { clearSearch } = this.props;
        clearSearch();
    }

    handleReset = async () => {
        const { form, clearSearch, getStoreList } = this.props;
        if (form) {
            form.resetFields();
        }
        await clearSearch();
        await getStoreList({
            options: {
                current: 1,
            },
        });
    };

    handleSubmit = () => {
        const {
            form: { validateFields },
            changeSearchFormValue,
            getStoreList,
        } = this.props;

        validateFields(async (err, values) => {
            if (!err) {
                await changeSearchFormValue({
                    options: {
                        keyword: values.keyword,
                        type_one: (values.shopType || [])[0] || 0,
                        type_two: (values.shopType || [])[1] || 0,
                    },
                });
                await getStoreList({
                    options: {
                        type: 'search',
                    },
                });
            }
        });
    };

    render() {
        const {
            form: { getFieldDecorator },
            store: {
                storeList,
                shopType_list,
                searchFormValue: { keyword, type_one, type_two },
                loading,
            },
        } = this.props;

        const formattedList = storeList.map(store => formatEmptyWithoutZero(store, '--'));

        return (
            <div className={styles.storeList}>
                <div className={styles.top}>
                    <Form {...FORM_ITEM_LAYOUT}>
                        <Row gutter={FORM_FORMAT.gutter}>
                            <Col xl={9} lg={12} md={24}>
                                <FormItem
                                    label={formatMessage({ id: 'storeManagement.list.inputLabel' })}
                                >
                                    {getFieldDecorator('keyword', {
                                        initialValue: keyword,
                                    })(
                                        <Input
                                            placeholder={formatMessage({
                                                id: 'storeManagement.list.inputPlaceHolder',
                                            })}
                                        />,
                                    )}
                                </FormItem>
                            </Col>
                            <Col xl={9} lg={12} md={24}>
                                <FormItem
                                    label={formatMessage({
                                        id: 'storeManagement.list.selectLabel',
                                    })}
                                >
                                    {getFieldDecorator('shopType', {
                                        initialValue: type_one ? [type_one, type_two] : undefined,
                                    })(
                                        <Cascader
                                            placeholder={formatMessage({
                                                id: 'storeManagement.create.typePlaceHolder',
                                            })}
                                            options={shopType_list}
                                        />,
                                    )}
                                </FormItem>
                            </Col>
                            <Col xl={6} lg={12} md={24}>
                                <Button onClick={this.handleSubmit}>
                                    {formatMessage({ id: 'storeManagement.list.buttonSubmit' })}
                                </Button>
                                <a
                                    href="javascript:void(0)"
                                    style={{ marginLeft: '20px' }}
                                    onClick={this.handleReset}
                                >
                                    {formatMessage({ id: 'storeManagement.list.buttonReset' })}
                                </a>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <Button
                    loading={loading}
                    type="primary"
                    icon="plus"
                    onClick={() => {
                        router.push(`${MENU_PREFIX.STORE}/createStore?action=create`);
                    }}
                >
                    {formatMessage({ id: 'storeManagement.list.newBuiltStore' })}
                </Button>
                <div className={styles.table}>
                    <Table rowKey="shop_id" dataSource={formattedList} columns={columns} />
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
