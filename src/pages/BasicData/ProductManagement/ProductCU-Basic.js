import React, { Component } from 'react';
import { Card, Col, Form, Icon, Input, Modal, Row, Upload, Select } from 'antd';
import { customValidate } from '@/utils/customValidate';
import { formatMessage } from 'umi/locale';
import { MAX_LENGTH } from '@/constants/form';
import EditableFormItem from '@/components/EditableFormItem';

const MAX_IMG = 5;
const productTypes = [{ key: 'normal', value: 0 }, { key: 'weight', value: 1 }];
const productUnits = [
    { key: 'box', value: 0 },
    { key: 'pack', value: 1 },
    { key: 'bottle', value: 2 },
    { key: 'can', value: 3 },
    { key: 'piece', value: 4 },
    { key: 'case', value: 5 },
    { key: 'axe', value: 6 },
    { key: 'kg', value: 7 },
    { key: 'g', value: 8 },
    { key: 'each', value: 9 },
    { key: 'single', value: 10 },
    { key: 'bag', value: 11 },
    { key: 'list', value: 12 },
    { key: 'role', value: 13 },
    { key: 'pair', value: 14 },
    { key: 'l', value: 15 },
    { key: 'ml', value: 16 },
    { key: 'handle', value: 17 },
    { key: 'group', value: 18 },
    { key: 'branch', value: 19 },
];

const uploadButton = (
    <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
    </div>
);

class ProductCUBasic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [
                {
                    uid: '-1',
                    name: 'xxx.png',
                    status: 'done',
                    url:
                        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                },
            ],
        };
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });

    handleTypeChange = value => {
        console.log(value);
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const {
            form: { getFieldDecorator },
            form,
        } = this.props;
        return (
            <Card title={formatMessage({ id: 'basicData.product.detail.title' })} bordered={false}>
                <Row>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.seq_num' })}>
                            {getFieldDecorator('seq_num', {
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
                        <Form.Item label={formatMessage({ id: 'basicData.product.nickname' })}>
                            {getFieldDecorator('nickname')(<Input maxLength={MAX_LENGTH['100']} />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.type' })}>
                            {getFieldDecorator('type', {
                                initialValue: 0,
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
                            {getFieldDecorator('unit')(
                                <Select>
                                    {productUnits.map(unit => (
                                        <Select.Option key={unit.key} value={unit.value}>
                                            {formatMessage({
                                                id: `basicData.product.unit.${unit.key}`,
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
                            {getFieldDecorator('spec')(<Input maxLength={MAX_LENGTH['20']} />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={formatMessage({ id: 'basicData.product.production_area' })}
                        >
                            {getFieldDecorator('production_area')(
                                <Input maxLength={MAX_LENGTH['20']} />
                            )}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.level' })}>
                            {getFieldDecorator('level')(<Input maxLength={MAX_LENGTH['20']} />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.brand' })}>
                            {getFieldDecorator('brand')(<Input maxLength={MAX_LENGTH['20']} />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item
                            label={formatMessage({ id: 'basicData.product.production_date' })}
                        >
                            {getFieldDecorator('production_date', {
                                validateTrigger: 'onBlur',
                                rules: [
                                    {
                                        validator: (rule, value, callback) =>
                                            customValidate({
                                                field: 'production_date',
                                                rule,
                                                value,
                                                callback,
                                            }),
                                    },
                                ],
                            })(
                                <Input
                                    suffix={formatMessage({
                                        id: 'basicData.product.production_date.day',
                                    })}
                                    maxLength={MAX_LENGTH['4']}
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={formatMessage({ id: 'basicData.product.qrCode.link' })}>
                            {getFieldDecorator('qrCode.link')(
                                <Input maxLength={MAX_LENGTH['200']} />
                            )}
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
                                        id: 'basicData.product.customize.isEmpty',
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

                <Row>
                    <Form.Item
                        {...{
                            labelCol: {
                                md: { span: 4 },
                            },
                            wrapperCol: {
                                md: { span: 20 },
                            },
                        }}
                        label={formatMessage({ id: 'basicData.product.image' })}
                    >
                        <Upload
                            action="//jsonplaceholder.typicode.com/posts/"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                        >
                            {fileList.length >= MAX_IMG ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </Form.Item>
                </Row>
            </Card>
        );
    }
}

export default ProductCUBasic;
