import React from 'react';
import { Card, Col, Form, Input, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { customValidate } from '@/utils/customValidate';
import EditableFormItem from '@/components/EditableFormItem';

const ProductCUPrice = props => {
    const {
        form = {},
        form: { getFieldDecorator },
        productInfo: { price, promote_price, member_price },
    } = props;

    return (
        <Card title={formatMessage({ id: 'basicData.product.price.title' })} bordered={false}>
            <Row>
                <Col span={12}>
                    <Form.Item label={formatMessage({ id: 'basicData.product.price' })}>
                        {getFieldDecorator('price', {
                            initialValue: price,
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({ id: 'product.price.isEmpty' }),
                                },
                                {
                                    validator: (rule, value, callback) =>
                                        customValidate({
                                            field: 'price',
                                            rule,
                                            value,
                                            callback,
                                        }),
                                },
                            ],
                        })(<Input type="number" />)}
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label={formatMessage({ id: 'basicData.product.promote_price' })}>
                        {getFieldDecorator('promote_price', {
                            initialValue: promote_price,
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    validator: (rule, value, callback) =>
                                        customValidate({
                                            field: 'promote_price',
                                            rule,
                                            value,
                                            callback,
                                        }),
                                },
                            ],
                        })(<Input type="number" />)}
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col span={12}>
                    <Form.Item label={formatMessage({ id: 'basicData.product.member_price' })}>
                        {getFieldDecorator('member_price', {
                            initialValue: member_price,
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    validator: (rule, value, callback) =>
                                        customValidate({
                                            field: 'member_price',
                                            rule,
                                            value,
                                            callback,
                                        }),
                                },
                            ],
                        })(<Input type="number" />)}
                    </Form.Item>
                </Col>
            </Row>

            <EditableFormItem
                {...{
                    form,
                    max: 1,
                    wrapperItem: <Input type="number" />,
                    itemOptions: {
                        itemDecorator: 'price',
                        validateTrigger: 'onBlur',
                        rules: [
                            {
                                required: true,
                                message: formatMessage({
                                    id: 'basicData.product.extraPrice.isEmpty',
                                }),
                            },
                        ],
                    },
                    labelOption: {
                        labelPrefix: formatMessage({ id: 'basicData.product.price.customize' }),
                        formKey: 'extra_price_info',
                        editable: false,
                    },
                    buttonProps: {
                        span: 12,
                        icon: 'plus',
                        type: 'dashed',
                        block: true,
                        text: formatMessage({ id: 'basicData.product.price.add' }),
                    },
                }}
            />
        </Card>
    );
};

export default ProductCUPrice;
