import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Card, List, Icon, Button, Modal, Form } from 'antd';
import router from 'umi/router';
import Storage from '@konata9/storage.js';
import { FORM_ITEM_LAYOUT_COMMON } from '@/constants/form';
import { connect } from 'dva';

import * as styles from './Account.less';

@connect(state => ({
    merchant: state.merchant,
}))
class Store extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCompany: {},
            visible: false,
        };
    }

    viewStore = company => {
        this.setState({
            selectedCompany: company,
            visible: true,
        });
    };

    toPath = target => {
        const path = {
            update: '/basicData/merchantManagement/modify',
            create: '/merchant/create',
        };

        router.push(path[target] || '/');
    };

    cancel = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const {
            merchant: { companyList = [] },
        } = this.props;
        const {
            visible,
            selectedCompany: {
                company_id: companyId,
                contact_email: contactEmail,
                contact_tel: contactTel,
                company_name: companyName,
                contact_person: contactPerson,
            },
        } = this.state;

        return (
            <Card style={{ marginTop: '15px' }}>
                <h2>{formatMessage({ id: 'userCenter.store.title' })}</h2>
                <List className={styles['list-wrapper']}>
                    {companyList.map(company => (
                        <List.Item key={company.company_id}>
                            <div className={styles['list-item']}>
                                <div className={styles['title-wrapper-start']}>
                                    <div className={styles['title-wrapper-icon']}>
                                        <h4>{formatMessage({ id: 'userCenter.store.name' })}</h4>
                                        <Icon type="property-safety" />
                                    </div>
                                    <div
                                        onClick={() => this.viewStore(company)}
                                        className={styles['button-more']}
                                    >
                                        {formatMessage({ id: 'list.action.detail' })}
                                    </div>
                                </div>
                                <div>{company.company_name}</div>
                            </div>
                        </List.Item>
                    ))}
                </List>
                <div>
                    <Button type="dashed" icon="plus" block onClick={() => this.toPath('create')}>
                        {formatMessage({ id: 'userCenter.store.create' })}
                    </Button>
                </div>
                <Modal
                    visible={visible}
                    title={formatMessage({ id: 'merchantManagement.merchant.merchantMessage' })}
                    onCancel={this.cancel}
                    footer={
                        <div className={styles['button-style']}>
                            <Button style={{ marginLeft: 20 }} onClick={this.cancel}>
                                {formatMessage({ id: 'btn.back' })}
                            </Button>
                            {companyId === Storage.get('__company_id__') && (
                                <Button type="primary" onClick={() => this.toPath('update')}>
                                    {formatMessage({ id: 'btn.alter' })}
                                </Button>
                            )}
                        </div>
                    }
                >
                    <Form {...FORM_ITEM_LAYOUT_COMMON}>
                        <Form.Item
                            label={formatMessage({ id: 'merchantManagement.merchant.number' })}
                        >
                            <span>{companyId}</span>
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({ id: 'merchantManagement.merchant.name' })}
                        >
                            <span>{companyName}</span>
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({
                                id: 'merchantManagement.merchant.contactPerson',
                            })}
                        >
                            <span>{contactPerson}</span>
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({
                                id: 'merchantManagement.merchant.contactPhone',
                            })}
                        >
                            <span>{contactTel}</span>
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({
                                id: 'merchantManagement.merchant.contactEmail',
                            })}
                        >
                            <span>{contactEmail}</span>
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        );
    }
}

export default Store;
