import React from 'react';
import { Card, Row, Col, Form, Input, Checkbox } from 'antd';
import { formatMessage } from 'umi/locale';

const options = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' },
];

// TODO 称重商品信息部分
const ProductCUWeight = props => {
    const {
        form: { getFieldDecorator },
    } = props;
    return (
        <Card
            title={formatMessage({ id: 'basicData.weightProduct.detail.title' })}
            bordered={false}
        >
            <Row>
                <Col span={12}>
                    <Form.Item label={formatMessage({ id: 'basicData.weightProduct.PLU' })}>
                        {getFieldDecorator('plu')(<Input />)}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={formatMessage({ id: 'basicData.weightProduct.PLU' })}>
                        {getFieldDecorator('plu')(
                            <Checkbox.Group options={options} defaultValue={['Pear']} />
                        )}
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col span={12}>
                    <Form.Item
                        label={formatMessage({ id: 'basicData.weightProduct.printLabel.number' })}
                    >
                        {getFieldDecorator('plu')(<Input />)}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={formatMessage({ id: 'basicData.weightProduct.barCode.number' })}
                    >
                        {getFieldDecorator('plu')(<Input />)}
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col span={12}>
                    <Form.Item
                        label={formatMessage({ id: 'basicData.weightProduct.printLabel.number' })}
                    >
                        {getFieldDecorator('plu')(<Input />)}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={formatMessage({ id: 'basicData.weightProduct.weight' })}>
                        {getFieldDecorator('plu')(<Input />)}
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
};

export default ProductCUWeight;
