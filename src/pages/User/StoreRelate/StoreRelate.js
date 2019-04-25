import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Divider, List } from 'antd';
import Storage from '@konata9/storage.js';
import styles from './StoreRelate.less';
import { ERROR_OK } from '@/constants/errorCode';
import { MENU_PREFIX } from '@/constants';

@connect(
    state => ({
        merchant: state.merchant,
        store: state.store,
    }),
    dispatch => ({
        getStoreList: payload => dispatch({ type: 'store/getStoreList', payload }),
    })
)
class StoreRelate extends Component {
    checkStoreExist = async () => {
        const { getStoreList } = this.props;
        const response = await getStoreList({});
        if (response && response.code === ERROR_OK) {
            const result = response.data || {};
            const storeList = result.shop_list || [];
            if (storeList.length === 0) {
                router.push(`${MENU_PREFIX.STORE}/createStore`);
            } else {
                const lastStore = storeList.length;
                const defaultStore = storeList[lastStore - 1] || {};
                Storage.set({ __shop_id__: defaultStore.shop_id });
                router.push('/');
            }
        }
    };

    enterSystem = company => {
        Storage.set({ __company_id__: company.company_id });
        this.checkStoreExist();
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
                                <List.Item key={company.company_id}>
                                    <List.Item.Meta description={company.company_name} />
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
