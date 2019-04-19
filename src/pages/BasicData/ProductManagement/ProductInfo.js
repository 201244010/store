import React, { Component } from 'react';
import { connect } from 'dva';
import ProductInfoBasic from './ProductInfo-Basic';
import ProductInfoPrice from './ProductInfo-Price';
import { getLocationParam, idDecode } from '@/utils/utils';
import * as styles from './ProductManagement.less';

const MESSAGE_PREFIX = {
    product: 'basicData.product',
    weight: 'basicData.weightProduct',
};

@connect(
    state => ({
        product: state.basicDataProduct,
    }),
    dispatch => ({
        getProductDetail: payload =>
            dispatch({ type: 'basicDataProduct/getProductDetail', payload }),
    })
)
class ProductInfo extends Component {
    componentDidMount() {
        const { getProductDetail = {} } = this.props;
        const productId = idDecode(getLocationParam('id'));
        getProductDetail({
            options: {
                product_id: productId,
            },
        });
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
        const {
            product: { productInfo = {} },
        } = this.props;
        const formattedProduct = this.formatProductInfo(productInfo);

        return (
            <div className={styles['content-container']}>
                <ProductInfoBasic {...{ formattedProduct }} />
                <ProductInfoPrice />
            </div>
        );
    }
}

export default ProductInfo;
