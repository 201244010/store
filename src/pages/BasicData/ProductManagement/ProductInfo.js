import React, { Component } from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import ProductInfoBasic from './ProductInfo-Basic';
import ProductInfoPrice from './ProductInfo-Price';
import { getLocationParam, idDecode, idEncode } from '@/utils/utils';
import { PRODUCT_BASIC, PRODUCT_PRICE } from '@/constants/mapping';
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

    toPath = target => {
        const {
            product: {
                productInfo: { id },
            },
        } = this.props;
        const path = {
            edit: `/basicData/productManagement/list/productUpdate?action=edit&id=${idEncode(
                id
            )}&from=detail`,
            back: '/basicData/productManagement/list',
        };
        router.push(path[target] || '/');
    };

    formatProductInfo = (productInfo = [], template = {}, type = 'product') => {
        const prefix = MESSAGE_PREFIX[type] || '';
        return Object.keys(template).map(key => ({
            key,
            value: productInfo[key],
            label: `${prefix}.${key}`,
        }));
    };

    render() {
        const {
            product: {
                productInfo = {},
                productInfo: { extra_info: productBasicExtra, extra_price_info: productPriceExtra },
            },
        } = this.props;

        const productBasic = this.formatProductInfo(productInfo, PRODUCT_BASIC);
        const productPrice = this.formatProductInfo(productInfo, PRODUCT_PRICE);

        return (
            <div className={styles['content-container']}>
                <ProductInfoBasic
                    {...{
                        productBasic,
                        productBasicExtra,
                    }}
                />
                <ProductInfoPrice
                    {...{
                        productPrice,
                        productPriceExtra,
                    }}
                />
                <div className={styles.footer}>
                    <Button
                        className={styles.btn}
                        type="primary"
                        onClick={() => this.toPath('edit')}
                    >
                        {formatMessage({ id: 'btn.alter' })}
                    </Button>
                    <Button className={styles.btn} onClick={() => this.toPath('back')}>
                        {formatMessage({ id: 'btn.back' })}
                    </Button>
                </div>
            </div>
        );
    }
}

export default ProductInfo;
