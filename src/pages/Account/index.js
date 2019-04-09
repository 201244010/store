import React, { Component } from 'react';
import AuthorithCheck from '@/components/AuthorithCheck';
import BasicInfo from './BasicInfo';
import Security from './Security';
import Store from './Store';
import * as styles from './Account.less';

@AuthorithCheck
class UserCenter extends Component {
  render() {
    return (
      <div className={styles['account-wrapper']}>
        <BasicInfo />
        <Security />
        <Store />
      </div>
    );
  }
}

export default UserCenter;
