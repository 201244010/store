import React, { Component } from 'react';
import { Card, Col, Form, Input, Row, Select } from 'antd';
import { customValidate } from '@/utils/customValidate';
import { formatMessage } from 'umi/locale';
import { MAX_LENGTH } from '@/constants/form';
import EditableFormItem from '@/components/EditableFormItem';

const productTypes = [{ key: 'normal', value: 0 }];
const productUnits = [
    { key: 'box', value: 0, tempValue: '盒' },
    { key: 'pack', value: 1, tempValue: '袋' },
    { key: 'bottle', value: 2, tempValue: '瓶' },
    { key: 'can', value: 3, tempValue: '罐' },
    { key: 'piece', value: 4, tempValue: '件' },
    { key: 'case', value: 5, tempValue: '箱' },
    { key: 'axe', value: 6, tempValue: '斤' },
    { key: 'kg', value: 7, tempValue: '千克' },
    { key: 'g', value: 8, tempValue: '克' },
    { key: 'each', value: 9, tempValue: '个' },
    { key: 'single', value: 10, tempValue: '只' },
    { key: 'bag', value: 11, tempValue: '包' },
    { key: 'list', value: 12, tempValue: '提' },
    { key: 'role', value: 13, tempValue: '卷' },
    { key: 'pair', value: 14, tempValue: '双' },
    { key: 'l', value: 15, tempValue: '升' },
    { key: 'ml', value: 16, tempValue: '毫升' },
    { key: 'handle', value: 17, tempValue: '把' },
    { key: 'group', value: 18, tempValue: '组' },
    { key: 'branch', value: 19, tempValue: '支' },
];

class ProductCUBasic extends Component {
    handleTypeChange = value => {
        console.log(value);
    };

    render() {
        const {
            form: { getFieldDecorator },
            form,
            productInfo: {
                seq_num,
                bar_code,
                name,
                alias,
                Type,
                unit,
                spec,
                area,
                level,
                brand,
                expire_time,
                qr_code,
            },
        } = this.props;
        return (
            <Card title={formatMessage({ id: 'basicData.product.detail.title' })} bordered={false}>
                <Row>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.seq_num' })}>
                            {getFieldDecorator('seq_num', {
                                initialValue: seq_num,
                                validateTrigger: 'onBlur',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({ id: 'product.seq_num.isEmpty' }),
                                    },
                                    {
                                        validator: (rule, value, callback) =>
                                            customValidate({
                                                field: 'seq_num',
                                                rule,
                                                value,
                                                callback,
                                            }),
                                    },
                                ],
                            })(<Input maxLength={MAX_LENGTH['20']} />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.bar_code' })}>
                            {getFieldDecorator('bar_code', {
                                initialValue: bar_code,
                                validateTrigger: 'onBlur',
                                rules: [
                                    {
                                        validator: (rule, value, callback) =>
                                            customValidate({
                                                field: 'bar_code',
                                                rule,
                                                value,
                                                callback,
                                            }),
                                    },
                                ],
                            })(<Input maxLength={MAX_LENGTH['20']} />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.name' })}>
                            {getFieldDecorator('name', {
                                initialValue: name,
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({ id: 'product.name.isEmpty' }),
                                    },
                                ],
                            })(<Input maxLength={MAX_LENGTH['100']} />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.alias' })}>
                            {getFieldDecorator('alias', {
                                initialValue: alias,
                            })(<Input maxLength={MAX_LENGTH['100']} />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.Type' })}>
                            {getFieldDecorator('Type', {
                                initialValue: Type,
                            })(
                                <Select>
                                    {productTypes.map(type => (
                                        <Select.Option
                                            key={type.key}
                                            value={type.value}
                                            onChange={this.handleTypeChange}
                                        >
                                            {formatMessage({
                                                id: `basicData.product.type.${type.key}`,
                                            })}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.unit' })}>
                            {getFieldDecorator('unit', {
                                initialValue: unit,
                            })(
                                <Select>
                                    {productUnits.map(unitItem => (
                                        <Select.Option
                                            key={unitItem.key}
                                            value={unitItem.tempValue}
                                        >
                                            {formatMessage({
                                                id: `basicData.product.unit.${unitItem.key}`,
                                            })}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.spec' })}>
                            {getFieldDecorator('spec', {
                                initialValue: spec,
                            })(<Input maxLength={MAX_LENGTH['20']} />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.area' })}>
                            {getFieldDecorator('area', {
                                initialValue: area,
                            })(<Input maxLength={MAX_LENGTH['20']} />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.level' })}>
                            {getFieldDecorator('level', {
                                initialValue: level,
                            })(<Input maxLength={MAX_LENGTH['20']} />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.brand' })}>
                            {getFieldDecorator('brand', {
                                initialValue: brand,
                            })(<Input maxLength={MAX_LENGTH['20']} />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.expire_time' })}>
                            {getFieldDecorator('expire_time', {
                                initialValue: expire_time,
                                validateTrigger: 'onBlur',
                                rules: [
                                    {
                                        validator: (rule, value, callback) =>
                                            customValidate({
                                                field: 'expire_time',
                                                rule,
                                                value,
                                                callback,
                                            }),
                                    },
                                ],
                            })(
                                <Input
                                    suffix={formatMessage({
                                        id: 'basicData.product.expire_time.day',
                                    })}
                                    maxLength={MAX_LENGTH['4']}
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.qr_code' })}>
                            {getFieldDecorator('qr_code', {
                                initialValue: qr_code,
                            })(<Input maxLength={MAX_LENGTH['200']} />)}
                        </Form.Item>
                    </Col>
                </Row>

                <EditableFormItem
                    {...{
                        form,
                        max: 3,
                        wrapperItem: <Input maxLength={MAX_LENGTH['100']} />,
                        itemOptions: {
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({
                                        id: 'basicData.product.extraInfo.isEmpty',
                                    }),
                                },
                            ],
                        },
                        labelOption: {
                            labelPrefix: formatMessage({ id: 'basicData.product.customize' }),
                            formKey: 'customLabels',
                            editable: false,
                        },
                        buttonProps: {
                            span: 12,
                            icon: 'plus',
                            type: 'dashed',
                            block: true,
                            text: formatMessage({ id: 'basicData.product.label.add' }),
                        },
                    }}
                />
            </Card>
        );
    }
}

export default ProductCUBasic;
