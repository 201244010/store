import React, { Component } from 'react';
import { formatMessage, getLocale } from 'umi/locale';
import Login from 'ant-design-pro/lib/Login';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'tabAccount',
    };
  }

  onTabChange = () => {};

  onSubmit = () => {};

  render() {
    const { type } = this.state;
    console.log(getLocale());
    return (
      <div className="login-warp">
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.onSubmit}>
          <Tab key="tabAccount" tab={formatMessage({ id: 'login.useAccount' })}>
            <UserName
              name="username"
              placeholder={formatMessage({ id: 'login.account.placeholder' })}
            />
            <Password
              name="password"
              placeholder={formatMessage({ id: 'login.password.placeholder' })}
            />
          </Tab>
          <Tab key="tabMobile" tab={formatMessage({ id: 'login.useMobile' })}>
            <Mobile name="mobile" />
            <Captcha onGetCaptcha={() => console.log('Get captcha!')} name="captcha" />
          </Tab>
          <Submit block>{formatMessage({ id: 'login.loginBtn' })}</Submit>
          <div>
            <a href="">{formatMessage({ id: 'login.forgot.password' })}</a>
            <a style={{ float: 'right' }} href="">
              {formatMessage({ id: 'login.register' })}
            </a>
          </div>
        </Login>
      </div>
    );
  }
}
