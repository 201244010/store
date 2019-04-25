import React from 'react';
import { Card } from 'antd';
import { formatMessage } from 'umi/locale';
import * as styles from '@/pages/BasicData/ProductManagement/ProductManagement.less';

const ProductInfoPrice = props => {
    const { productPrice = [], productPriceExtra = [] } = props;

    return (
        <Card title={formatMessage({ id: 'basicData.product.price.title' })} bordered={false}>
            <div className={styles['card-column']}>
                {productPrice.map(product => (
                    <div className={styles['card-item']} key={product.key}>
                        <span className={styles['item-label']}>
                            {formatMessage({ id: product.label })}：
                        </span>
                        <span className={styles['item-content']}>
                            {product.value >= 0 ? product.value : ''}
                        </span>
                    </div>
                ))}
            </div>
            <div className={styles['card-column']}>
                {productPriceExtra.map((extra, index) => (
                    <div className={styles['card-item']} key={index}>
                        <span className={styles['item-label']}>{extra.name}：</span>
                        <span className={styles['item-content']}>{extra.price}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default ProductInfoPrice;
