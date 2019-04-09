import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Alert } from 'antd';
import { Result } from 'ant-design-pro';
import ResultInfo from '@/components/ResultInfo';
import Captcha from '@/components/Captcha';
import { formatMessage, getLocale } from 'umi/locale';
import Link from 'umi/link';
import { customValidate } from '@/utils/customValidate';
import styles from './Register.less';

// TODO 根据 error code 显示不同的错误信息，等待 error code
const ALERT_NOTICE_MAP = {
  '000': 'alert.mobile.existed',
  '001': 'alert.mail.existed',
  '002': 'alert.code.error',
  '003': 'alert.code.expired',
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
            {formatMessage({ id: 'btn.mail.check' })}
          </Button>
          <Button type="default" size="large" href="/login">
            {formatMessage({ id: 'btn.back.index' })}
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
    this.state = {
      notice: '',
      registerSuccess: false,
    };
  }

  getCode = () => {
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
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { notice, registerSuccess } = this.state;
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
                </>
              ) : (
                <Form.Item>
                  {getFieldDecorator('mail', {
                    validateTrigger: 'onBlur',
                    rules: [
                      {
                        validator: (rule, value, callback) =>
                          customValidate({
                            field: 'mail',
                            rule,
                            value,
                            callback,
                          }),
                      },
                    ],
                  })(
                    <Input size="large" placeholder={formatMessage({ id: 'mail.placeholder' })} />
                  )}
                </Form.Item>
              )}
              <Form.Item>
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
                        customValidate({
                          field: 'confirm',
                          rule,
                          value,
                          callback,
                          extra: {
                            getFieldValue,
                          },
                        }),
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
            </Form>
            <Row type="flex" justify="space-between" align="middle">
              <Col span={10}>
                <Button type="primary" size="large" block onClick={this.onSubmit}>
                  {formatMessage({ id: 'btn.register' })}
                </Button>
              </Col>
              <Col span={8}>
                <Link to="/login">{formatMessage({ id: 'link.to.login' })}</Link>
              </Col>
            </Row>
          </>
        )}
      </div>
    );
  }
}

export default Register;
