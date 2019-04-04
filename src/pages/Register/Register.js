import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Alert } from 'antd';
import { Result } from 'ant-design-pro';
import ResultInfo from '@/components/ResultInfo';
import { formatMessage, getLocale } from 'umi/locale';
import Link from 'umi/link';
import * as RegExp from '../../constants/regexp';
import styles from './Register.less';

// TODO 根据 error code 显示不同的错误信息，等待 error code
const ALERT_NOTICE_MAP = {
  '000': 'register.mobile.existError',
  '001': 'register.mail.existError',
  '002': 'register.code.expired',
  '003': 'register.code.error',
};

const MailRegisterSuccess = ({ props }) => {
  const { mail } = props;
  // TODO 需要增加一个 mail 是否跳转的判断
  return (
    <Result
      className={styles['result-wrapper']}
      type="success"
      title={
        <div className={styles['result-title']}>
          {formatMessage({ id: 'register.account' })}
          {mail}
          {formatMessage({ id: 'register.mail.success' })}
        </div>
      }
      description={
        <div className={styles['result-content']}>
          {formatMessage({ id: 'register.mail.notice' })}
        </div>
      }
      actions={
        <div className={styles['result-action-wrapper']}>
          <Button type="primary" size="large">
            {formatMessage({ id: 'register.mail.check' })}
          </Button>
          <Button type="default" size="large" href="/login">
            {formatMessage({ id: 'register.mail.back' })}
          </Button>
        </div>
      }
    />
  );
};

@Form.create()
class Register extends Component {
  constructor(props) {
    super(props);
    this.countdownTimer = null;
    this.state = {
      notice: '',
      registerSuccess: false,
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
      case 'mail':
        if (!value) {
          callback(formatMessage({ id: 'register.mail.emptyValidate' }));
        } else if (!RegExp.mail.test(value)) {
          callback(formatMessage({ id: 'register.mail.formatValidate' }));
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
      console.log(values);
      if (!err) {
        console.log(values);
        // TODO 等待注册提交逻辑
        this.setState({
          registerSuccess: true,
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { notice, registerSuccess, isCountDown, countDownSeconds } = this.state;
    const currentLanguage = getLocale();
    return (
      <div className={styles['register-wrapper']}>
        {registerSuccess ? (
          <>
            {currentLanguage === 'zh-CN' ? (
              <ResultInfo
                {...{
                  title: formatMessage({ id: 'register.success' }),
                  description: formatMessage({ id: 'register.countDown' }),
                  countInit: 3,
                }}
              />
            ) : (
              <MailRegisterSuccess props={{ mail: 'xxx@sunmi.com' }} />
            )}
          </>
        ) : (
          <>
            <h3>{formatMessage({ id: 'register.title' })}</h3>
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
              {currentLanguage === 'zh-CN' ? (
                <>
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
                </>
              ) : (
                <Form.Item>
                  {getFieldDecorator('mail', {
                    validateTrigger: 'onBlur',
                    rules: [
                      {
                        validator: (rule, value, callback) =>
                          this.customValidate('mail', rule, value, callback),
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      placeholder={formatMessage({ id: 'register.mail.placeholder' })}
                    />
                  )}
                </Form.Item>
              )}
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
            </Form>
            <Row type="flex" justify="space-between" align="middle">
              <Col span={10}>
                <Button type="primary" size="large" block onClick={this.onSubmit}>
                  {formatMessage({ id: 'register.registBtn' })}
                </Button>
              </Col>
              <Col span={8}>
                <Link to="/login">{formatMessage({ id: 'register.goLogin' })}</Link>
              </Col>
            </Row>
          </>
        )}
      </div>
    );
  }
}

export default Register;
