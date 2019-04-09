import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Card, Avatar, Input, Upload, Icon } from 'antd';
import * as styles from './Account.less';

class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameEditing: false,
      username: 'momo.zxy',
    };
  }

  handleUserNameChange = e => {
    this.setState({
      username: e.target.value,
    });
  };

  saveUsernameChange = () => {
    // TODO 保存用户名
    this.setState({
      nameEditing: false,
    });
  };

  editUsername = () => {
    this.setState({
      nameEditing: true,
    });
  };

  render() {
    const { nameEditing, username } = this.state;
    const { loading = false } = this.props;
    const uploadProps = {};

    return (
      <Card loading={loading}>
        <h2>{formatMessage({ id: 'userCenter.basicInfo.title' })}</h2>
        <div className={styles['basicInfo-wrapper']}>
          <div className={styles['avatar-wrapper']}>
            <Avatar size={80} icon="user" />
            <div className={styles['avatar-link']}>
              <Upload {...uploadProps}>
                <a href="javascript:void(0);">{formatMessage({ id: 'avatar.change' })}</a>
              </Upload>
            </div>
          </div>
          <div className={styles['username-wrapper']}>
            {nameEditing ? (
              <Input
                autoFocus="autofocus"
                value={username}
                onChange={this.handleUserNameChange}
                onBlur={this.saveUsernameChange}
              />
            ) : (
              <div>
                <span>{username}</span>
                <Icon className={styles['edit-icon']} type="edit" onClick={this.editUsername} />
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }
}

export default BasicInfo;
