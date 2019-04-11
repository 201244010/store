import React, { Component } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { formatMessage } from 'umi/locale';
import Captcha from '@/components/Captcha';
import ImgCaptcha from '@/components/Captcha/ImgCaptcha';
import styles from '@/pages/Register/Register.less';
import ResultInfo from '@/components/ResultInfo';
import { customValidate } from '@/utils/customValidate';
import { connect } from 'dva';
import { encryption } from '@/utils/utils';
import { ERROR_OK } from '@/constants/errorCode';

// TODO 根据 error code 显示不同的错误信息，等待 error code
const ALERT_NOTICE_MAP = {
  '000': 'alert.mobile.not.registered',
};

@connect(
  state => ({
    user: state.user,
    sso: state.sso,
  }),
  dispatch => ({
    resetPassword: payload => dispatch({ type: 'user/resetPassword', payload }),
    sendCode: payload => dispatch({ type: 'sso/sendCode', payload }),
  })
)
@Form.create()
class MobileReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetSuccess: false,
      notice: '',
    };
  }

  getCode = async () => {
    const {
      form: { getFieldValue },
      sso: { needImgCaptcha, imgCaptcha },
      sendCode,
    } = this.props;

    const response = await sendCode({
      options: {
        username: getFieldValue('username'),
        type: '2',
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
      Object.keys(ALERT_NOTICE_MAP).includes(response.code)
    ) {
      this.setState({
        notice: response.code,
      });
    }
  };

  onSubmit = () => {
    const {
      form: { validateFields },
      resetPassword,
    } = this.props;
    validateFields(async (err, values) => {
      if (!err) {
        const options = {
          ...values,
          password: encryption(values.password),
        };

        const response = await resetPassword({ options });
        if (response && response.code === ERROR_OK) {
          this.setState({
            resetSuccess: true,
          });
        }
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      sso: { needImgCaptcha, imgCaptcha },
    } = this.props;
    const { resetSuccess, notice } = this.state;

    return (
      <div className={styles['register-wrapper']}>
        {resetSuccess ? (
          <ResultInfo
            {...{
              title: formatMessage({ id: 'reset.success' }),
              description: formatMessage({ id: 'reset.countDown' }),
              countInit: 3,
            }}
          />
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
