import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Input, Modal } from 'antd';
import { customValidate } from '@/utils/customValidate';
import { FORM_ITEM_LAYOUT_COMMON } from '@/constants';
import Captcha from '@/components/Captcha';

@Form.create()
class ChangeMobile extends Component {
  onOk = () => {
    const {
      form: { validateFields },
      onOk,
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(values);
      }
    });
  };

  onCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  getCode = () => {};

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      mobileBinded = true,
    } = this.props;

    return (
      <Modal
        title={
          mobileBinded
            ? formatMessage({ id: 'change.mobile.title' })
            : formatMessage({ id: 'bind.mobile.title' })
        }
        visible={visible}
        maskClosable={false}
        destroyOnClose
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <Form>
          <Form.Item
            {...FORM_ITEM_LAYOUT_COMMON}
            label={formatMessage({ id: 'change.loginPassword' })}
          >
            {getFieldDecorator('password', {
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
            label={
              mobileBinded
                ? formatMessage({ id: 'change.mobile.number.new' })
                : formatMessage({ id: 'change.mobile.number' })
            }
          >
            {getFieldDecorator('mobole', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'mobile.validate.isEmpty' }),
                },
                {
                  pattern: /^1\d{10}$/,
                  message: formatMessage({ id: 'mobile.validate.isFormatted' }),
                },
              ],
            })(<Input addonBefore="+86" maxLength={11} />)}
          </Form.Item>
          <Form.Item
            {...FORM_ITEM_LAYOUT_COMMON}
            label={formatMessage({ id: 'change.password.confirm' })}
          >
            {getFieldDecorator('code', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'code.validate.isEmpty' }),
                },
              ],
            })(
              <Captcha
                {...{
                  inputProps: {},
                  buttonProps: {
                    block: true,
                  },
                  buttonText: {
                    initText: formatMessage({ id: 'btn.get.code' }),
                    countText: formatMessage({ id: 'countDown.unit' }),
                  },
                  onClick: this.getCode,
                }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default ChangeMobile;
