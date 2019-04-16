import React, { Component } from 'react';
import { Card, Form, Input, Select, Button, Row, Col } from 'antd';
import EditableFormItem from '@/components/EditableFormItem';
import { getLocationParam } from '@/utils/utils';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import { MAX_LENGTH, FORM_FORMAT, FORM_ITEM_LAYOUT } from '@/constants/form';
import * as styles from './ProductManagement.less';

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
    const {
      form: { getFieldDecorator },
      form,
    } = this.props;

    return (
      <div className={styles['content-container']}>
        <Form
          {...{
            ...FORM_FORMAT,
            ...FORM_ITEM_LAYOUT,
          }}
        >
          <Card title={formatMessage({ id: 'basicData.product.detail.title' })} bordered={false}>
            <Row>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.seq_num' })}>
                  {getFieldDecorator('seq_num', {
                    rules: [
                      { required: true, message: formatMessage({ id: 'product.seq_num.isEmpty' }) },
                    ],
                  })(<Input maxLength={MAX_LENGTH['20']} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.bar_code' })}>
                  {getFieldDecorator('bar_code', {
                    rules: [{ pattern: /[a-zA-Z]{0,20}/, message: '' }],
                  })(<Input maxLength={MAX_LENGTH['20']} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.name' })}>
                  {getFieldDecorator('name', {
                    rules: [
                      { required: true, message: formatMessage({ id: 'product.name.isEmpty' }) },
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
                        <Select.Option key={type.key} value={type.value}>
                          {formatMessage({ id: `basicData.product.type.${type.key}` })}
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
                          {formatMessage({ id: `basicData.product.unit.${unit.key}` })}
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
                <Form.Item label={formatMessage({ id: 'basicData.product.production_area' })}>
                  {getFieldDecorator('production_area')(<Input maxLength={MAX_LENGTH['20']} />)}
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
                <Form.Item label={formatMessage({ id: 'basicData.product.production_date' })}>
                  {getFieldDecorator('production_date')(
                    <Input
                      suffix={formatMessage({ id: 'basicData.product.production_date.day' })}
                      maxLength={MAX_LENGTH['4']}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.qrCode.link' })}>
                  {getFieldDecorator('qrCode.link')(<Input maxLength={MAX_LENGTH['200']} />)}
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
                      message: formatMessage({ id: 'basicData.product.customize.isEmpty' }),
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
              />
            </Row>
          </Card>

          <Card title={formatMessage({ id: 'basicData.product.price.title' })} bordered={false}>
            <Row>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.price' })}>
                  {getFieldDecorator('price', {
                    rules: [
                      { required: true, message: formatMessage({ id: 'product.price.isEmpty' }) },
                    ],
                  })(<Input maxLength={MAX_LENGTH['9']} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.promote_price' })}>
                  {getFieldDecorator('promote_price')(<Input maxLength={MAX_LENGTH['9']} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.price.vip' })}>
                  {getFieldDecorator('vip')(<Input maxLength={MAX_LENGTH['9']} />)}
                </Form.Item>
              </Col>
            </Row>

            <EditableFormItem
              {...{
                form,
                max: 1,
                wrapperItem: <Input maxLength={MAX_LENGTH['9']} />,
                itemOptions: {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'basicData.product.price.customize.isEmpty' }),
                    },
                  ],
                },
                labelOption: {
                  labelPrefix: formatMessage({ id: 'basicData.product.price.customize' }),
                  formKey: 'customPrices',
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
          </Card>
        </Form>
      </div>
    );
  }
}

export default ProductCU;
