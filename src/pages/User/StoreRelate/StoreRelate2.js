import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Divider, Icon } from 'antd';
import * as CookieUtil from '@/utils/cookies';
import { ERROR_OK } from '@/constants/errorCode';
import { MENU_PREFIX } from '@/constants';
import Storage from '@konata9/storage.js';
import styles from './StoreRelate.less';

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
            const shopList = result.shop_list || [];
            Storage.set({ [CookieUtil.SHOP_LIST_KEY]: shopList }, 'local');
            if (shopList.length === 0) {
                router.push(`${MENU_PREFIX.STORE}/createStore`);
            } else {
                const lastStore = shopList.length;
                const defaultStore = shopList[lastStore - 1] || {};
                CookieUtil.setCookieByKey(CookieUtil.SHOP_ID_KEY, defaultStore.shop_id);
                router.push('/');
            }
        }
    };

    enterSystem = company => {
        CookieUtil.setCookieByKey(CookieUtil.COMPANY_ID_KEY, company.company_id);
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
                        <h1 className={styles['store-title']}>
                            {formatMessage({ id: 'relatedStore.choose' })}
                        </h1>
                        <div className={styles['store-list']}>
                            {companyList.map(company => (
                                <Button
                                    key={company.company_id}
                                    onClick={() => this.enterSystem(company)}
                                    className={styles['list-btn']}
                                    block
                                >
                                    <span className={styles['btn-name']}>
                                        {company.company_name}
                                    </span>
                                    <Icon className={styles['btn-icon']} type="right" />
                                </Button>
                            ))}
                        </div>
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
