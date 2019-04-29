import React, { Component } from 'react';
import * as CookieUtil from '@/utils/cookies';
import router from 'umi/router';

function AuthorithCheck(WrappedComponent) {
    return class extends Component {
        componentDidMount() {
            this.authorityCheck();
        }

        authorityCheck = () => {
            const token = CookieUtil.getCookieByKey(CookieUtil.TOKEN_KEY);
            if (!token) {
                router.push('/user/login');
            }
        };

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}

export default AuthorithCheck;
