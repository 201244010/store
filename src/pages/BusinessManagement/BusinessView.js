import React, { Component } from 'react';
import { Form, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { unixSecondToDate } from '@/utils/utils';
import router from 'umi/router';
import { FORM_ITEM_LAYOUT_BUSINESS } from '@/constants/form';
import styles from './Business.less';

@connect(
    state => ({
        business: state.business,
    }),
    dispatch => ({
        companyUpdate: payload => dispatch({ type: 'business/companyUpdate', payload }),
    })
)
class BusinessView extends Component {
    update = () => {
        router.push('/businessManagement/modify');
    };

    cancel = () => {};

    render() {
        const {
            business: {
                companyList: {
                    company_no: companyNo,
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
                <h1>{formatMessage({ id: 'businessManagement.business.view' })}</h1>
                <Form {...FORM_ITEM_LAYOUT_BUSINESS}>
                    <Form.Item label={formatMessage({ id: 'businessManagement.business.number' })}>
                        <span>{companyNo}</span>
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'businessManagement.business.name' })}>
                        <span>{companyName}</span>
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({ id: 'businessManagement.business.contactPerson' })}
                    >
                        <span>{contactPerson}</span>
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({ id: 'businessManagement.business.contactPhone' })}
                    >
                        <span>{contactTel}</span>
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({ id: 'businessManagement.business.contactEmail' })}
                    >
                        <span>{contactEmail}</span>
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({ id: 'businessManagement.business.createTime' })}
                    >
                        <span>{unixSecondToDate(createTime)}</span>
                    </Form.Item>
                    <Form.Item
                        label={formatMessage({ id: 'businessManagement.business.updateTime' })}
                    >
                        <span>{unixSecondToDate(modifyTime)}</span>
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

export default BusinessView;
