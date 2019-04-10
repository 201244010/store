import React, { Component } from 'react';
import { formatMessage, getLocale } from 'umi/locale';
import Link from 'umi/link';
import { connect } from 'dva';
import { Tabs, Form, Input, Button, Icon, Alert, Modal } from 'antd';
import Captcha from '@/components/Captcha';
import styles from './Login.less';

// TODO 根据 error code 显示不同的错误信息，等待 error code
const ALERT_NOTICE_MAP = {
  '000': 'alert.mobile.not.registered',
  '001': 'alert.account.error',
  '002': 'alert.code.error',
  '003': 'alert.code.expired',
};

const VALIDATE_FIELDS = {
  tabAccount: ['account', 'password'],
  tabMobile: ['mobile', 'code'],
};

@connect(state => ({
  user: state.user,
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
    // TODO 真正发送验证码的逻辑
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
    validateFields(VALIDATE_FIELDS[currentTab], (err, values) => {
      dispatch({
        type: 'user/login',
        payload: { options: values },
      });
      if (!err) {
        // TODO 通过校验后登录处理
        console.log('passed');

        // TODO 根据返回值来判断是否要显示账号合并
        this.showAccountMergeModal();
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
                {getFieldDecorator('account', {
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
