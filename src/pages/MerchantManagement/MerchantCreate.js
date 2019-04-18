import React, { Component } from 'react';

import { formatMessage } from 'umi/locale';
import { Form, Button, Input } from 'antd';
import { connect } from 'dva';
import styles from './Merchant.less';

@connect(
    state => ({
        merchant: state.merchant,
    }),
    dispatch => ({
        companyUpdate: payload => dispatch({ type: 'merchant/companyUpdate', payload }),
    })
)
class MerchantCreate extends Component {
    render() {
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
                        />
                    </Form.Item>
                    <Button type="primary" block style={{ height: 42 }}>
                        {formatMessage({ id: 'merchantManagement.merchant.createMerchant' })}
                    </Button>
                </Form>
                <p>{formatMessage({ id: 'merchantManagement.merchant.joinMerchant' })}</p>
            </div>
        );
    }
}

export default MerchantCreate;
