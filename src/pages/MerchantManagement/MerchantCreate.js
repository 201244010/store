import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Button, Input } from 'antd';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import router from 'umi/router';
import { MENU_PREFIX } from '@/constants';
import styles from './Merchant.less';

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
class MerchantCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }

    checkStoreExist = async () => {
        const {
            getStoreList,
            store: { storeList },
        } = this.props;
        await getStoreList({});
        if (storeList.length === 0) {
            router.push(`${MENU_PREFIX.STORE}/createStore`);
        } else {
            const defaultStore = storeList[0] || {};
            Storage.set({ __shop_id__: defaultStore.shop_id });
            router.push('/');
        }
    };

    createMerchant = async () => {
        const { companyCreate } = this.props;
        const { value } = this.state;
        await companyCreate({ company_name: value });
        this.checkStoreExist();
    };

    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    render() {
        const { value } = this.state;
        return (
            <div className={styles['create-wrapper']}>
                <h2>{formatMessage({ id: 'merchantManagement.merchant.welcome' })}</h2>
                <Form>
                    <Form.Item>
                        <Input
                            style={{ height: 42 }}
                            placeholder={formatMessage({
                                id: 'merchantManagement.merchant.inputMerchant',
                            })}
                            value={value}
                            onChange={this.onChange}
                        />
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
