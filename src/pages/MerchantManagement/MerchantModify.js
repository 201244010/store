import React, { Component } from 'react';

import { Form, Button, Input } from 'antd';

import { formatMessage } from 'umi/locale';
import { FORM_ITEM_LAYOUT_BUSINESS } from '@/constants/form';
import router from 'umi/router';
import { customValidate } from '@/utils/customValidate';
import Storage from '@konata9/storage.js';

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
@Form.create()
class MerchantModify extends Component {
    constructor(props) {
        super(props);
        const {
            merchant: {
                companyInfo: { company_name: companyName, contact_person: contactPerson },
            },
        } = this.props;
        this.state = {
            contactPerson,
            companyName,
        };
    }

    componentDidMount() {
        const {
            form: { setFieldsValue },
            merchant: {
                companyInfo: { contact_email: contactEmail, contact_tel: contactTel },
            },
        } = this.props;
        setFieldsValue({
            email: contactEmail,
            phone: contactTel,
        });
    }

    onChange = (e, key) => {
        this.setState({
            [key]: e.target.value,
        });
    };

    saveInfo = () => {
        const {
            form: { validateFields },
            companyUpdate,
        } = this.props;
        const { companyName, contactPerson } = this.state;
        validateFields((err, values) => {
            if (!err) {
                const payload = {
                    options: {
                        company_id: Storage.get('__company_id__') || '56',
                        company_name: companyName,
                        contact_person: contactPerson,
                        contact_tel: values.phone,
                        contact_email: values.email,
                    },
                };
                companyUpdate(payload);
            }
        });
    };

    cancel = () => {
        router.push('/basicData/merchantManagement/view');
    };

    render() {
        const { companyName, contactPerson } = this.state;
        console.log(this.props);
        const {
            form: { getFieldDecorator },
            merchant: {
                companyInfo: { company_id: companyId },
            },
        } = this.props;
        return (
            <div className={styles['view-wrapper']}>
                <h1>{formatMessage({ id: 'merchantManagement.merchant.modify' })}</h1>
                <Form {...FORM_ITEM_LAYOUT_BUSINESS}>
                    <Form.Item label={formatMessage({ id: 'merchantManagement.merchant.number' })}>
                        <span>{companyId || '--'}</span>
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'merchantManagement.merchant.name' })}>
                        <Input
                            value={companyName}
                            onChange={e => this.onChange(e, 'companyName')}
                        />
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({ id: 'merchantManagement.merchant.contactPerson' })}
                    >
                        <Input
                            value={contactPerson}
                            onChange={e => this.onChange(e, 'contactPerson')}
                        />
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({ id: 'merchantManagement.merchant.contactPhone' })}
                    >
                        {getFieldDecorator('phone', {
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    validator: (rule, value, callback) =>
                                        customValidate({
                                            field: 'telphone',
                                            rule,
                                            value,
                                            callback,
                                        }),
                                },
                            ],
                        })(<Input />)}
                        {/* <Input value={contactTel} onChange={e => this.onChange(e, 'contactTel')} /> */}
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({ id: 'merchantManagement.merchant.contactEmail' })}
                    >
                        {getFieldDecorator('email', {
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    type: 'email',
                                    message: formatMessage({ id: 'mail.validate.isFormatted' }),
                                },
                            ],
                        })(<Input />)}
                    </Form.Item>
                </Form>
                <div className={styles['button-style']}>
                    <Button type="primary" onClick={this.saveInfo}>
                        {formatMessage({ id: 'btn.save' })}
                    </Button>
                    <Button style={{ marginLeft: 20 }} onClick={this.cancel}>
                        {formatMessage({ id: 'btn.cancel' })}
                    </Button>
                </div>
            </div>
        );
    }
}

export default MerchantModify;
