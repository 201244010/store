import React, { Component } from 'react';
import * as CookieUtil from '@/utils/cookies';
import router from 'umi/router';

class AuthorithCheck extends Component {
	componentDidMount() {
		this.authorityCheck();
	}

	authorityCheck = () => {
		const token = CookieUtil.getCookieByKey(CookieUtil.TOKEN_KEY);
		if (!token) {
			router.push('/user/login');
			return false;
		}
		return true;
	};

	render() {
		const { children } = this.props;
		return <>{children}</>;
	}
}

export default AuthorithCheck;
