import React, { Component } from 'react';
import { Result } from 'ant-design-pro';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import styles from './MailActive.less';

class MailActive extends Component {
  constructor(props) {
    super(props);
    this.countDownTimer = null;
    this.state = {
      loginCount: 3,
    };
  }

  componentDidMount() {
    this.loginCountDown();
  }

  componentWillUnmount() {
    clearInterval(this.countDownTimer);
  }

  goIndex = () => {
    clearInterval(this.countDownTimer);
    router.push('/');
  };

  loginCountDown = () => {
    clearInterval(this.countDownTimer);
    this.countDownTimer = setInterval(() => {
      const { loginCount } = this.state;
      if (loginCount <= 0) {
        this.goIndex();
      } else {
        this.setState({
          loginCount: loginCount - 1,
        });
      }
    }, 1000);
  };

  render() {
    const { loginCount } = this.state;
    return (
      <Result
        className={styles['result-wrapper']}
        type="success"
        title={
          <div className={styles['result-title']}>
            {formatMessage({ id: 'mail.active.title' })}
            xxxx@sunmi.com
            {formatMessage({ id: 'mail.active.success' })}
          </div>
        }
        description={
          <div className={styles['result-content']}>
            <span className={styles['result-count']}>{`${loginCount}`}</span>
            {formatMessage({ id: 'mail.active.notice' })}
          </div>
        }
      />
    );
  }
}

export default MailActive;
