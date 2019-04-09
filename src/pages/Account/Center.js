import React, { Component } from 'react';
import AuthorithCheck from '@/components/AuthorithCheck';

@AuthorithCheck
class UserCenter extends Component {
  render() {
    return <div>用户中心</div>;
  }
}

export default UserCenter;
