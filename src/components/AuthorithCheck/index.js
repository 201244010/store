import React, { Component } from 'react';
import Storage from '@konata9/storage.js';
import router from 'umi/router';

function AuthorithCheck(WrappedComponent) {
  return class extends Component {
    componentDidMount() {
      this.authorityCheck();
    }

    authorityCheck = () => {
      const userInfo = Storage.get('__token__');
      if (!userInfo) {
        router.push('/login');
      }
    };

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default AuthorithCheck;
