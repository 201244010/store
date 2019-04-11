import React, { Component } from 'react';
import AuthorithCheck from '@/components/AuthorithCheck';
import { connect } from 'dva';
import BasicInfo from './BasicInfo';
import Security from './Security';
import Store from './Store';
import * as styles from './Account.less';

@connect(state => ({
  user: state.user,
}))
@AuthorithCheck
class UserCenter extends Component {
  render() {
    const { user } = this.props;

    return (
      <div className={styles['account-wrapper']}>
        <BasicInfo
          {...{
            user,
          }}
        />
        <Security />
        <Store />
      </div>
    );
  }
}

export default UserCenter;
