import React from 'react';
import { Card } from 'antd';
import { formatMessage } from 'umi/locale';
import { PRODUCT_TYPE } from '@/constants/mapping';
import * as styles from './ProductManagement.less';

const ProductInfoBasic = props => {
    const { productBasic = [], productBasicExtra = [] } = props;
    return (
        <Card title={formatMessage({ id: 'basicData.product.detail.title' })} bordered={false}>
            <div className={styles['card-column']}>
                {productBasic.map(product => (
                    <div className={styles['card-item']} key={product.key}>
                        <span className={styles['item-label']}>
                            {formatMessage({ id: product.label })}：
                        </span>
                        <span className={styles['item-content']}>
                            {!['expire_time', 'Type'].includes(product.key) && product.value}
                            {product.key === 'expire_time' &&
                                (product.value < 0 ? (
                                    ''
                                ) : (
                                    <span>
                                        {product.value}{' '}
                                        {formatMessage({ id: 'basicData.product.expire_time.day' })}
                                    </span>
                                ))}
                            {product.key === 'Type' && (
                                <span>
                                    {formatMessage({
                                        id:
                                            PRODUCT_TYPE[`${product.value}`] ||
                                            'basicData.product.type.normal',
                                    })}
                                </span>
                            )}
                        </span>
                    </div>
                ))}
            </div>
            <div className={styles['card-column']}>
                {productBasicExtra.map(extra => (
                    <div className={styles['card-item']} key={extra.idx || +new Date()}>
                        <span className={styles['item-label']}>{extra.name}：</span>
                        <span className={styles['item-content']}>{extra.context}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default ProductInfoBasic;
