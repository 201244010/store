import React, { Component } from 'react';
import ProductInfoBasic from './ProductInfo-Basic';
import ProductInfoPrice from './ProductInfo-Price';
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
        <ProductInfoBasic {...{ formattedProduct }} />
        <ProductInfoPrice />
      </div>
    );
  }
}

export default ProductInfo;
