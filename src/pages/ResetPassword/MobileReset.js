import React, { Component } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { formatMessage } from 'umi/locale';
import Captcha from '@/components/Captcha';
import * as RegExp from '@/constants/regexp';
import styles from '@/pages/Register/Register.less';
import ResultInfo from '@/pages/Register/Register';

// TODO 根据 error code 显示不同的错误信息，等待 error code
const ALERT_NOTICE_MAP = {
  '000': 'alert.mobile.not.registered',
};

@Form.create()
class MobileReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetSuccess: false,
      notice: '',
    };
  }

  customValidate = (field, rule, value, callback) => {
    const {
      form: { getFieldValue },
    } = this.props;
    switch (field) {
      case 'password':
        if (!value) {
          callback(formatMessage({ id: 'password.validate.isEmpty' }));
        } else if (value.length < 8) {
          callback(formatMessage({ id: 'password.validate.inLength' }));
        } else if (!RegExp.password.test(value)) {
          callback(formatMessage({ id: 'password.validate.isFormatted' }));
        } else {
          callback();
        }
        break;
      case 'confirm':
        if (!value) {
          callback(formatMessage({ id: 'confirm.validate.isEmpty' }));
        } else if (getFieldValue('password') !== value) {
          callback(formatMessage({ id: 'confirm.validate.isEqual' }));
        } else {
          callback();
        }
        break;
      default:
        callback();
    }
  };

  getCode = () => {
    // TODO 真正发送验证码的逻辑
  };

  onSubmit = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        // TODO 通过短信重置密码的逻辑
        console.log(values);
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { resetSuccess, notice } = this.state;

    return (
      <div className={styles['register-wrapper']}>
        {resetSuccess ? (
          <>
            <ResultInfo
              {...{
                title: formatMessage({ id: 'reset.success' }),
                description: formatMessage({ id: 'reset.countDown' }),
                countInit: 3,
              }}
            />
          </>
        ) : (
          <>
            <Form className={styles['register-form']}>
              {notice && (
                <Form.Item>
                  <Alert
                    message={formatMessage({ id: ALERT_NOTICE_MAP[notice] })}
                    type="error"
                    showIcon
                  />
                </Form.Item>
              )}
              <Form.Item>
                {getFieldDecorator('mobile', {
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
                })(
                  <Input
                    addonBefore="+86"
                    size="large"
                    maxLength={11}
                    placeholder={formatMessage({ id: 'mobile.placeholder' })}
                  />
                )}
              </Form.Item>
              <Form.Item>
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
                      inputProps: {
                        size: 'large',
                        placeholder: formatMessage({ id: 'mobile.code.placeholder' }),
                      },
                      buttonProps: {
                        size: 'large',
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
              <Form.Item>
                {getFieldDecorator('password', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      validator: (rule, value, callback) =>
                        this.customValidate('password', rule, value, callback),
                    },
                  ],
                })(
                  <Input
                    type="password"
                    size="large"
                    placeholder={formatMessage({ id: 'password.placeholder' })}
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('confirm', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      validator: (rule, value, callback) =>
                        this.customValidate('confirm', rule, value, callback),
                    },
                  ],
                })(
                  <Input
                    type="password"
                    size="large"
                    placeholder={formatMessage({ id: 'confirm.placeholder' })}
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" size="large" block onClick={this.onSubmit}>
                  {formatMessage({ id: 'btn.confirm' })}
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </div>
    );
  }
}

export default MobileReset;
