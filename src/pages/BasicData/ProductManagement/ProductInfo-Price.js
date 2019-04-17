import React from 'react';
import { Card } from 'antd';
import { formatMessage } from 'umi/locale';

const ProductInfoPrice = props => {
  console.log(props);
  return (
    <Card title={formatMessage({ id: 'basicData.product.price.title' })} bordered={false}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  );
};

export default ProductInfoPrice;
