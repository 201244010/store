import React, { Component } from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import EditableLabel from './EditableLabel';

class EditableFormItem extends Component {
  constructor(props) {
    super(props);
    this.key = 0;
  }

  addCustomFormItem() {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;

    this.key += 1;

    const keys = getFieldValue('__customItem__');
    const nextId = this.key;
    const nextKeys = keys.concat(nextId);

    setFieldsValue({
      __customItem__: nextKeys,
    });
  }

  renderCustomizeFormItem = () => {
    const {
      form: { getFieldDecorator, getFieldValue },
      labelOption = {},
      labelOption: { labelPrefix = '', formKey = '' },
      itemOptions = {},
      wrapperItem = () => <Input />,
    } = this.props;

    getFieldDecorator('__customItem__', { initialValue: [] });
    const keys = getFieldValue('__customItem__');

    return keys.map((key, index) => {
      const labelName = `${labelPrefix}${index + 1}`;
      const labelProps = {
        ...labelOption,
        index,
        name: labelName,
      };
      return (
        <Col span={12} key={key}>
          <Form.Item label={<EditableLabel {...labelProps} />}>
            {getFieldDecorator(`${formKey}.${index}`, {
              ...itemOptions,
            })(wrapperItem)}
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
        {this.renderCustomizeFormItem()}
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
