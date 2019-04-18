import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Card, List, Icon, Button, Modal, Form } from 'antd';
import router from 'umi/router';
import { FORM_ITEM_LAYOUT_COMMON } from '@/constants/form';
import { connect } from 'dva';

import * as styles from './Account.less';

@connect(state => ({
    business: state.business,
}))
class Store extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    viewStore = () => {
        this.setState({
            visible: true,
        });
    };

    update = () => {
        router.push('/basicData/businessManagement/modify');
    };

    cancel = () => {
        this.setState({
            visible: false,
        });
    };

    createStore = () => {
        // TODO 创建新商户逻辑
        router.push('/merchant/create');
    };

    render() {
        const { itemList = [] } = this.props;
        const {
            business: {
                companyList: {
                    company_no: companyNo,
                    contact_email: contactEmail,
                    contact_tel: contactTel,
                    company_name: companyName,
                    contact_person: contactPerson,
                },
            },
        } = this.props;
        const { visible } = this.state;
        console.log(itemList);

        return (
            <Card style={{ marginTop: '15px' }}>
                <h2>{formatMessage({ id: 'userCenter.store.title' })}</h2>
                <List className={styles['list-wrapper']}>
                    <List.Item>
                        <div className={styles['list-item']}>
                            <div className={styles['title-wrapper-start']}>
                                <div className={styles['title-wrapper-icon']}>
                                    <h4>{formatMessage({ id: 'userCenter.store.name' })}</h4>
                                    <Icon type="property-safety" />
                                </div>
                                <div onClick={this.viewStore} className={styles['button-more']}>
                                    {formatMessage({ id: 'list.action.detail' })}
                                </div>
                            </div>
                            <div>{companyName}</div>
                        </div>
                    </List.Item>
                </List>
                <div>
                    <Button type="dashed" icon="plus" block onClick={this.createStore}>
                        {formatMessage({ id: 'userCenter.store.create' })}
                    </Button>
                </div>
                <Modal
                    visible={visible}
                    title={formatMessage({ id: 'businessManagement.business.businessMessage' })}
                    onCancel={this.cancel}
                    footer={
                        <div className={styles['button-style']}>
                            <Button style={{ marginLeft: 20 }} onClick={this.cancel}>
                                {formatMessage({ id: 'btn.back' })}
                            </Button>
                            <Button type="primary" onClick={this.update}>
                                {formatMessage({ id: 'btn.alter' })}
                            </Button>
                        </div>
                    }
                >
                    <Form {...FORM_ITEM_LAYOUT_COMMON}>
                        <Form.Item
                            label={formatMessage({ id: 'businessManagement.business.number' })}
                        >
                            <span>{companyNo}</span>
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({ id: 'businessManagement.business.name' })}
                        >
                            <span>{companyName}</span>
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({
                                id: 'businessManagement.business.contactPerson',
                            })}
                        >
                            <span>{contactPerson}</span>
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({
                                id: 'businessManagement.business.contactPhone',
                            })}
                        >
                            <span>{contactTel}</span>
                        </Form.Item>
                        <Form.Item
                            label={formatMessage({
                                id: 'businessManagement.business.contactEmail',
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
