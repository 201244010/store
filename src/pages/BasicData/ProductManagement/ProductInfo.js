import React, { Component } from 'react';
import { Card } from 'antd';
import { formatMessage } from 'umi/locale';
import { getLocationParams } from '@/utils/utils';
import * as styles from './ProductManagement.less';

const MESSAGE_PREFIX = {
  product: 'basicData.product',
  weight: 'basicData.weightProduct',
};

const mockInfo = {
  seq_num: '18273jsda0991j',
  bar_code: '1238574019283',
  brand: 'bilibili',
  category: '',
  modified_time: 1554702750,
  name: '2233娘',
  price: 123,
  production_area: '',
  production_date: '2019-03-14',
  promote_price: 111,
  qr_code: '',
  spec: '',
  unit: '2',
};

class ProductInfo extends Component {
  componentDidMount() {
    console.log(this.props);
    console.log(getLocationParams());
  }

  formatProductInfo = (productInfo, type = 'product') => {
    const prefix = MESSAGE_PREFIX[type] || '';
    return Object.keys(productInfo).map(key => ({
      key,
      value: productInfo[key],
      label: `${prefix}.${key}`,
    }));
  };

  render() {
    const { productInfo = mockInfo } = this.props;
    const formattedProduct = this.formatProductInfo(productInfo);
    console.log(formattedProduct);

    return (
      <div className={styles['content-container']}>
        <Card title={formatMessage({ id: 'basicData.product.detail.title' })} bordered={false}>
          <div className={styles['card-column']}>
            {formattedProduct.map(product => (
              <div className={styles['card-item']} key={product.key}>
                <span className={styles['item-label']}>
                  {formatMessage({ id: product.label })}：
                </span>
                <span className={styles['item-content']}>{product.value}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title={formatMessage({ id: 'basicData.product.price.title' })} bordered={false}>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </div>
    );
  }
}

export default ProductInfo;
