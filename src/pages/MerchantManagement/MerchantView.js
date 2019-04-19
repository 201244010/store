import React, { Component } from 'react';
import { Form, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { unixSecondToDate } from '@/utils/utils';
import router from 'umi/router';
import { FORM_ITEM_LAYOUT_BUSINESS } from '@/constants/form';
import Storage from '@konata9/storage.js';
import styles from './Merchant.less';

@connect(
    state => ({
        merchant: state.merchant,
    }),
    dispatch => ({
        companyGetInfo: payload => dispatch({ type: 'merchant/companyGetInfo', payload }),
    })
)
class MerchantView extends Component {
    componentDidMount() {
        const { companyGetInfo } = this.props;
        const payload = {
            options: {
                company_id: Storage.get('__company_id__') || '56',
            },
        };
        companyGetInfo(payload);
    }

    update = () => {
        router.push('/basicData/merchantManagement/modify');
    };

    cancel = () => {};

    render() {
        const {
            merchant: {
                companyInfo: {
                    company_id: companyId,
                    contact_email: contactEmail,
                    contact_tel: contactTel,
                    company_name: companyName,
                    contact_person: contactPerson,
                    created_time: createTime,
                    modified_time: modifyTime,
                },
            },
        } = this.props;
        return (
            <div className={styles['view-wrapper']}>
                <h1>{formatMessage({ id: 'merchantManagement.merchant.view' })}</h1>
                <Form {...FORM_ITEM_LAYOUT_BUSINESS}>
                    <Form.Item label={formatMessage({ id: 'merchantManagement.merchant.number' })}>
                        <span>{companyId || '--'}</span>
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'merchantManagement.merchant.name' })}>
                        <span>{companyName || '--'}</span>
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({ id: 'merchantManagement.merchant.contactPerson' })}
                    >
                        <span>{contactPerson || '--'}</span>
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({ id: 'merchantManagement.merchant.contactPhone' })}
                    >
                        <span>{contactTel || '--'}</span>
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({ id: 'merchantManagement.merchant.contactEmail' })}
                    >
                        <span>{contactEmail || '--'}</span>
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({ id: 'merchantManagement.merchant.createTime' })}
                    >
                        <span>{unixSecondToDate(createTime) || '--'}</span>
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({ id: 'merchantManagement.merchant.updateTime' })}
                    >
                        <span>{unixSecondToDate(modifyTime) || '--'}</span>
                    </Form.Item>
                </Form>
                <div className={styles['button-style']}>
                    <Button type="primary" onClick={this.update}>
                        {formatMessage({ id: 'btn.alter' })}
                    </Button>
                    <Button style={{ marginLeft: 20 }} onClick={this.cancel}>
                        {formatMessage({ id: 'btn.back' })}
                    </Button>
                </div>
            </div>
        );
    }
}

export default MerchantView;
