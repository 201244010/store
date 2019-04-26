import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';
import { formatMessage } from 'umi/locale';
import { FORM_ITEM_LAYOUT_BUSINESS } from '@/constants/form';
import router from 'umi/router';
import { customValidate } from '@/utils/customValidate';
import * as CookieUtil from '@/utils/cookies';
import { connect } from 'dva';
import styles from './Merchant.less';
import { MENU_PREFIX } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';

@connect(
    state => ({
        merchant: state.merchant,
    }),
    dispatch => ({
        companyGetInfo: () => dispatch({ type: 'merchant/companyGetInfo' }),
        companyUpdate: payload => dispatch({ type: 'merchant/companyUpdate', payload }),
    })
)
@Form.create()
class MerchantModify extends Component {
    componentDidMount() {
        const { companyGetInfo } = this.props;
        companyGetInfo();
    }

    saveInfo = () => {
        const {
            form: { validateFields, setFields },
            companyUpdate,
        } = this.props;
        validateFields(async (err, values) => {
            if (!err) {
                const payload = {
                    options: {
                        company_id: CookieUtil.getCookieByKey(CookieUtil.COMPANY_ID_KEY),
                        company_name: values.companyName,
                        contact_person: values.contactPerson,
                        contact_tel: values.contactTel,
                        contact_email: values.contactEmail,
                    },
                };
                const response = await companyUpdate(payload);
                if (response && response.code !== ERROR_OK) {
                    setFields({
                        companyName: {
                            value: values.companyName,
                            errors: [
                                new Error(
                                    formatMessage({
                                        id: 'merchantManagement.merchant.existed.error',
                                    })
                                ),
                            ],
                        },
                    });
                }
            }
        });
    };

    cancel = () => {
        router.push(`${MENU_PREFIX.MERCHANT}/view`);
    };

    render() {
        const {
            form: { getFieldDecorator },
            merchant: {
                loading,
                companyInfo: {
                    company_id,
                    company_name,
                    contact_person,
                    contact_tel,
                    contact_email,
                },
            },
        } = this.props;
        return (
            <div className={styles['view-wrapper']}>
                <h1>{formatMessage({ id: 'merchantManagement.merchant.modify' })}</h1>
                <div className={styles['form-content']}>
                    <Form {...FORM_ITEM_LAYOUT_BUSINESS}>
                        <Form.Item
                            label={formatMessage({ id: 'merchantManagement.merchant.number' })}
                        >
                            <span>{company_id || '--'}</span>
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({ id: 'merchantManagement.merchant.name' })}
                        >
                            {getFieldDecorator('companyName', {
                                initialValue: company_name,
                                validateTrigger: 'onBlur',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({
                                            id: 'merchantManagement.merchant.inputMerchant',
                                        }),
                                    },
                                ],
                            })(<Input maxLength={40} />)}
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({
                                id: 'merchantManagement.merchant.contactPerson',
                            })}
                        >
                            {getFieldDecorator('contactPerson', {
                                initialValue: contact_person,
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({
                                id: 'merchantManagement.merchant.contactPhone',
                            })}
                        >
                            {getFieldDecorator('contactTel', {
                                initialValue: contact_tel,
                                validateTrigger: 'onBlur',
                                rules: [
                                    {
                                        validator: (rule, value, callback) =>
                                            customValidate({
                                                field: 'telephone',
                                                rule,
                                                value,
                                                callback,
                                            }),
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({
                                id: 'merchantManagement.merchant.contactEmail',
                            })}
                        >
                            {getFieldDecorator('contactEmail', {
                                initialValue: contact_email,
                                validateTrigger: 'onBlur',
                                rules: [
                                    {
                                        type: 'email',
                                        message: formatMessage({ id: 'mail.validate.isFormatted' }),
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label=" " colon={false}>
                            <Button type="primary" loading={loading} onClick={this.saveInfo}>
                                {formatMessage({ id: 'btn.save' })}
                            </Button>
                            <Button style={{ marginLeft: 20 }} onClick={this.cancel}>
                                {formatMessage({ id: 'btn.cancel' })}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}

export default MerchantModify;
