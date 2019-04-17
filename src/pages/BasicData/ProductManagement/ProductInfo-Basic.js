import React from 'react';
import { Card } from 'antd';
import { formatMessage } from 'umi/locale';
import * as styles from './ProductManagement.less';

const ProductInfoBasic = props => {
  const { formattedProduct } = props;
  return (
    <Card title={formatMessage({ id: 'basicData.product.detail.title' })} bordered={false}>
      <div className={styles['card-column']}>
        {formattedProduct.map(product => (
          <div className={styles['card-item']} key={product.key}>
            <span className={styles['item-label']}>{formatMessage({ id: product.label })}：</span>
            <span className={styles['item-content']}>{product.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProductInfoBasic;
