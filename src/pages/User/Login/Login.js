import React, { Component } from 'react';
import { formatMessage, getLocale } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import { Tabs, Form, Input, Button, Icon, Alert, Modal } from 'antd';
import { encryption } from '@/utils/utils';
import Captcha from '@/components/Captcha';
import ImgCaptcha from '@/components/Captcha/ImgCaptcha';
import styles from './Login.less';
import { ERROR_OK, ALERT_NOTICE_MAP } from '@/constants/errorCode';

const VALIDATE_FIELDS = {
  tabAccount: ['username', 'password'],
  tabMobile: ['phone', 'code'],
};

@connect(
  state => ({
    user: state.user,
    sso: state.sso,
  }),
  dispatch => ({
    userLogin: payload => dispatch({ type: 'user/login', payload }),
    checkImgCode: payload => dispatch({ type: 'user/checkImgCode', payload }),
    checkUser: payload => dispatch({ type: 'sso/checkUser', payload }),
    sendCode: payload => dispatch({ type: 'sso/sendCode', payload }),
    getImageCode: () => dispatch({ type: 'sso/getImageCode' }),
  })
)
@Form.create()
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notice: '',
      currentTab: 'tabAccount',
      trigger: false,
    };
  }

  onTabChange = tabName => {
    this.setState({
      notice: '',
      currentTab: tabName,
    });
  };

  getCode = async (params = {}) => {
    const { imageStyle = {} } = params;
    const {
      form: { getFieldValue },
      sendCode,
      sso: { imgCaptcha, needImgCaptcha },
    } = this.props;

    const response = await sendCode({
      options: {
        username: getFieldValue('phone'),
        type: '2',
        imgCode: getFieldValue('vcode') || '',
        key: needImgCaptcha ? imgCaptcha.key : '',
        width: 112,
        height: 40,
        fontSize: 18,
        ...imageStyle,
      },
    });

    if (response && response.code === ERROR_OK) {
      this.setState({
        trigger: true,
      });
    } else if (response && !response.data) {
      if (Object.keys(ALERT_NOTICE_MAP).includes(`${response.code}`)) {
        this.setState({
          trigger: false,
          notice: response.code,
        });
      }
    }

    return response;
  };

  showAccountMergeModal = (path = '/') => {
    Modal.confirm({
      icon: 'info-circle',
      title: formatMessage({ id: 'account.merge.title' }),
      content: formatMessage({ id: 'account.merge.content' }),
      okText: formatMessage({ id: 'btn.confirm' }),
      cancelText: formatMessage({ id: 'btn.cancel' }),
      onOk: () => window.open(path),
    });
  };

  handleResponse = async response => {
    const {
      form: { getFieldValue },
      checkUser,
    } = this.props;

    if (response && response.code === ERROR_OK) {
      const { currentTab } = this.state;
      const checkUserName =
        currentTab === 'tabAccount' ? getFieldValue('username') : getFieldValue('phone');
      const result = await checkUser({ options: { username: checkUserName } });
      if (result && result.code === ERROR_OK) {
        const data = result.data || {};
        if (data.needMerge) {
          this.showAccountMergeModal(data.url);
        } else {
          router.push('/');
        }
      }
    } else if (Object.keys(ALERT_NOTICE_MAP).includes(`${response.code}`)) {
      this.setState({
        notice: response.code || '',
      });
    }
  };

  doLogin = async (loginType, values) => {
    const { userLogin } = this.props;
    const options = {
      ...values,
      password: encryption(values.password),
    };

    const response = await userLogin({
      type: loginType,
      options,
    });
    this.handleResponse(response);
  };

  onSubmit = () => {
    const {
      form: { validateFields, getFieldValue },
      user: { errorTimes },
      sso: { imgCode },
      checkImgCode,
    } = this.props;
    const { currentTab } = this.state;
    const loginType = currentTab === 'tabAccount' ? 'login' : 'quickLogin';

    validateFields(VALIDATE_FIELDS[currentTab], async (err, values) => {
      if (!err) {
        if (errorTimes > 2 && currentTab === 'tabAccount') {
          const result = await checkImgCode({
            options: {
              code: getFieldValue('vcode') || '',
              key: imgCode.key || '',
            },
          });

          if (result && result.code === ERROR_OK) {
            this.doLogin(loginType, values);
          }
        } else {
          this.doLogin(loginType, values);
        }
      }
    });
  };

  render() {
    const { notice, trigger } = this.state;
    const {
      form: { getFieldDecorator },
      getImageCode,
      sso: { imgCode, imgCaptcha, needImgCaptcha },
      user: { errorTimes },
    } = this.props;
    const currentLanguage = getLocale();

    return (
      <div className={styles['login-warp']}>
        <Form>
          <Tabs
            animated={false}
            defaultActiveKey="tabAccount"
            tabBarStyle={{ textAlign: 'center' }}
            onChange={this.onTabChange}
          >
            <Tabs.TabPane tab={formatMessage({ id: 'login.useAccount' })} key="tabAccount">
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
                      message: formatMessage({ id: 'account.validate.isEmpty' }),
                    },
                  ],
                })(
                  <Input
                    prefix={<Icon type="border" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    size="large"
                    placeholder={formatMessage({ id: 'account.account.placeholder' })}
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'account.password.validate.isEmpty' }),
                    },
                  ],
                })(
                  <Input
                    type="password"
                    prefix={<Icon type="border" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    size="large"
                    placeholder={formatMessage({ id: 'account.password.placeholder' })}
                  />
                )}
              </Form.Item>
              {errorTimes > 2 && (
                <Form.Item>
                  {getFieldDecorator('vcode', {
                    validateTrigger: 'onBlur',
                    rules: [
                      { required: true, message: formatMessage({ id: 'code.validate.isEmpty' }) },
                    ],
                  })(
                    <ImgCaptcha
                      {...{
                        imgUrl: imgCode.url,
                        inputProps: {
                          size: 'large',
                          placeholder: formatMessage({ id: 'vcode.placeholder' }),
                        },
                        getImageCode,
                      }}
                    />
                  )}
                </Form.Item>
              )}
            </Tabs.TabPane>
            {currentLanguage === 'zh-CN' && (
              <Tabs.TabPane tab={formatMessage({ id: 'login.useMobile' })} key="tabMobile">
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
                  })(
                    <Input
                      prefix={<Icon type="border" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      size="large"
                      placeholder={formatMessage({ id: 'mobile.placeholder' })}
                    />
                  )}
                </Form.Item>

                <Modal visible={needImgCaptcha} footer={null} maskClosable={false}>
                  <div>
                    <Form.Item>
                      {getFieldDecorator('vcode', {
                        validateTrigger: 'onBlur',
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'code.validate.isEmpty' }),
                          },
                        ],
                      })(
                        <ImgCaptcha
                          {...{
                            type: 'vertical',
                            imgUrl: imgCaptcha.url,
                            inputProps: {
                              size: 'large',
                              placeholder: formatMessage({ id: 'vcode.placeholder' }),
                            },
                            initial: false,
                            getImageCode: () => this.getCode(),
                            autoCheck: true,
                            refreshCheck: result => !(result && result.code === ERROR_OK),
                          }}
                        />
                      )}
                    </Form.Item>
                  </div>
                </Modal>

                <Form.Item>
                  {getFieldDecorator('code', {
                    validateTrigger: 'onBlur',
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'code.validate.isEmpty',
                        }),
                      },
                    ],
                  })(
                    <Captcha
                      {...{
                        trigger,
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
              </Tabs.TabPane>
            )}
          </Tabs>
          <Form.Item>
            <Button size="large" type="primary" block onClick={this.onSubmit}>
              {formatMessage({ id: 'btn.login' })}
            </Button>
          </Form.Item>
        </Form>
        <div className={styles['login-footer']}>
          <Link to="/user/resetPassword">{formatMessage({ id: 'link.forgot.password' })}</Link>
          <Link to="/user/register">{formatMessage({ id: 'link.to.register' })}</Link>
        </div>
      </div>
    );
  }
}

export default Login;
