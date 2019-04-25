import React, { Component } from 'react';
import { Card, Col, Form, Input, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { customValidate } from '@/utils/customValidate';
import EditableFormItem from '@/components/EditableFormItem';

class ProductCUPrice extends Component {
    constructor(props) {
        super(props);
        const { productInfo } = props || {};
        this.state = {
            extraInfo: productInfo.extra_price_info || [],
        };
    }

    extraInfoRemove = index => {
        const { extraInfo } = this.state;
        const editInfo = [...extraInfo].splice(index, 1);
        this.setState({
            extraInfo: editInfo,
        });
    };

    render() {
        const { extraInfo } = this.state;
        const {
            form = {},
            form: { getFieldDecorator },
            productInfo: { price, promote_price, member_price },
        } = this.props;

        return (
            <Card title={formatMessage({ id: 'basicData.product.price.title' })} bordered={false}>
                <Row>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.price' })}>
                            {getFieldDecorator('price', {
                                initialValue: price >= 0 ? price : '',
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
                                initialValue: promote_price >= 0 ? promote_price : '',
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
                                initialValue: member_price >= 0 ? member_price : '',
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
                        max: 7,
                        wrapperItem: <Input type="number" />,
                        countStart: extraInfo.length || 0,
                        data: extraInfo,
                        onRemove: index => this.extraInfoRemove(index),
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
    }
}

export default ProductCUPrice;
