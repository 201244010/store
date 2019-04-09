import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Card, List } from 'antd';
import { ChangePassword, ChangeMobile, ChangeMail } from '@/components/Modal';
import * as styles from './Account.less';

const RENDER_MODAL = {
  password: ChangePassword,
  mobile: ChangeMobile,
  mail: ChangeMail,
  default: () => <div />,
};

class Security extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showChangeModal: false,
      modalType: '',
    };
  }

  openChangeModal = type => {
    this.setState({
      showChangeModal: true,
      modalType: type,
    });
  };

  handleModalSubmit = values => {
    // const { modalType } = this.state;
    // TODO 根据弹窗的类型进行提交操作
    console.log(values);
  };

  closeChangeModal = () => {
    this.setState({
      showChangeModal: false,
      modalType: '',
    });
  };

  render() {
    const { showChangeModal, modalType } = this.state;
    const { mobileBinded = true, mailBinded = true } = this.props;
    const RenderModal = RENDER_MODAL[modalType] || RENDER_MODAL.default;

    return (
      <>
        <Card style={{ marginTop: '15px' }}>
          <h2>{formatMessage({ id: 'userCenter.security.title' })}</h2>
          <List className={styles['list-wrapper']}>
            <List.Item>
              <div className={styles['list-item']}>
                <div className={styles['title-wrapper-between']}>
                  <h4>{formatMessage({ id: 'userCenter.security.password' })}</h4>
                  <a href="javascript:void(0);" onClick={() => this.openChangeModal('password')}>
                    {formatMessage({ id: 'btn.alter' })}
                  </a>
                </div>
                <div>{formatMessage({ id: 'userCenter.security.password.description' })}</div>
              </div>
            </List.Item>
            <List.Item>
              <div className={styles['list-item']}>
                <div className={styles['title-wrapper-between']}>
                  <h4>{formatMessage({ id: 'userCenter.security.mobile' })}</h4>
                  <a href="javascript:void(0);" onClick={() => this.openChangeModal('mobile')}>
                    {mobileBinded
                      ? formatMessage({ id: 'btn.alter' })
                      : formatMessage({ id: 'btn.bind' })}
                  </a>
                </div>
                <div>
                  {formatMessage({ id: 'userCenter.security.mobile.description' })}
                  <span>138****8293</span>
                </div>
              </div>
            </List.Item>
            <List.Item>
              <div className={styles['list-item']}>
                <div className={styles['title-wrapper-between']}>
                  <h4>{formatMessage({ id: 'userCenter.security.mail' })}</h4>
                  <a href="javascript:void(0);" onClick={() => this.openChangeModal('mail')}>
                    {mailBinded
                      ? formatMessage({ id: 'btn.alter' })
                      : formatMessage({ id: 'btn.bind' })}
                  </a>
                </div>
                <div>{formatMessage({ id: 'userCenter.security.mail.description' })}</div>
              </div>
            </List.Item>
          </List>
        </Card>
        <RenderModal
          {...{
            visible: showChangeModal,
            mobileBinded,
            mailBinded,
            onOk: this.handleModalSubmit,
            onCancel: this.closeChangeModal,
          }}
        />
      </>
    );
  }
}

export default Security;
