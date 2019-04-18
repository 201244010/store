import React, { Component } from 'react';

import { formatMessage } from 'umi/locale';
import { Form, Button, Input } from 'antd';
import { connect } from 'dva';
import styles from './Business.less';

@connect(
    state => ({
        business: state.business,
    }),
    dispatch => ({
        companyUpdate: payload => dispatch({ type: 'business/companyUpdate', payload }),
    })
)
class BusinessCreate extends Component {
    render() {
        return (
            <div className={styles['create-wrapper']}>
                <h2>{formatMessage({ id: 'businessManagement.business.welcome' })}</h2>
                <Form>
                    <Form.Item>
                        <Input
                            style={{ height: 42 }}
                            placeholder={formatMessage({
                                id: 'businessManagement.business.inputBusiness',
                            })}
                        />
                    </Form.Item>
                    <Button type="primary" block style={{ height: 42 }}>
                        {formatMessage({ id: 'businessManagement.business.createBusiness' })}
                    </Button>
                </Form>
                <p>{formatMessage({ id: 'businessManagement.business.joinBusiness' })}</p>
            </div>
        );
    }
}

export default BusinessCreate;
