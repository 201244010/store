import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Input, Modal } from 'antd';
import { customValidate } from '@/utils/customValidate';
import { FORM_ITEM_LAYOUT_COMMON } from '@/constants/form';
import { encryption } from '@/utils/utils';

@Form.create()
class ChangePassword extends Component {
  onOk = () => {
    const {
      form: { validateFields },
      onOk,
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const options = {
          ...values,
          old_password: encryption(values.old_password),
          new_password: encryption(values.new_password),
        };
        onOk(options);
      }
    });
  };

  onCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      visible,
    } = this.props;

    return (
      <Modal
        title={formatMessage({ id: 'change.password.title' })}
        visible={visible}
        maskClosable={false}
        destroyOnClose
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <Form>
          <Form.Item
            {...FORM_ITEM_LAYOUT_COMMON}
            label={formatMessage({ id: 'change.password.current' })}
          >
            {getFieldDecorator('old_password', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  validator: (rule, value, callback) =>
                    customValidate({
                      field: 'password',
                      rule,
                      value,
                      callback,
                    }),
                },
              ],
            })(<Input type="password" />)}
          </Form.Item>
          <Form.Item
            {...FORM_ITEM_LAYOUT_COMMON}
            label={formatMessage({ id: 'change.password.old' })}
          >
            {getFieldDecorator('new_password', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  validator: (rule, value, callback) =>
                    customValidate({
                      field: 'password',
                      rule,
                      value,
                      callback,
                    }),
                },
              ],
            })(<Input type="password" />)}
          </Form.Item>
          <Form.Item
            {...FORM_ITEM_LAYOUT_COMMON}
            label={formatMessage({ id: 'change.password.confirm' })}
          >
            {getFieldDecorator('confirm', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  validator: (rule, value, callback) =>
                    customValidate({
                      field: 'confirm',
                      rule,
                      value,
                      callback,
                      extra: {
                        getFieldValue,
                        compareField: 'new_password',
                      },
                    }),
                },
              ],
            })(<Input type="password" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default ChangePassword;
