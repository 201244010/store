import React, { Component } from 'react';
import { Form, Button, Row, Col } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import ProductCUBasic from './ProductCU-Basic';
import ProductCUPrice from './ProductCU-Price';
import { getLocationParam, idDecode, idEncode } from '@/utils/utils';
import { FORM_FORMAT, FORM_ITEM_LAYOUT } from '@/constants/form';
import * as styles from './ProductManagement.less';
import { PRODUCT_SEQ_EXIST } from '@/constants/errorCode';

@connect(
    state => ({
        product: state.basicDataProduct,
    }),
    dispatch => ({
        getProductDetail: payload =>
            dispatch({ type: 'basicDataProduct/getProductDetail', payload }),
        createProduct: payload => dispatch({ type: 'basicDataProduct/createProduct', payload }),
        updateProduct: payload => dispatch({ type: 'basicDataProduct/updateProduct', payload }),
        clearState: () => dispatch({ type: 'basicDataProduct/clearState' }),
    })
)
@Form.create()
class ProductCU extends Component {
    componentDidMount() {
        const { getProductDetail, clearState } = this.props;
        const [action = 'create', id = ''] = [getLocationParam('action'), getLocationParam('id')];
        if (action === 'create') {
            clearState();
        } else if (action === 'edit') {
            const productId = idDecode(id);
            getProductDetail({
                options: { product_id: productId },
            });
        }
    }

    onSubmit = () => {
        const {
            createProduct,
            updateProduct,
            product: {
                productInfo: { id = null },
            },
        } = this.props;
        const [action = '', fromPage = 'list'] = [
            getLocationParam('action'),
            getLocationParam('from'),
        ];
        const submitFunction = {
            create: createProduct,
            edit: updateProduct,
        };
        const {
            form: { validateFields, setFields },
        } = this.props;
        validateFields(async (err, values) => {
            if (!err) {
                const response = await submitFunction[action]({
                    options: {
                        ...values,
                        fromPage,
                        product_id: id,
                    },
                });
                if (response && response.code === PRODUCT_SEQ_EXIST) {
                    setFields({
                        seq_num: {
                            values: values.seq_num,
                            errors: [new Error(formatMessage({ id: 'product.seq_num.isExist' }))],
                        },
                    });
                }
            }
        });
    };

    goBack = () => {
        const {
            product: {
                productInfo: { id = idDecode(getLocationParam('id')) },
            },
        } = this.props;
        const from = getLocationParam('from');
        const pathPrefix = '/basicData/productManagement';
        const path = {
            detail: `${pathPrefix}/list/productInfo?id=${idEncode(id)}`,
            list: `${pathPrefix}/list`,
        };

        router.push(path[from] || path.list);
    };

    render() {
        const {
            form,
            product: { productInfo },
        } = this.props;
        const action = getLocationParam('action');

        return (
            <div className={styles['content-container']}>
                <Form
                    {...{
                        ...FORM_FORMAT,
                        ...FORM_ITEM_LAYOUT,
                    }}
                >
                    <ProductCUBasic {...{ form, productInfo }} />

                    <ProductCUPrice {...{ form, productInfo }} />

                    <Row>
                        <Col span={12}>
                            <Form.Item label=" " colon={false}>
                                <Button type="primary" onClick={this.onSubmit}>
                                    {action === 'create'
                                        ? formatMessage({ id: 'btn.create' })
                                        : formatMessage({ id: 'btn.alter' })}
                                </Button>
                                <Button style={{ marginLeft: '20px' }} onClick={this.goBack}>
                                    {formatMessage({ id: 'btn.cancel' })}
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default ProductCU;
