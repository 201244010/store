import React, { Component } from 'react';
import { formatMessage, getLocale } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import { Tabs, Form, Input, Button, Icon, Alert, Modal } from 'antd';
import { encryption } from '@/utils/utils';
import Captcha from '@/components/Captcha';
import styles from './Login.less';
import { ERROR_OK } from '@/constants/errorCode';

// TODO 根据 error code 显示不同的错误信息，等待 error code
const ALERT_NOTICE_MAP = {
  '3603': 'alert.mobile.not.registered',
  '201': 'alert.account.error',
  '002': 'alert.code.error',
  '208': 'alert.code.expired',
};

const VALIDATE_FIELDS = {
  tabAccount: ['username', 'password'],
  tabMobile: ['phone', 'code'],
};

@connect(state => ({
  user: state.user,
  sso: state.sso,
}))
@Form.create()
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notice: '',
      currentTab: 'tabAccount',
    };
  }

  onTabChange = tabName => {
    this.setState({
      notice: '',
      currentTab: tabName,
    });
  };

  getCode = () => {
    const {
      form: { getFieldValue },
      dispatch,
    } = this.props;

    dispatch({
      type: 'sso/sendCode',
      payload: {
        options: {
          username: getFieldValue('phone'),
          type: '2',
        },
      },
    });
  };

  showAccountMergeModal = () => {
    Modal.confirm({
      icon: 'info-circle',
      title: formatMessage({ id: 'account.merge.title' }),
      content: formatMessage({ id: 'account.merge.content' }),
      okText: formatMessage({ id: 'btn.confirm' }),
      cancelText: formatMessage({ id: 'btn.cancel' }),
      // TODO 等真正的 URL
      onOk: () => window.open('/login'),
    });
  };

  onSubmit = () => {
    const {
      form: { validateFields },
      dispatch,
    } = this.props;
    const { currentTab } = this.state;
    const loginType = currentTab === 'tabAccount' ? 'login' : 'quickLogin';
    validateFields(VALIDATE_FIELDS[currentTab], (err, values) => {
      const options = {
        ...values,
        password: encryption(values.password),
      };

      if (!err) {
        dispatch({
          type: 'user/login',
          payload: { type: loginType, options },
        }).then(response => {
          if (response && response.code === ERROR_OK) {
            // TODO 根据返回值来判断是否要显示账号合并
            // this.showAccountMergeModal();
            // TODO 暂时先跳转到首页
            router.push('/');
          } else if (Object.keys(ALERT_NOTICE_MAP).includes(`${response.code}`)) {
            this.setState({
              notice: response.code || '',
            });
          }
        });
      }
    });
  };

  render() {
    const { notice } = this.state;
    const {
      form: { getFieldDecorator },
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
          <Link to="/resetPassword">{formatMessage({ id: 'link.forgot.password' })}</Link>
          <Link to="/register">{formatMessage({ id: 'link.to.register' })}</Link>
        </div>
      </div>
    );
  }
}

export default Login;
