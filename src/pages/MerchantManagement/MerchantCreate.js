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
        companyCreate: payload => dispatch({ type: 'merchant/companyCreate', payload }),
    })
)
class MerchantCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }

    createMerchant = async () => {
        const { companyCreate } = this.props;
        const { value } = this.state;
        companyCreate({ company_name: value });
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
