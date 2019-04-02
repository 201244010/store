import React, { Component } from 'react';
import { formatMessage, getLocale } from 'umi/locale';
import Link from 'umi/link';
import { Tabs, Form, Input, Button, Icon, Alert, Row, Col, Modal } from 'antd';
import styles from './Login.less';

// TODO 根据 error code 显示不同的错误信息，等待 error code
const ALERT_NOTICE_MAP = {
  '000': 'login.mobile.notExist',
  '001': 'login.input.error',
  '002': 'login.code.error',
  '003': 'login.code.expired',
};

const VALIDATE_FIELDS = {
  tabAccount: ['account', 'password'],
  tabMobile: ['mobile', 'code'],
};

@Form.create()
class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.countdownTimer = null;
    this.state = {
      isCountDown: false,
      countDownSeconds: 60,
      notice: '',
      currentTab: 'tabAccount',
    };
  }

  componentWillUnmount() {
    clearInterval(this.countdownTimer);
  }

  onTabChange = () => {
    this.setState({
      notice: '',
    });
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
      }
      this.setState({
        countDownSeconds: countDownSeconds - 1,
      });
    }, 1000);
  };

  getCode = () => {
    this.setState({
      isCountDown: true,
    });

    this.resendCountDown();
    // TODO 真正发送验证码的逻辑
  };

  showAccountMergeModal = () => {
    Modal.confirm({
      icon: 'info-circle',
      title: formatMessage({ id: 'login.account.merge.title' }),
      content: formatMessage({ id: 'login.account.merge.content' }),
      okText: formatMessage({ id: 'login.account.merge.confirm' }),
      cancelText: formatMessage({ id: 'login.account.merge.cancel' }),
      // TODO 等真正的 URL
      onOk: () => window.open('/login'),
    });
  };

  onSubmit = () => {
    const {
      form: { validateFields },
    } = this.props;
    const { currentTab } = this.state;
    validateFields(VALIDATE_FIELDS[currentTab], (err, values) => {
      console.log(values);
      if (!err) {
        // TODO 通过校验后登录处理
        console.log('passed');

        // TODO 根据返回值来判断是否要显示账号合并
        this.showAccountMergeModal();
      }
    });
  };

  render() {
    const { notice, isCountDown, countDownSeconds } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const currentLanguage = getLocale();

    return (
      <div className={styles['login-warp']}>
        <div className={styles['login-title']} />
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
                      message: formatMessage({ id: 'login.account.emptyValidate' }),
                    },
                  ],
                })(
                  <Input
                    prefix={<Icon type="border" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    size="large"
                    placeholder={formatMessage({ id: 'login.account.placeholder' })}
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'login.password.emptyValidate' }),
                    },
                  ],
                })(
                  <Input
                    type="password"
                    prefix={<Icon type="border" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    size="large"
                    placeholder={formatMessage({ id: 'login.password.placeholder' })}
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
                        message: formatMessage({ id: 'login.mobile.emptyValidate' }),
                      },
                      {
                        pattern: /^1\d{10}$/,
                        message: formatMessage({ id: 'login.mobile.formatValidate' }),
                      },
                    ],
                  })(
                    <Input
                      prefix={<Icon type="border" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      size="large"
                      placeholder={formatMessage({ id: 'login.mobile.placeholder' })}
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
                            message: formatMessage({
                              id: 'login.code.emptyValidate',
                            }),
                          },
                        ],
                      })(
                        <Input
                          prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          size="large"
                          placeholder={formatMessage({ id: 'login.code.placeholder' })}
                        />
                      )}
                    </Col>
                    <Col span={8}>
                      <Button size="large" block disabled={isCountDown} onClick={this.getCode}>
                        {isCountDown
                          ? `${countDownSeconds}${formatMessage({ id: 'login.countDown.unit' })}`
                          : formatMessage({ id: 'login.getCode' })}
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Tabs.TabPane>
            )}
          </Tabs>
          <Form.Item>
            <Button type="primary" block onClick={this.onSubmit}>
              {formatMessage({ id: 'login.loginBtn' })}
            </Button>
          </Form.Item>
        </Form>
        <div className={styles['login-footer']}>
          <Link to="/">{formatMessage({ id: 'login.forgot.password' })}</Link>
          <Link to="/register">{formatMessage({ id: 'login.goRegister' })}</Link>
        </div>
      </div>
    );
  }
}

export default LoginForm;
