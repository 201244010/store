import React, { Component } from 'react';
import { Form, Button, Row, Col } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import ProductCUBasic from './ProductCU-Basic';
import ProductCUPrice from './ProductCU-Price';
import { getLocationParam } from '@/utils/utils';
import { FORM_FORMAT, FORM_ITEM_LAYOUT } from '@/constants/form';
import * as styles from './ProductManagement.less';

@Form.create()
class ProductCU extends Component {
    componentDidMount() {
        const id = getLocationParam('id');
        if (id) {
            // TODO 获取商品信息
            console.log(id);
        }
    }

    onSubmit = () => {
        const [action = '', id = ''] = [getLocationParam('action'), getLocationParam('id')];
        const {
            form: { validateFields },
        } = this.props;
        validateFields((err, values) => {
            console.log(values);
            // TODO 商品新建提交逻辑
            console.log(action, id);
        });
    };

    goBack = () => {
        const [action = '', id = ''] = [getLocationParam('action'), getLocationParam('id')];
        const pathPrefix = '/basicData/productManagement';
        const path =
            action === 'edit' ? `${pathPrefix}/list/productInfo?id=${id}` : `${pathPrefix}/list`;
        router.push(path);
    };

    render() {
        const { form } = this.props;

        return (
            <div className={styles['content-container']}>
                <Form
                    {...{
                        ...FORM_FORMAT,
                        ...FORM_ITEM_LAYOUT,
                    }}
                >
                    <ProductCUBasic {...{ form }} />

                    <ProductCUPrice {...{ form }} />

                    <Row>
                        <Col span={12}>
                            <Form.Item label=" " colon={false}>
                                <Button type="primary" onClick={this.onSubmit}>
                                    {formatMessage({ id: 'btn.create' })}
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
