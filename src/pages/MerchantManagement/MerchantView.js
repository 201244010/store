import React, { Component } from 'react';
import { Form, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { unixSecondToDate } from '@/utils/utils';
import router from 'umi/router';
import { FORM_ITEM_LAYOUT_BUSINESS } from '@/constants/form';
import { MENU_PREFIX } from '@/constants';
import styles from './Merchant.less';

@connect(
    state => ({
        merchant: state.merchant,
    }),
    dispatch => ({
        companyGetInfo: () => dispatch({ type: 'merchant/companyGetInfo' }),
    })
)
class MerchantView extends Component {
    componentDidMount() {
        const { companyGetInfo } = this.props;
        companyGetInfo();
    }

    goNext = target => {
        const path = {
            update: `${MENU_PREFIX.MERCHANT}/modify`,
            cancel: '/account/center',
        };
        router.push(path[target] || '/');
    };

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
                <div className={styles['form-content']}>
                    <Form {...FORM_ITEM_LAYOUT_BUSINESS}>
                        <Form.Item
                            className={styles['clear-margin']}
                            label={formatMessage({ id: 'merchantManagement.merchant.number' })}
                        >
                            <span>{companyId || '--'}</span>
                        </Form.Item>
                        <Form.Item
                            className={styles['clear-margin']}
                            label={formatMessage({ id: 'merchantManagement.merchant.name' })}
                        >
                            <span>{companyName || '--'}</span>
                        </Form.Item>
                        <Form.Item
                            className={styles['clear-margin']}
                            label={formatMessage({
                                id: 'merchantManagement.merchant.contactPerson',
                            })}
                        >
                            <span>{contactPerson || '--'}</span>
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({
                                id: 'merchantManagement.merchant.contactPhone',
                            })}
                        >
                            <span>{contactTel || '--'}</span>
                        </Form.Item>
                        <Form.Item
                            className={styles['clear-margin']}
                            label={formatMessage({
                                id: 'merchantManagement.merchant.contactEmail',
                            })}
                        >
                            <span>{contactEmail || '--'}</span>
                        </Form.Item>
                        <Form.Item
                            className={styles['clear-margin']}
                            label={formatMessage({ id: 'merchantManagement.merchant.createTime' })}
                        >
                            <span>{unixSecondToDate(createTime) || '--'}</span>
                        </Form.Item>
                        <Form.Item
                            className={styles['clear-margin']}
                            label={formatMessage({ id: 'merchantManagement.merchant.updateTime' })}
                        >
                            <span>{unixSecondToDate(modifyTime) || '--'}</span>
                        </Form.Item>
                        <Form.Item className={styles['clear-margin']} label=" " colon={false}>
                            <Button type="primary" onClick={() => this.goNext('update')}>
                                {formatMessage({ id: 'btn.alter' })}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}

export default MerchantView;
