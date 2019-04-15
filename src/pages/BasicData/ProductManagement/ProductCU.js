import React, { Component } from 'react';
import { Card, Form, Input, Select, Button, Row, Col } from 'antd';
import EditableFormItem from '@/components/EditableFormItem';
import { getLocationParam } from '@/utils/utils';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import { FORM_FORMAT, FORM_ITEM_LAYOUT } from '@/constants/form';
import * as styles from './ProductManagement.less';

@Form.create()
class ProductCU extends Component {
  constructor(props) {
    super(props);
    this.customLabelId = 0;
    this.customPriceId = 0;
  }

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

  editCustomLabel = labelProps => {
    console.log(labelProps);
  };

  customizeLabel = labelProps => {
    const { name } = labelProps;
    return <span onClick={() => this.editCustomLabel(labelProps)}>{name}</span>;
  };

  addCustomFormItem(type) {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    let nextId;

    const keys = getFieldValue(`custom_${type}`);
    if (type === 'label') {
      this.customLabelId += 1;
      nextId = this.customLabelId;
    } else if (type === 'price') {
      this.customPriceId += 1;
      nextId = this.customPriceId;
    }

    const nextKeys = keys.concat(nextId);
    setFieldsValue({
      [`custom_${type}`]: nextKeys,
    });
  }

  renderCustomizeFormItem = (type, customItems = []) => {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    getFieldDecorator(`custom_${type}`, { initialValue: [] });
    const keys = getFieldValue(`custom_${type}`);
    let [labelMessageId, formKey, inputItem, rules] = ['', '', null, []];

    if (type === 'label') {
      labelMessageId = 'basicData.product.customize';
      formKey = 'customizeLabels';
      inputItem = <Input />;
      rules = [];
    } else if (type === 'price') {
      labelMessageId = 'basicData.product.price.customize';
      formKey = 'customizeValues';
      inputItem = <Input maxLength={10} />;
      rules = [];
    }

    return keys.map((key, index) => {
      const labelName = `${formatMessage({ id: labelMessageId })}${index + 1}`;
      const labelProps = {
        type,
        index,
        name: labelName,
      };
      return (
        <Col span={12} key={key}>
          <Form.Item label={this.customizeLabel(labelProps)}>
            {getFieldDecorator(`${formKey}.${index}`, {
              initialValue: customItems[index] || '',
              rules,
            })(inputItem)}
          </Form.Item>
        </Col>
      );
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      form,
    } = this.props;
    const [productTypes, productUnits] = [[], []];

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
                    rules: [{ required: true, message: '' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.bar_code' })}>
                  {getFieldDecorator('bar_code')(<Input />)}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.name' })}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.nickname' })}>
                  {getFieldDecorator('nickname')(<Input />)}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.type' })}>
                  {getFieldDecorator('type')(
                    <Select>
                      {productTypes.map(type => (
                        <Select.Option key={type.key} value={type.value}>
                          {type}
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
                          {unit}
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
                  {getFieldDecorator('spec')(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.production_area' })}>
                  {getFieldDecorator('production_area')(<Input />)}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.level' })}>
                  {getFieldDecorator('level')(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.brand' })}>
                  {getFieldDecorator('brand')(<Input />)}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.production_date' })}>
                  {getFieldDecorator('production_date')(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.qrCode.link' })}>
                  {getFieldDecorator('qrCode.link')(<Input />)}
                </Form.Item>
              </Col>
            </Row>

            <EditableFormItem
              {...{
                form,
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
                    rules: [{ required: true, message: '' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.promote_price' })}>
                  {getFieldDecorator('promote_price')(<Input />)}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'basicData.product.price.vip' })}>
                  {getFieldDecorator('vip')(<Input />)}
                </Form.Item>
              </Col>
            </Row>

            <EditableFormItem
              {...{
                form,
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
