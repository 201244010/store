import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Alert } from 'antd';
import { Result } from 'ant-design-pro';
import ResultInfo from '@/components/ResultInfo';
import Captcha from '@/components/Captcha';
import ImgCaptcha from '@/components/Captcha/ImgCaptcha';
import { formatMessage, getLocale } from 'umi/locale';
import Link from 'umi/link';
import { connect } from 'dva';
import { customValidate } from '@/utils/customValidate';
import { encryption } from '@/utils/utils';
import styles from './Register.less';
import { ERROR_OK, ALERT_NOTICE_MAP } from '@/constants/errorCode';

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
          <Button type="default" size="large" href="/user/login">
            {formatMessage({ id: 'btn.back.index' })}
          </Button>
        </div>
      }
    />
  );
};

@connect(
  state => ({
    user: state.user,
    sso: state.sso,
  }),
  dispatch => ({
    register: payload => dispatch({ type: 'user/register', payload }),
    sendCode: payload => dispatch({ type: 'sso/sendCode', payload }),
  })
)
@Form.create()
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notice: '',
      registerSuccess: false,
    };
  }

  getCode = async () => {
    const {
      form: { getFieldValue },
      sendCode,
      sso: { needImgCaptcha, imgCaptcha },
    } = this.props;

    const response = await sendCode({
      options: {
        username: getFieldValue('username'),
        type: '1',
        imgCode: getFieldValue('vcode') || '',
        key: needImgCaptcha ? imgCaptcha.key : '',
        width: 112,
        height: 40,
        fontSize: 18,
      },
    });

    if (
      response &&
      response.code !== ERROR_OK &&
      Object.keys(ALERT_NOTICE_MAP).includes(`${response.code}`)
    ) {
      this.setState({
        notice: response.code,
      });
    }
  };

  handleResponse = response => {
    if (response && response.code === ERROR_OK) {
      this.setState({
        registerSuccess: true,
      });
    } else if (response && Object.keys(ALERT_NOTICE_MAP).includes(response.code)) {
      this.setState({
        notice: response.code,
        registerSuccess: false,
      });
    }
  };

  onSubmit = () => {
    const {
      form: { validateFields },
      register,
    } = this.props;
    validateFields(async (err, values) => {
      if (!err) {
        const options = {
          ...values,
          password: encryption(values.password),
        };

        const response = await register({ options });
        this.handleResponse(response);
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      sso: { needImgCaptcha, imgCaptcha },
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
              <MailRegisterSuccess props={{ mail: getFieldValue('username') }} />
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
                    {getFieldDecorator('username', {
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
                  {needImgCaptcha && (
                    <Form.Item>
                      {getFieldDecorator('vcode')(
                        <ImgCaptcha
                          {...{
                            imgUrl: imgCaptcha.url,
                            inputProps: {
                              size: 'large',
                            },
                            initial: false,
                            getImageCode: () => this.getCode(),
                          }}
                        />
                      )}
                    </Form.Item>
                  )}
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
                  {getFieldDecorator('username', {
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
                <Link to="/user/login">{formatMessage({ id: 'link.to.login' })}</Link>
              </Col>
            </Row>
          </>
        )}
      </div>
    );
  }
}

export default Register;
