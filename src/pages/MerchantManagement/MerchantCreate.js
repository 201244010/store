import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Button, Input } from 'antd';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import router from 'umi/router';
import { MENU_PREFIX } from '@/constants';
import styles from './Merchant.less';
import { ERROR_OK } from '@/constants/errorCode';

@connect(
    state => ({
        merchant: state.merchant,
        store: state.store,
    }),
    dispatch => ({
        companyCreate: payload => dispatch({ type: 'merchant/companyCreate', payload }),
        getStoreList: payload => dispatch({ type: 'store/getStoreList', payload }),
    })
)
@Form.create()
class MerchantCreate extends Component {
    checkStoreExist = async () => {
        const { getStoreList } = this.props;
        const response = await getStoreList({});
        const result = response.data || {};
        const storeList = result.shop_list || [];
        if (storeList.length === 0) {
            Storage.remove('__shop_id__');
            router.push(`${MENU_PREFIX.STORE}/createStore`);
        } else {
            const defaultStore = storeList[0] || {};
            Storage.set({ __shop_id__: defaultStore.shop_id });
            router.push('/');
        }
    };

    createMerchant = () => {
        const {
            form: { validateFields, setFields },
            companyCreate,
        } = this.props;
        validateFields(async (err, values) => {
            if (!err) {
                const response = await companyCreate({ ...values });
                if (response && response.code !== ERROR_OK) {
                    setFields({
                        company_name: {
                            value: values.company_name || '',
                            errors: [
                                new Error(
                                    formatMessage({ id: 'merchantManagement.merchant.existed' })
                                ),
                            ],
                        },
                    });
                } else {
                    this.checkStoreExist();
                }
            }
        });
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <div className={styles['create-wrapper']}>
                <h2>{formatMessage({ id: 'merchantManagement.merchant.welcome' })}</h2>
                <Form>
                    <Form.Item>
                        {getFieldDecorator('company_name', {
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({
                                        id: 'merchantManagement.merchant.inputMerchant',
                                    }),
                                },
                            ],
                        })(
                            <Input
                                style={{ height: 42 }}
                                placeholder={formatMessage({
                                    id: 'merchantManagement.merchant.inputMerchant',
                                })}
                            />
                        )}
                    </Form.Item>
                    <Button
                        type="primary"
                        block
                        onClick={this.createMerchant}
                        style={{ height: 42 }}
                    >
                        {formatMessage({ id: 'merchantManagement.merchant.createMerchant' })}
                    </Button>
                </Form>
                <p>{formatMessage({ id: 'merchantManagement.merchant.joinMerchant' })}</p>
            </div>
        );
    }
}

export default MerchantCreate;
