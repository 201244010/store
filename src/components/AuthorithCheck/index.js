import React, { Component } from 'react';
// import Storage from '@konata9/storage.js';
// import router from 'umi/router';

function AuthorithCheck(WrappedComponent) {
  return class extends Component {
    componentDidMount() {
      this.authorityCheck();
    }

    authorityCheck = () => {
      // TODO 权限控制逻辑
      // const userInfo = Storage.get('__USER_INFO__');
      // if (!userInfo) {
      //   router.push('/login');
      // }
    };

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default AuthorithCheck;
