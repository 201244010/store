import React, { Component } from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import EditableLabel from './EditableLabel';

const formItemLayout = {
  wrapperCol: { span: 24 },
};

class EditableFormItem extends Component {
  constructor(props) {
    super(props);
    this.key = 0;
  }

  addCustomFormItem = () => {
    const {
      form: { getFieldValue, setFieldsValue },
      labelOption: { formKey = '' },
    } = this.props;

    this.key += 1;

    const keys = getFieldValue(`__${formKey}__`);
    const nextId = this.key;
    const nextKeys = keys.concat(nextId);

    setFieldsValue({
      [`__${formKey}__`]: nextKeys,
    });
  };

  renderCustomizeFormItem = () => {
    const {
      form: { getFieldDecorator, getFieldValue },
      labelOption = {},
      labelOption: { labelPrefix = '', formKey = '', span = 12 },
      itemOptions = {},
      wrapperItem = <Input />,
    } = this.props;

    getFieldDecorator(`__${formKey}__`, { initialValue: [] });
    const keys = getFieldValue(`__${formKey}__`);

    return keys.map((key, index) => {
      const labelName = `${labelPrefix}${index + 1}`;
      const labelProps = {
        ...labelOption,
        index,
        name: labelName,
      };
      return (
        <Col span={span} key={key}>
          <Form.Item {...formItemLayout}>
            <Col span={8}>
              <EditableLabel {...{ labelProps }} />
            </Col>
            <Col span={16}>
              {getFieldDecorator(`${formKey}.${index}`, {
                ...itemOptions,
              })(wrapperItem)}
            </Col>
          </Form.Item>
        </Col>
      );
    });
  };

  render() {
    const {
      buttonProps = {},
      buttonProps: { span = 24, label = ' ', text = '' },
    } = this.props;
    return (
      <>
        <Row>{this.renderCustomizeFormItem()}</Row>
        <Row>
          <Col span={span}>
            <Form.Item label={label} colon={false}>
              <Button {...buttonProps} onClick={this.addCustomFormItem}>
                {text}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  }
}

export default EditableFormItem;
