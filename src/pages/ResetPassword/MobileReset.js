import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import * as RegExp from '@/constants/regexp';
import styles from '@/pages/Register/Register.less';
import ResultInfo from '@/pages/Register/Register';

@Form.create()
class MobileReset extends Component {
  constructor(props) {
    super(props);
    this.countdownTimer = null;
    this.state = {
      resetSuccess: false,
      isCountDown: false,
      countDownSeconds: 60,
    };
  }

  componentWillUnmount() {
    clearInterval(this.countdownTimer);
  }

  customValidate = (field, rule, value, callback) => {
    const {
      form: { getFieldValue },
    } = this.props;
    switch (field) {
      case 'password':
        if (!value) {
          callback(formatMessage({ id: 'register.password.emptyValidate' }));
        } else if (value.length < 8) {
          callback(formatMessage({ id: 'register.password.formatLengthValidate' }));
        } else if (!RegExp.password.test(value)) {
          callback(formatMessage({ id: 'register.password.formatContentValidate' }));
        } else {
          callback();
        }
        break;
      case 'confirm':
        if (!value) {
          callback(formatMessage({ id: 'register.confirm.emptyValidate' }));
        } else if (getFieldValue('password') !== value) {
          callback(formatMessage({ id: 'register.confirm.valueValidate' }));
        } else {
          callback();
        }
        break;
      default:
        callback();
    }
  };

  resendCountDown = () => {
    clearTimeout(this.countdownTimer);
    this.countdownTimer = setInterval(() => {
      const { countDownSeconds } = this.state;
      if (countDownSeconds <= 0) {
        clearTimeout(this.countdownTimer);
        this.setState({
          isCountDown: false,
          countDownSeconds: 60,
        });
      } else {
        this.setState({
          countDownSeconds: countDownSeconds - 1,
        });
      }
    }, 1000);
  };

  getCode = () => {
    this.setState({
      isCountDown: true,
    });

    this.resendCountDown();
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
    const { resetSuccess, isCountDown, countDownSeconds } = this.state;

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
              <Form.Item>
                {getFieldDecorator('mobile', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'register.mobile.emptyValidate' }),
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: formatMessage({ id: 'register.mobile.formatValidate' }),
                    },
                  ],
                })(
                  <Input
                    addonBefore="+86"
                    size="large"
                    maxLength={11}
                    placeholder={formatMessage({ id: 'register.mobile.placeholder' })}
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Row gutter={16}>
                  <Col span={16}>
                    {getFieldDecorator('code', {
                      validateTrigger: 'onBlur',
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'register.mobile.emptyValidate' }),
                        },
                      ],
                    })(
                      <Input
                        size="large"
                        placeholder={formatMessage({ id: 'register.mobile.code.placeholder' })}
                      />
                    )}
                  </Col>
                  <Col span={8}>
                    <Button size="large" block disabled={isCountDown} onClick={this.getCode}>
                      {isCountDown
                        ? `${countDownSeconds}${formatMessage({
                            id: 'register.countDown.unit',
                          })}`
                        : formatMessage({ id: 'register.mobile.getCode' })}
                    </Button>
                  </Col>
                </Row>
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
                    placeholder={formatMessage({ id: 'register.password.placeholder' })}
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
                    placeholder={formatMessage({ id: 'register.confirm.placeholder' })}
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" size="large" block onClick={this.onSubmit}>
                  {formatMessage({ id: 'reset.resetBtn' })}
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
