import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Input, Modal, message } from 'antd';
import { FORM_ITEM_LAYOUT_COMMON } from '@/constants/form';
import Captcha from '@/components/Captcha';
import { encryption } from '@/utils/utils';
import { ERROR_OK, MOBILE_BINDED } from '@/constants/errorCode';

@Form.create()
class ChangeMobile extends Component {
  onOk = () => {
    const {
      form: { validateFields },
      mobileBinded,
      onOk,
    } = this.props;
    validateFields(async (err, values) => {
      if (!err) {
        const options = {
          ...values,
          password: encryption(values.password),
        };
        const response = await onOk(options);
        if (response && response.code === ERROR_OK) {
          if (mobileBinded) {
            message.success(formatMessage({ id: 'change.mobile.success' }));
          } else {
            message.success(formatMessage({ id: 'bind.mobile.success' }));
          }
        } else if (response && response.code === MOBILE_BINDED) {
          message.error(formatMessage({ id: 'mobile.binded' }));
        } else {
          message.error(formatMessage({ id: 'change.mobile.fail' }));
        }
      }
    });
  };

  onCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  getCode = async () => {
    const {
      form: { getFieldValue },
      sendCode,
    } = this.props;

    const response = await sendCode({
      options: {
        username: getFieldValue('phone'),
        type: '2',
      },
    });

    if (response && response.code === ERROR_OK) {
      message.success(formatMessage({ id: 'send.mobile.code.success' }));
    }
  };

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
                { required: true, message: formatMessage({ id: 'change.loginPassword.isEmpty' }) },
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
            {getFieldDecorator('phone', {
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
            label={formatMessage({ id: 'change.mobile.code' })}
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
