import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Input, Button } from 'antd';
import ResultInfo from '@/components/ResultInfo';
import * as RegExp from '@/constants/regexp';
import styles from './ResetPassword.less';

@Form.create()
class PasswordReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetSuccess: false,
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

  onSubmit = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        // TODO 通过邮件重置密码的逻辑
        console.log(values);
      }
    });
  };

  render() {
    const { resetSuccess } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <>
        {resetSuccess ? (
          <ResultInfo
            {...{
              title: formatMessage({ id: 'reset.success' }),
              description: formatMessage({ id: 'reset.countDown' }),
              countInit: 3,
            }}
          />
        ) : (
          <div className={styles['reset-wrapper']}>
            <h4 className={styles['reset-title']}>{formatMessage({ id: 'reset.title' })}</h4>
            <h4>{formatMessage({ id: 'reset.mail.account' })} xxxx@sunmi.com </h4>
            <Form>
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
                  <Input size="large" placeholder={formatMessage({ id: 'password.placeholder' })} />
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
          </div>
        )}
      </>
    );
  }
}

export default PasswordReset;
