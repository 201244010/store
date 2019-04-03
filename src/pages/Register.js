import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { formatMessage, getLocale } from 'umi/locale';
import Link from 'umi/link';
import styles from './Register.less';

@Form.create()
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSubmit = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      console.log(values);
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const currentLanguage = getLocale();
    return (
      <div className={styles['register-wrapper']}>
        <h3>{formatMessage({ id: 'register.title' })}</h3>
        <Form className={styles['register-form']}>
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
                    <Button size="large" block>
                      {formatMessage({ id: 'register.mobile.getCode' })}
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
                    required: true,
                    message: formatMessage({ id: 'register.mail.emptyValidate' }),
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
                  required: true,
                  message: formatMessage({ id: 'register.password.emptyValidate' }),
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
                  required: true,
                  message: formatMessage({ id: 'register.confirm.emptyValidate' }),
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
      </div>
    );
  }
}

export default Register;
