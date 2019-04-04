import React, { Component } from 'react';
import { formatMessage, getLocale } from 'umi/locale';
import { Divider } from 'antd';
import BigIcon from '@/components/BigIcon';
import Register from '../Register/Register';
import MobileReset from './MobileReset';
import styles from './ResetPassword.less';

const ResetInit = props => {
  const { switchStep } = props;
  return (
    <>
      <div className={styles['reset-content']}>
        <div className={styles['bigIcon-wrapper']} onClick={() => switchStep('toMobile')}>
          <BigIcon {...{ type: 'mobile' }} />
          <div className={styles['icon-description']}>
            {formatMessage({ id: 'reset.by.mobile' })}
          </div>
        </div>
        <Divider
          type="vertical"
          dashed
          style={{ height: '90px', borderRight: '1px dashed #e8e8e8' }}
        />
        <div className={styles['bigIcon-wrapper']} onClick={() => switchStep('toMail')}>
          <BigIcon {...{ type: 'mail' }} />
          <div className={styles['icon-description']}>{formatMessage({ id: 'reset.by.mail' })}</div>
        </div>
      </div>
    </>
  );
};

const RENDER_COMPONENT = {
  toMobile: MobileReset,
  toMail: '',
  default: () => <div />,
};

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'init',
    };
  }

  switchStep = step => {
    this.setState({
      step,
    });
  };

  getRenderComponent = () => {
    const { step } = this.state;
    const currentLanguage = getLocale();
    let RenderComponent = RENDER_COMPONENT.default;

    if (step === 'init') {
      RenderComponent = currentLanguage === 'zh-CN' ? ResetInit : Register;
    } else {
      RenderComponent = RENDER_COMPONENT[step];
    }

    return RenderComponent;
  };

  render() {
    const RenderComponent = this.getRenderComponent();

    return (
      <div className={styles['reset-wrapper']}>
        <h4 className={styles['reset-title']}>{formatMessage({ id: 'reset.title' })}</h4>
        <RenderComponent switchStep={this.switchStep} />
      </div>
    );
  }
}

export default ResetPassword;
