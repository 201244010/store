import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Divider, List } from 'antd';
import Storage from '@konata9/storage.js';
import styles from './StoreRelate.less';

@connect(state => ({
    merchant: state.merchant,
}))
class StoreRelate extends Component {
    enterSystem = company => {
        Storage.set({ __company_id__: company.id });
        router.push('/');
    };

    render() {
        const {
            merchant: { companyList },
        } = this.props;
        return (
            <div className={styles['store-wrapper']}>
                {companyList.length > 0 ? (
                    <>
                        <p>{formatMessage({ id: 'relatedStore.choose' })}</p>
                        <List className={styles['store-list']}>
                            {companyList.map(company => (
                                <List.Item key={company.id}>
                                    <List.Item.Meta description={company.full_name} />
                                    <a onClick={() => this.enterSystem(company)}>
                                        {formatMessage({ id: 'relatedStore.entry' })}
                                    </a>
                                </List.Item>
                            ))}
                        </List>
                    </>
                ) : (
                    <>
                        <p className={styles['store-content']}>
                            {formatMessage({ id: 'relatedStore.none' })}
                        </p>
                        <Button
                            type="primary"
                            size="large"
                            block
                            href="/merchant/create"
                            target="/merchant/create"
                        >
                            {formatMessage({ id: 'relatedStore.create' })}
                        </Button>
                        <Divider className={styles['store-divider']} />
                        <p className={styles['store-content']}>
                            {formatMessage({ id: 'relatedStore.notice' })}
                        </p>
                    </>
                )}
            </div>
        );
    }
}

export default StoreRelate;
